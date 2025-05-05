const fs = require('fs');
const express = require('express');
const request = require('superagent')
const schedule = require('node-schedule')
const async = require('async');
const { partner_id, main_account_id, merchant_id, domain } = require('../configs/shopee.test.js')
const { getSign } = require('../utils/crypto.js')
var Logger = require('../lib/logger.js')

const {
  global_product_get_category,
  global_product_get_attributes,
  global_product_add_global_item,
  global_product_get_global_item_info,
  global_product_get_global_model_list,
  global_product_get_global_item_list,
  global_product_init_tier_variation,
  global_product_update_tier_variation,
  global_product_get_published_list,
  global_product_get_publishable_shop,
  global_product_create_publish_task,
  global_product_get_publish_task_result,
  global_product_update_stock,
  global_product_update_global_item,
  global_product_update_global_model,
  global_product_add_global_model,
  global_product_delete_global_model,
  logistics_get_channel_list,
  logistics_download_shipping_document,
  logistics_create_shipping_document,
  logistics_get_shipping_document_result,
  logistics_get_tracking_number,
  media_space_upload_image,
  shop_category_get_shop_category_list,
  shop_category_add_item_list,
  discount_get_discount_list,
  discount_get_discount,
  discount_add_discount,
  discount_add_discount_item,
  product_get_item_base_info,
  product_get_item_extra_info,
  product_get_model_list,
  product_update_item,
  product_unlist_item,
  product_delete_item,
  product_get_item_limit,
  product_add_model,
  discount_delete_discount_item,
  product_update_tier_variation,
  product_get_item_promotion,
  bundle_deal_delete_bundle_deal_item,
  add_on_deal_delete_add_on_deal_main_item,
  add_on_deal_delete_add_on_deal_sub_item,
  order_get_order_list,
  order_get_order_detail,
  payment_get_escrow_detail,
  voucher_get_voucher_list,
  voucher_get_voucher,
  voucher_add_voucher,
  follow_prize_get_follow_prize_list,
  follow_prize_get_follow_prize_detail,
  get_item_list,
  bind_first_mile_tracking_number,
  get_channel_list,
  get_shipping_document_data_info,
  first_mile_generate_first_mile_tracking_number,
  shop_flash_sale_get_time_slot_id,
  shop_flash_sale_add_shop_flash_sale_items,
  shop_flash_sale_create_shop_flash_sale,
  shop_flash_sale_get_shop_flash_sale_list
} = require('../constants/path.shopee.js')
const { queryAuth, queryAuthByShopId } = require('../db/auth.js')
const { queryOrder } = require('../db/order.js')

const { batchUnlistByShopId, setDiscountBackEnd } = require('../handlers/shopee.js')

const {
  insertProduct,
  dropProducts,
  queryAllProduct,
  queryProduct,
  updateProductPublishedInfo,
  updateProductProductInfo,
} = require('../db/shopee.global.js')
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

const {
  checkMyProduct
} = require('../db/product.js')
const mongo = require('../lib/model.product.js')
const mongoFirstMile = require('../lib/model.firstmile.js')
const mongoOrder = require('../lib/model.order.js')
const mongoShop = require('../lib/model.shop.js')
const OSS = require('ali-oss')
const config = require('../configs/aliyun.js')
const client = new OSS(config)
const { autoSync, batchUnlistAllShopItems } = require('../handlers/shopee.js')

const {
  shopIdInShopeeMap
} = require('../constants/shopee.js')
const {syncItemsList} = require('../connecters/shopee.js')

const router = express.Router();

