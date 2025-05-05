const request = require('superagent')
const async = require('async')
const Logger = require('../lib/logger.js')
const {
  product_unlist_item,
  get_item_list,
  product_get_model_list,
  product_get_item_base_info,
  product_get_item_extra_info,
  global_product_create_publish_task,
  global_product_get_publish_task_result,
  product_boost_item,
  global_product_get_published_list,
  discount_add_discount_item
} = require('../constants/path.shopee.js')
const {
  checkMyProduct
} = require('../db/product.js')
const { queryAuth, queryAuthByShopId } = require('../db/auth.js')
const { partner_id, main_account_id, merchant_id, domain } = require('../configs/shopee.test.js')
const { getSign } = require('../utils/crypto.js')
const {
  insertShopeeShopProduct,
  dropShopeeShopProducts,
  updateProductBase,
  updateProductExtra,
  updateProductData,
  updateProductOrder,
  updateProductModelList,
  updateProductInventory
} = require('../db/shopee.shop.js')
const { queryOrder } = require('../db/order.js')

function unlistItems (params) {
  const path = product_unlist_item
  const shopId = params.shop_id
  return new Promise((resolve, reject) => {
    queryAuthByShopId({ shop_id: shopId }).then(data => {
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

      request
        .post(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          access_token: accessToken,
          shop_id: shopId,
          sign
        })
        .send({
          item_list: params.item_list
        })
        .then(result => {
          resolve(JSON.parse(result.text).response)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

function syncItemsList (params) {
  const path = get_item_list
  const shopId = params.shop_id
  const item_status = params.item_status || ['NORMAL']
  return new Promise((resolve, reject) => {
    queryAuthByShopId({ shop_id: shopId }).then(data => {
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)
      dropShopeeShopProducts({ shop_id: shopId }).then(data => {
        getShopeeShopProducts(path, timestamp, accessToken, sign, shopId, params.region, 0, item_status)
      })
      resolve({
        code: 0,
        data: '正在同步'
      })
    })
  })
}

function getShopeeShopProducts (path, timestamp, accessToken, sign, shopId, region, offset, item_status) {
  return new Promise(resolve => {
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign,
        offset,
        page_size: 50,
        item_status
      })
      .then(result => {
        const res = JSON.parse(result.text).response

        if (res.item.length) {
          insertShopeeShopProduct(res.item.map(item => ({ ...item, shop_id: shopId, region, sync_time: Date.now() }))).then(data => {
            const path_base = product_get_item_base_info
            const path_extra = product_get_item_extra_info
            getShopeeShopProductsDetail(path_base, accessToken, shopId, res.item.map(item => item.item_id), 'base')
            getShopeeShopProductsDetail(path_extra, accessToken, shopId, res.item.map(item => item.item_id), 'extra')
          })
        }

        if (res.has_next_page) {
          getShopeeShopProducts(path, timestamp, accessToken, sign, shopId, region, res.next_offset, item_status)
        }
      })
      .catch(err => {
        // console.log(err)
        console.log('err', path)
      })
  })
}

function getShopeeShopProductsDetail (path, accessToken, shopId, itemList, type) {
  const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

  return new Promise(resolve => {
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign,
        item_id_list: itemList
      })
      .then(result => {
        const res = JSON.parse(result.text).response

        const queue = async.queue((task, completed) => {
          setTimeout(() => {
            const remaining = queue.length();
            completed(null, { task, remaining });
          }, 3000);
        }, 100);
        queue.drain(() => {
          console.log('[modelList]Successfully processed all items');
        })
        if (res.item_list.length) {
          res.item_list.forEach(async (item, index) => {
            const temItem = {
              shop_id: shopId,
              item_id: item.item_id
            }
            queue.push('modelList', (error, { task, remaining }) => {
              getModelList(accessToken, shopId, item.item_id)
              if (error) {
                console.log(error)
              }
            })

            if (type === 'base') {
              // if (item.item_sku) {
              //     const productData = await checkMyProduct(item.item_sku)

              //     updateProductInventory({
              //         productData,
              //         ...temItem
              //     })
              // }
              const sku = item.item_sku.split('-')
              if (sku.length === 1) {
                // TODO
                // console.log(item)
                item.supplier_id = Number(item.item_sku.slice(-6, -3))
              } else if (sku.length === 2) {
                item.supplier_id = Number(sku[1])
              }

              temItem.data_base = item
              updateProductBase(temItem)

              const id = temItem.data_base.item_sku.split('-')[0]
              if (id) {
                const productData = await checkMyProduct(id)
                if (productData.length) {
                  updateProductData({
                    ...temItem,
                    data: productData[0]
                  })
                }

                const orders = await queryOrder({
                  items: {
                    $elemMatch: {
                      item_sku: { $regex: id }
                    }
                  }
                })

                if (orders.length) {
                  updateProductOrder({
                    item_id: temItem.item_id,
                    shop_id: temItem.shop_id,
                    orders: orders
                  })
                }

              }
            } else {
              temItem.data_extra = item
              updateProductExtra(temItem)
            }

          })
        }
      })
      .catch(err => {
        // console.log(err)
        console.log('err', path, JSON.stringify(err))
      })
  })
}

function getModelList (accessToken, shopId, itemId) {
  const path = product_get_model_list
  const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

  request
    .get(`${domain}${path}`)
    .set('Content-Type', 'application/json')
    .query({
      partner_id,
      timestamp,
      access_token: accessToken,
      shop_id: shopId,
      sign,
      item_id: itemId
    })
    .then(result => {
      const temItem = {
        shop_id: shopId,
        item_id: itemId
      }
      let list = JSON.parse(result.text).response
      let totalStock = 0
      let hasDiscount = 1
      list.model.forEach(item => {
        totalStock += item.stock_info_v2.summary_info.total_available_stock
        if (item.stock_info_v2.summary_info.total_available_stock && item.price_info[0].current_price === item.price_info[0].original_price) {
          hasDiscount = 0
        }
      })
      list.totalStock = totalStock
      list.hasDiscount = hasDiscount
      temItem.model_list = list
      updateProductModelList(temItem)
    })
    .catch(err => {
      console.log('err', path, itemId)
      console.log(err)
    })
}

function getModelListNew (shopId, itemId) {
  return new Promise((resolve, reject) => {
    queryAuthByShopId({ shop_id: shopId }).then(data => {
      const path = product_get_model_list
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

      request
        .get(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          sign,
          shop_id: shopId,
          access_token: accessToken,
          item_id: itemId
        })
        .then(result => {
          resolve(JSON.parse(result.text))
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}

function getPublishTaskResult (publish_task_id) {
  return new Promise((resolve, reject) => {
    queryAuth({ region: 'merchant' }).then(data => {
      const path = global_product_get_publish_task_result
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, merchant_id)

      request
        .get(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          sign,
          merchant_id: merchant_id,
          access_token: accessToken,
          publish_task_id: Number(publish_task_id)
        })
        .then(result => {
          resolve(JSON.parse(result.text))
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}

function getPublishedList (global_item_id) {
  return new Promise((resolve, reject) => {
    queryAuth({ region: 'merchant' }).then(data => {
      const path = global_product_get_published_list
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, merchant_id)

      request
        .get(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          sign,
          merchant_id: merchant_id,
          access_token: accessToken,
          global_item_id: Number(global_item_id)
        })
        .then(result => {
          resolve(JSON.parse(result.text))
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}

function createPublishTask (params) {
  const path = global_product_create_publish_task
  return new Promise((resolve, reject) => {
    queryAuth({ region: 'merchant' }).then(data => {
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, merchant_id)

      request
        .post(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          access_token: accessToken,
          merchant_id: merchant_id,
          sign,
        })
        .send({
          ...params
        })
        .then(result => {
          resolve(JSON.parse(result.text))
        })
        .catch(err => {
          console.log(err)
        })
    })
  })
}

function boostItem (region, item_id_list, shopId) {
  let itemIdList = item_id_list.slice()
  let result = []

  if (itemIdList.length > 5) {
    let ranNum = 5

    for (let i = 0; i < ranNum; i++) {
      let ran = Math.floor(Math.random() * itemIdList.length)
      result.push(itemIdList.splice(ran, 1)[0])
    }
  } else {
    result = itemIdList
  }

  console.log(result, 'boost result')

  result.forEach(item => {
    boostItemConnecter(region, item, shopId)
  })
}

function boostItemConnecter (region, item_id, shopId) {
  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const path = product_boost_item
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

    request
      .post(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        sign,
        shop_id: shopId,
        access_token: accessToken
      })
      .send({
        item_id_list: [item_id]
      })
      .then(result => {
        Logger.info(`Boost 成功! 地区: ${region} ShopId: ${shopId}`)
        Logger.info(JSON.parse(result.text).response)
      })
      .catch(err => {
        Logger.info(region)
        Logger.error(err)
        if (err.status === 403) {
          return
        }
      })
  })
}

function addDiscountItem (params) {
  return new Promise((resolve, reject) => {
    queryAuthByShopId({ shop_id: params.shop_id }).then(data => {
      const path = discount_add_discount_item
      const accessToken = data[0].access_token
      const { sign, timestamp } = getSign(path, accessToken, undefined, params.shop_id)

      request
        .post(`${domain}${path}`)
        .set('Content-Type', 'application/json')
        .query({
          partner_id,
          timestamp,
          sign,
          shop_id: params.shop_id,
          access_token: accessToken
        })
        .send({
          discount_id: params.discount_id,
          item_list: params.item_list
        })
        .then(result => {
          Logger.info(`折扣成功!`)
          Logger.info(JSON.parse(result.text).response)
          resolve(JSON.parse(result.text).response)
        })
        .catch(err => {
          Logger.error(err)
          reject(err)
          if (err.status === 403) {
            return
          }
        })
    })
  })
}


module.exports = {
  unlistItems,
  syncItemsList,
  createPublishTask,
  boostItem,
  boostItemConnecter,
  getModelListNew,
  getPublishTaskResult,
  getPublishedList,
  addDiscountItem
}