router.get('/getCategory', function(req, res, next) {
  const path = global_product_get_category

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getChannelList', function(req, res, next) {
  const path = logistics_get_channel_list
  const shopId = req.query.shop_id

  queryAuth({ region: req.query.region }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, shopId)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign,
      })
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getAttributes', function(req, res, next) {
  const path = global_product_get_attributes

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        category_id: req.query.category_id
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getPublishedList', function(req, res, next) {
  const path = global_product_get_published_list

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        global_item_id: req.query.global_item_id
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getPublishableShop', function(req, res, next) {
  const path = global_product_get_publishable_shop

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        global_item_id: req.query.global_item_id
      })
      .then(result => {
        // console.log(result.text)

        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addGlobalItem', function(req, res, next) {
  const path = global_product_add_global_item
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
        ...req.body
      })
      .then(result => {
        mongo.updateOne({
          _id: Number(req.body.global_item_sku),
        }, {
          $set: {
            global_item_id: JSON.parse(result.text).response.global_item_id
          }
        }).then(data => {
          console.log('添加Shopee全球商品ID成功')
          res.send({
            code: 0,
            text: '添加Shopee全球商品ID成功',
            data: {
              global_item_id: JSON.parse(result.text).response.global_item_id
            }
          })
        }).catch(err => {
          console.log(err)
          console.log('添加Shopee全球商品ID失败')
          res.send({ code: 1 })
        })
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })

});

router.get('/getGlobalItemInfo', function(req, res, next) {
  const path = global_product_get_global_item_info

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        global_item_id_list: req.query.global_item_id_list
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getItemBaseInfo', function(req, res, next) {
  const path = product_get_item_base_info
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const accessToken = data[0].access_token
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
        item_id_list: req.query.item_id_list
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getItemExtraInfo', function(req, res, next) {
  const path = product_get_item_extra_info
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const accessToken = data[0].access_token
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
        item_id_list: req.query.item_id_list
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/syncGlobalItemPublishedInfo', function(req, res, next) {
  const path = global_product_get_published_list
  let num = 0

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)

    queryAllProduct().then(all => {
      all.map(item => {
        request
          .get(`${domain}${path}`)
          .set('Content-Type', 'application/json')
          .query({
            partner_id,
            timestamp,
            access_token: accessToken,
            merchant_id: merchant_id,
            sign,
            global_item_id: item.global_item_id
          })
          .then(result => {
            console.log(num++)
            const parsedResult = JSON.parse(result.text).response
            console.log(parsedResult.published_item)

            updateProductPublishedInfo({
              global_item_id: item.global_item_id,
              published_info: parsedResult.published_item
            })

            // res.send({
            //     code: 0,
            //     data: JSON.parse(result.text).response
            // })
          })
          .catch(err => {
            console.log(err)
            // if (err.status === 403) {
            //     res.send({
            //         code: 1,
            //         data: '请重新授权'
            //     })       
            //     return             
            // }
            // res.send({
            //     code: 1,
            //     data: err
            // })
          })
      })
    })

  })

  res.send({
    code: 0,
    data: '更新每个数据ing...'
  })
});

router.get('/syncGlobalItemProductInfo', function(req, res, next) {
  const path = global_product_get_global_item_info
  let num = 0

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)

    queryAllProduct().then(all => {
      all.map(item => {
        request
          .get(`${domain}${path}`)
          .set('Content-Type', 'application/json')
          .query({
            partner_id,
            timestamp,
            access_token: accessToken,
            merchant_id: merchant_id,
            sign,
            global_item_id_list: [item.global_item_id]
          })
          .then(result => {
            console.log(num++)
            const parsedResult = JSON.parse(result.text).response
            console.log(parsedResult.global_item_list)

            updateProductProductInfo({
              global_item_id: item.global_item_id,
              product_info: parsedResult.global_item_list[0]
            })

            // res.send({
            //     code: 0,
            //     data: JSON.parse(result.text).response
            // })
          })
          .catch(err => {
            console.log(err)
            // if (err.status === 403) {
            //     res.send({
            //         code: 1,
            //         data: '请重新授权'
            //     })       
            //     return             
            // }
            // res.send({
            //     code: 1,
            //     data: err
            // })
          })
      })
    })

  })

  res.send({
    code: 0,
    data: '更新每个数据ing...'
  })
});

router.post('/updateGlobalItemStock', function(req, res, next) {
  const path = global_product_update_stock

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
        sign
      })
      .send({
        global_item_id: req.body.global_item_id,
        stock_list: req.body.stock_list
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        console.log(err)
        // if (err.status === 403) {
        //     res.send({
        //         code: 1,
        //         data: '请重新授权'
        //     })       
        //     return             
        // }
        // res.send({
        //     code: 1,
        //     data: err
        // })
      })

  })
});

router.post('/updateGlobalItem', function(req, res, next) {
  const path = global_product_update_global_item

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
        sign
      })
      .send({
        ...req.body,
        global_item_id: req.body.global_item_id
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        console.log(err)
        // if (err.status === 403) {
        //     res.send({
        //         code: 1,
        //         data: '请重新授权'
        //     })       
        //     return             
        // }
        // res.send({
        //     code: 1,
        //     data: err
        // })
      })

  })
});

router.post('/updateGlobalModel', function(req, res, next) {
  const path = global_product_update_global_model

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
        sign
      })
      .send({
        global_item_id: req.body.global_item_id,
        global_model: req.body.global_model
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        console.log(err)
        // if (err.status === 403) {
        //     res.send({
        //         code: 1,
        //         data: '请重新授权'
        //     })       
        //     return             
        // }
        // res.send({
        //     code: 1,
        //     data: err
        // })
      })

  })
});

router.post('/addGlobalModel', function(req, res, next) {
  const path = global_product_add_global_model

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
        sign
      })
      .send({
        global_item_id: req.body.global_item_id,
        global_model: req.body.global_model
      })
      .then(result => {
        console.log(result.text)
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        console.log(err)
        // if (err.status === 403) {
        //     res.send({
        //         code: 1,
        //         data: '请重新授权'
        //     })       
        //     return             
        // }
        // res.send({
        //     code: 1,
        //     data: err
        // })
      })

  })
});

router.post('/deleteGlobalModel', function(req, res, next) {
  const path = global_product_delete_global_model

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
        sign
      })
      .send({
        global_item_id: req.body.global_item_id,
        global_model_id: req.body.global_model_id
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
});

router.get('/getGlobalModelList', function(req, res, next) {
  const path = global_product_get_global_model_list

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        global_item_id: Number(req.query.global_item_id)
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text).response
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

function getGlobalProducts (info, offset) {
  return new Promise(resolve => {
    request
      .get(`${domain}${info.path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id: partner_id,
        timestamp: info.timestamp,
        access_token: info.accessToken,
        merchant_id: merchant_id,
        sign: info.sign,
        offset: offset,
        page_size: 20,
        // update_time_from:
        // update_time_to:
      })
      .then(result => {
        const data = JSON.parse(result.text).response
        const newOffset = data.offset
        const has_next_page = data.has_next_page

        // console.log(list)
        insertProduct(data.global_item_list).then(snippetList => {
          // console.log('snippetList', snippetList)
        })
        // console.log('一次请求')
        if (has_next_page) {
          getGlobalProducts(info, newOffset)
        } else {
          resolve('更新完成')
        }
      })
      .catch(err => {
        console.log(err)
      })
  })

}

router.get('/syncGlobalProducts', function(req, res, next) {
  const path = global_product_get_global_item_list
  dropProducts()

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)

    getGlobalProducts({
      timestamp,
      sign,
      accessToken,
      path
    }, '').then(data => {
      console.log(data)
    })

    res.send({
      code: 0,
      data: 'ing...'
    })
  })
});

router.get('/getPublishTaskResult', function(req, res, next) {
  const path = global_product_get_publish_task_result

  queryAuth({ region: 'merchant' }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, merchant_id)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        merchant_id: merchant_id,
        sign,
        publish_task_id: [Number(req.query.publish_task_id)]
      })
      .then(result => {
        res.send({
          code: 0,
          data: JSON.parse(result.text)
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/initTierVariation', function(req, res, next) {
  const path = global_product_init_tier_variation

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
        ...req.body
      })
      .then(result => {
        res.send({
          code: 0,
          data: result
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })

});

router.post('/updateTierVariation', function(req, res, next) {
  const path = global_product_update_tier_variation

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
        ...req.body
      })
      .then(result => {
        res.send({
          code: 0,
          data: result
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })

});

router.post('/updateTierVariationProduct', function(req, res, next) {
  const path = product_update_tier_variation
  const shopId = req.body.shop_id

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
        sign,
      })
      .send({
        ...req.body
      })
      .then(result => {
        res.send({
          code: 0,
          data: result
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })

});

router.post('/createPublishTask', function(req, res, next) {
  const path = global_product_create_publish_task
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
        ...req.body
      })
      .then(result => {
        // mongo.updateOne({
        //     _id: Number(req.body.global_item_sku),
        // }, {$set: {
        //     global_item_id: JSON.parse(result.text).response.global_item_id
        // }}).then(data => {
        //     console.log('添加Shopee全球商品ID成功')
        //     res.send({
        //         code: 0,
        //         text: '添加Shopee全球商品ID成功',
        //         data: {
        //             global_item_id: JSON.parse(result.text).response.global_item_id
        //         }
        //     })
        // }).catch(err => {
        //     console.log(err)
        //     console.log('添加Shopee全球商品ID失败')
        //     res.send({code: 1})
        // })
        res.send({
          code: 0,
          data: JSON.parse(result.text)
        })
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })

});

router.post('/uploadImage', async function(req, res, next) {
  const path = media_space_upload_image
  const { sign, timestamp } = getSign(path)

  const supplierId = req.body.supplierId
  const productId = req.body.productId
  const waterPrint = req.body.water
  const name = req.body.name
  const tmpPath = `./tmp/${name}`

  await client.get(`${supplierId}/${productId}/${name}`, tmpPath, { process: `style/${waterPrint}` })

  request
    .post(`${domain}${path}`)
    .set('Content-Type', 'multipart/form-data')
    .query({
      partner_id,
      timestamp,
      sign
    })
    .accept('application/json')
    .attach('image', tmpPath)
    .then(result => {
      res.send({
        code: 0,
        data: {
          imageId: JSON.parse(result.text).response.image_info.image_id,
          other: JSON.parse(result.text).response.image_info
        }
      })
    })
    .catch(err => {
      res.send({
        code: 1,
        data: err
      })
    })

});

router.get('/getShopCategoryList', function(req, res, next) {
  const path = shop_category_get_shop_category_list
  const shopId = req.query.shop_id

  queryAuth({ region: req.query.region }).then(data => {
    const accessToken = data[0].access_token
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
        page_size: 100,
        page_no: 1
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addItemListToShopCategory', function(req, res, next) {
  const path = shop_category_add_item_list
  const shopId = req.body.shop_id
  queryAuth({ region: req.body.region }).then(data => {
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
        shop_category_id: req.body.shop_category_id,
        item_list: req.body.item_list
      })
      .then(result => {
        mongo.updateOne({
          _id: Number(req.body.global_item_sku),
        }, {
          $addToSet: {
            published: {
              shop_category_id: req.body.shop_category_id,
              // shop_category_name: req.body.shop_category_name,
              region: req.body.region
            }
          }
        }).then(data => {
          console.log('保存分类成功')
          res.send({
            code: 0,
            text: '保存分类成功',
            data: {
              global_item_id: JSON.parse(result.text).response
            }
          })
        }).catch(err => {
          console.log(err)
          console.log('添加Shopee全球商品ID失败')
          res.send({ code: 1 })
        })
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getDiscountList', function(req, res, next) {
  const path = discount_get_discount_list
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const accessToken = data[0].access_token
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
        discount_status: 'ongoing',
        page_size: 100,
        page_no: 1
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getDiscount', function(req, res, next) {
  const path = discount_get_discount
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const accessToken = data[0].access_token
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
        discount_id: req.query.discount_id,
        page_size: req.query.page_size,
        page_no: req.query.page_no
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addDiscountItem', function(req, res, next) {
  const path = discount_add_discount_item
  const shopId = req.body.shop_id
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
        discount_id: req.body.discount_id,
        item_list: req.body.item_list
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addDiscount', function(req, res, next) {
  const path = discount_add_discount
  const shopId = req.body.shop_id
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
        discount_name: req.body.discount_name,
        start_time: req.body.start_time,
        end_time: req.body.end_time
      })
      .then(result => {
        console.log(JSON.parse(result.text))
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/deleteDiscountItem', function(req, res, next) {
  const path = discount_delete_discount_item
  const shopId = req.body.shop_id
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
        discount_id: req.body.discount_id,
        item_id: req.body.item_id,
        // model_id: req.body.model_id
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/deleteBundleDealItem', function(req, res, next) {
  const path = bundle_deal_delete_bundle_deal_item
  const shopId = req.body.shop_id
  queryAuth({ region: req.body.region }).then(data => {
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
        bundle_deal_id: req.body.bundle_deal_id,
        item_list: [{
          item_id: req.body.item_id
        }]
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/deleteAddOnDealMainItem', function(req, res, next) {
  const path = add_on_deal_delete_add_on_deal_main_item
  const shopId = req.body.shop_id
  queryAuth({ region: req.body.region }).then(data => {
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
        add_on_deal_id: req.body.add_on_deal_id,
        main_item_list: [req.body.item_id]
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/deleteAddOnDealSubItem', function(req, res, next) {
  const path = add_on_deal_delete_add_on_deal_sub_item
  const shopId = req.body.shop_id
  queryAuth({ region: req.body.region }).then(data => {
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
        add_on_deal_id: req.body.add_on_deal_id,
        sub_item_list: req.body.model_id_list.map(item => {
          return {
            item_id: req.body.item_id,
            model_id: item
          }
        })
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getModelList', function(req, res, next) {
  const path = product_get_model_list
  const shopId = req.query.shop_id
  const itemId = req.query.item_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getItemLimit', function(req, res, next) {
  const path = product_get_item_limit
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getItemPromotion', function(req, res, next) {
  const path = product_get_item_promotion
  const shopId = req.query.shop_id
  const itemId = req.query.item_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        item_id_list: [itemId]
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getOrderList', function(req, res, next) {
  const path = order_get_order_list
  const shopId = req.query.shop_id

  queryAuth({ region: req.query.region }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        time_range_field: 'create_time',
        page_size: 100, // TODO
        order_status: req.query.order_status,
        time_from: req.query.time_from,
        time_to: req.query.time_to
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getOrderDetail', function(req, res, next) {
  const path = order_get_order_detail
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        order_sn_list: req.query.order_sn_list,
        response_optional_fields: req.query.response_optional_fields
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getEscrowDetail', function(req, res, next) {
  const path = payment_get_escrow_detail
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        order_sn: req.query.order_sn,
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getVoucherList', function(req, res, next) {
  const path = voucher_get_voucher_list
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        status: req.query.status,
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getVoucher', function(req, res, next) {
  const path = voucher_get_voucher
  const shopId = req.query.shop_id

  queryAuth({ region: req.query.region }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        voucher_id: req.query.voucher_id,
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addVoucher', function(req, res, next) {
  const path = voucher_add_voucher
  const shopId = req.body.shop_id
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
      .send(req.body)
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getFollowPrizeList', function(req, res, next) {
  const path = follow_prize_get_follow_prize_list
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        status: req.query.status,
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getFollowPrizeDetail', function(req, res, next) {
  const path = follow_prize_get_follow_prize_detail
  const shopId = req.query.shop_id

  queryAuth({ region: req.query.region }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        campaign_id: req.query.campaign_id,
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/updateShopItem', function(req, res, next) {
  const path = product_update_item
  const shopId = req.body.shop_id
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
      .send(req.body.item)
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/addModel', function(req, res, next) {
  const path = product_add_model
  const shopId = req.body.shop_id
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
        item_id: req.body.item_id,
        model_list: req.body.model_list
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getItemList', function(req, res, next) {
  const path = get_item_list
  const shopId = req.query.shop_id
  let otherQuerys = {}
  if (req.query.update_time_from) otherQuerys.update_time_from = req.query.update_time_from
  if (req.query.update_time_to) otherQuerys.update_time_to = req.query.update_time_to

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        ...otherQuerys,
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign,
        offset: req.query.offset,
        page_size: 10,
        item_status: req.query.status
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/syncProductsList', function(req, res, next) {
  const path = get_item_list
  const shopId = req.query.shop_id
  const item_status = req.query.item_status
  syncItemsList({
    shop_id: shopId,
    region: req.query.region,
    item_status
  })
});

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

router.post('/unlistItems', function(req, res, next) {
  const path = product_unlist_item
  const shopId = req.body.shop_id
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
        item_list: req.body.item_list
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/deleteItem', function(req, res, next) {
  const path = product_delete_item
  const shopId = req.body.shop_id
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
        item_id: req.body.item_id
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/batchUnlist', async function(req, res, next) {
  const shopId = req.body.shop_id

  // 从已有商品列表中找出符合条件的商品，执行下架
  const products = await batchUnlistByShopId(shopId)

  res.send({
    data: products
  })
});

router.post('/bindFirstMile', async function(req, res, next) {
  // 查询数据库面单下载次数
  // const order = await queryOrder({_id: req.body.order_list[0].order_sn})

  // if (order.length && !order[0].waybill_download_num) {
  //     res.send({
  //         code: 1,
  //         message: '请先下载面单'
  //     })
  // }

  const path = bind_first_mile_tracking_number
  const shopId = req.body.shop_id
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
        first_mile_tracking_number: req.body.first_mile_tracking_number,
        shipment_method: 'pickup',
        region: 'cn',
        logistics_channel_id: req.body.logistics_channel_id,
        order_list: req.body.order_list
      })
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        } else {
          res.send({
            code: 1,
            data: err
          })
        }
      })
  })
});

router.get('/get_channel_list', function(req, res, next) {
  const path = get_channel_list
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)
    request
      .get(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/downloadShippingDocument', function(req, res, next) {
  const path = logistics_download_shipping_document
  const shopId = req.body.shop_id
  queryAuthByShopId({ shop_id: shopId }).then(data => {
    const accessToken = data[0].access_token
    const { sign, timestamp } = getSign(path, accessToken, undefined, shopId)

    request
      .post(`${domain}${path}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/pdf')
      .responseType('blob')
      .query({
        partner_id,
        timestamp,
        access_token: accessToken,
        shop_id: shopId,
        sign
      })
      .send({
        order_list: req.body.order_list
      })
      .then(async result => {
        if (result.body.size < 10000) {
          res.send({
            code: 1,
            data: '面单下载错误，请重新下载'
          })
          return
        }
        mongoOrder.updateOne({
          _id: req.body.order_list[0].order_sn,
        }, {
          $inc: {
            waybill_download_num: 1
          }
        }).then(data => {
          console.log(data)
        }).catch(err => {
          console.log('err', err)
        })

        // 打印文件上传阿里云
        const targetUrl = `waybill/${shopIdInShopeeMap[shopId].split('_')[0]}/${req.body.order_list[0].order_sn}.pdf`
        const resultWaybill = await client.put(targetUrl, result.body, {
          timeout: 30000000
        });
        if (resultWaybill.res.statusCode === 200) {
          console.log('面单文件上传成功')
        } else {
          console.log(resultWaybill.res.statusCode)
        }

        res.send(result.body)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/createShippingDocument', function(req, res, next) {
  const path = logistics_create_shipping_document
  const shopId = req.body.shop_id
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
        order_list: req.body.order_list
      })
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/getShippingDocumentResult', function(req, res, next) {
  const path = logistics_get_shipping_document_result
  const shopId = req.body.shop_id
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
        order_list: req.body.order_list
      })
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/getShippingDocumentDataInfo', function(req, res, next) {
  const path = get_shipping_document_data_info
  const shopId = req.body.shop_id
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
        order_sn: req.body.order_sn
      })
      .then(result => {
        res.send(JSON.parse(result.text))
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getTrackingNumber', function(req, res, next) {
  const path = logistics_get_tracking_number
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        order_sn: req.query.order_sn
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/generateFirstMileTrackingNumber', function(req, res, next) {
  const path = first_mile_generate_first_mile_tracking_number
  const shopId = req.body.shop_id
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
        declare_date: req.body.declare_date,
        quantity: req.body.quantity
      })
      .then(result => {
        let resp
        if (result.text) {
          resp = JSON.parse(result.text)
        }
        if (resp.response && resp.response.first_mile_tracking_number_list && resp.response.first_mile_tracking_number_list.length) {
          mongoFirstMile.insertMany({
            first_mile_tracking_number: resp.response.first_mile_tracking_number_list[0],
            declare_date: req.body.declare_date,
            shop_id: req.body.shop_id
          }).then(data => {
            console.log('保存揽货批次号成功')
            res.send({
              code: 0,
              text: '保存揽货批次号成功',
              data: resp
            })
          }).catch(err => {
            console.log(err)
            console.log('保存揽货批次号失败')
            res.send({ code: 1 })
          })
        } else {
          res.send(resp)
        }
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getFirstMileTrackingNumber', function(req, res, next) {
  mongoFirstMile.find({
    declare_date: req.query.declare_date,
  }).then(data => {
    res.send(data)
  }).catch(err => {
    console.log(err)
    res.send({ code: 1 })
  })
});

router.post('/addFlashSaleItems', function(req, res, next) {
  const path = shop_flash_sale_add_shop_flash_sale_items
  const shopId = req.body.shop_id
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
      .send(req.body.payload)
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getFlashSaleTimeSlotId', function(req, res, next) {
  const path = shop_flash_sale_get_time_slot_id
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        start_time: req.query.start_time,
        end_time: req.query.end_time
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/getFlashSaleList', function(req, res, next) {
  const path = shop_flash_sale_get_shop_flash_sale_list
  const shopId = req.query.shop_id

  queryAuthByShopId({ shop_id: shopId }).then(data => {
    if (!data[0]) return
    const accessToken = data[0].access_token
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
        // start_time: req.query.start_time,
        // end_time: req.query.end_time,
        type: req.query.type,
        offset: 0,
        limit: 100
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        if (err.status === 403) {
          // console.log(err)
          res.send({
            code: 1,
            data: err
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.post('/createFlashSale', function(req, res, next) {
  const path = shop_flash_sale_create_shop_flash_sale
  const shopId = req.body.shop_id
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
        timeslot_id: req.body.timeslot_id
      })
      .then(result => {
        res.send(JSON.parse(result.text).response)
      })
      .catch(err => {
        console.log(err)
        if (err.status === 403) {
          res.send({
            code: 1,
            data: '请重新授权'
          })
          return
        }
        res.send({
          code: 1,
          data: err
        })
      })
  })
});

router.get('/setDiscountBackEnd', function(req, res, next) {
  setDiscountBackEnd(JSON.parse(req.query.item), req.query.publish_task_id)
});

router.get('/syncAllShop', function(req, res, next) {
  // 当时就同步一遍
  autoSync()

  // 每日凌晨同步
  // const scheduleCornSync = () => {
  //     schedule.scheduleJob('0 0 0 * * ?', () => {
  //         console.log('凌晨同步开始')
  //         Logger.info('凌晨同步开始')
  //         autoSync()
  //     })
  // }
  // scheduleCornSync()

  // const scheduleCornUnlist = () => {
  //     schedule.scheduleJob('0 0 1 * * ?', async () => {
  //         console.log('凌晨下架开始')
  //         Logger.info('凌晨下架开始')
  //         batchUnlistAllShopItems()
  //     })
  // }
  // scheduleCornUnlist()

  res.send('正在同步')
});

router.get('/batchUnlistAllShop', function(req, res, next) {
  batchUnlistAllShopItems()
  res.send('正在下架')
});

module.exports = router;
