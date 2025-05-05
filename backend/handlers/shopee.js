const schedule = require('node-schedule')
const moment = require('moment')
const mongoProductOnline = require('../lib/model.shopee.shop.products.js')
const mongoShop = require('../lib/model.shop.js')
const mongoTask = require('../lib/model.task.js')
const mongoBoost = require('../lib/model.boost.shopee.js')
const {
  queryDiscount
} = require('../db/discount.js')

const { unlistItems, syncItemsList, createPublishTask, boostItem, getModelListNew, getPublishTaskResult, addDiscountItem, getPublishedList } = require('../connecters/shopee.js')
const Logger = require('../lib/logger.js')
const { scheduleTimes } = require('../constants/normal.js')
const { unlistIndicator, unlistSuggestIndicator } = require('../constants/shopee.js')
const { adoptModel } = require('../utils/model.js')

async function batchUnlistByShopId (shopId) {
  // 查出所有已同步的线上商品
  const products = await mongoProductOnline.find({
    $or: [
    {
      shop_id: shopId,
      'data_extra.sale': 0,
      // 'data_extra.views': 0,
      'data_extra.likes': 0,
      'modelList.hasDiscount': 1,
      'data_base.item_name': {
        $regex: /iPhone/
      },
      'data_base.create_time': {
        $lte: Date.now() / 1000 - 30 * 60 * 60 * 24
      },
      orders: { $size: 0 }
    }, {
      shop_id: shopId,
      'data_extra.sale': 0,
      'modelList.hasDiscount': 1,
      'data_base.create_time': {
        $lte: Date.now() / 1000 - unlistIndicator.unlistDays * 60 * 60 * 24
      },
      orders: { $size: 0 }
    }, {
      shop_id: shopId,
      'data_extra.sale': {
        $lt: 3
      },
      'data_extra.rating_star': {
        $lt: 4
      },
      'productData.status': {
        $ne: 5
      },
      'modelList.hasDiscount': 1,
      'data_base.create_time': {
        $lte: Date.now() / 1000 - unlistSuggestIndicator.unlistDays * 60 * 60 * 24
      }
    }]
  })

  // 下架
  let chunks = Math.ceil(products.length / 50)
  for (let i = 0; i < chunks; i++) {
    let chunksItemList = products.slice(i * 50, i * 50 + 50).map(product => {
      return {
        item_id: product.item_id,
        unlist: true
      }
    })
    unlistItems({
      shop_id: shopId,
      item_list: chunksItemList
    }).then(data => {
      console.log(`下架${chunksItemList.map(item => item.item_id).join(';')} ${shopId}`)
      Logger.info(`下架${chunksItemList.map(item => item.item_id).join(';')} ${shopId}`)
    }).catch(err => {
      console.log(err)
      Logger.info(err)
    })
  }
  // products.forEach(async product => {
  //   await unlistItems({
  //     shop_id: product.shop_id,
  //     item_list: [{item_id: product.item_id, unlist: true}]
  //   }).then(data => {
  //     console.log(`下架${product.item_id} ${product.shop_id}`)
  //     Logger.info(`下架${product.item_id} ${product.shop_id}`)
  //   }).catch(err => {
  //     console.log(err)
  //     Logger.info(err)
  //   })
  // })

  // products.forEach(async product => {
  //   if (!product.productData || !product.productData.global_item_id) {
  //     return null
  //   } else {
  //     const currentProducts = await mongoProductOnline.find({
  //       'productData.global_item_id': product.productData.global_item_id
  //     })

  //     let saleMax = 0
  //     let saleTotal = 0
  //     let viewsMax = 0
  //     let viewsTotal = 0
  //     let likesMax = 0
  //     let likesTotal = 0
  //     let rateMin = 5
  //     currentProducts.forEach(item => {
  //       if (item.data_extra.sale) {
  //         saleTotal += item.data_extra.sale
  //         if (item.data_extra.sale > saleMax) {
  //           saleMax = item.data_extra.sale
  //         }
  //       }
  //       if (item.data_extra.views) {
  //         viewsTotal += item.data_extra.views
  //         if (item.data_extra.views > viewsMax) {
  //           viewsMax = item.data_extra.views
  //         }
  //       }
  //       if (item.data_extra.likes) {
  //         likesTotal += item.data_extra.likes
  //         if (item.data_extra.likes > likesMax) {
  //           likesMax = item.data_extra.likes
  //         }
  //       }
  //       if (item.data_extra.rating_star) {
  //         if (item.data_extra.rating_star < rateMin) {
  //           rateMin = item.data_extra.rating_star
  //         }
  //       }
  //     })

  //     if (saleTotal <= 0 && product.data_base.create_time < Date.now() / 1000 - unlistSuggestIndicator.unlistDays * 60 * 60 * 24) {
  //       mongoProductOnline.updateMany({
  //         'productData.global_item_id': product.productData.global_item_id
  //       }, {suggest: 3}).then(data => {
  //         console.log(data)
  //       }).catch(err => {
  //         console.log(err)
  //       })
  //     } else {
  //       if (viewsMax < unlistIndicator.viewsMax && viewsTotal < unlistIndicator.viewsTotal && likesMax < unlistIndicator.likesMax && likesTotal < unlistIndicator.likesTotal) {
  //         if ((saleTotal < unlistIndicator.saleTotal || (saleTotal < 2 && rateMin < 5)) && (product.data_base.category_id === 100490 && product.data_base.attribute_list[2].attribute_id === 100488 && product.data_base.attribute_list[2].attribute_value_list[0].value_id === 2977)) {
  //           mongoProductOnline.updateMany({
  //             'productData.global_item_id': product.productData.global_item_id
  //           }, {suggest: 0}).then(data => {
  //             console.log(data)
  //           }).catch(err => {
  //             console.log(err)
  //           })
  //         } else if (saleTotal < unlistSuggestIndicator.saleTotal && product.data_base.create_time < Date.now() / 1000 - unlistSuggestIndicator.unlistDays * 60 * 60 * 24) {
  //           mongoProductOnline.updateMany({
  //             'productData.global_item_id': product.productData.global_item_id
  //           }, {suggest: 2}).then(data => {
  //             console.log(data)
  //           }).catch(err => {
  //             console.log(err)
  //           })
  //         }
  //         // currentProducts.forEach(item => {

  //           // 下架
  //           // await unlistItems({
  //           //   shop_id: item.shop_id,
  //           //   item_list: [{item_id: item.item_id, unlist: true}]
  //           // }).then(data => {
  //           //   console.log(`下架${item.item_id} ${item.shop_id}`)
  //           //   Logger.info(`下架${item.item_id} ${item.shop_id}`)
  //           // }).catch(err => {
  //           //   console.log(err)
  //           //   Logger.info(err)
  //           // })
  //         // })
  //       } else {
  //         mongoProductOnline.updateMany({
  //           'productData.global_item_id': product.productData.global_item_id
  //         }, {suggest: 1}).then(data => {
  //           console.log(data)
  //         }).catch(err => {
  //           console.log(err)
  //         })
  //         // console.log(`建议综合考虑${product.productData.global_item_id}`)
  //         // Logger.info(`建议综合考虑${product.productData.global_item_id}`)
  //       }
  //     }
  //   }
  // })

  // let itemLists = products.map(item => {
  //   return {
  //     item_id: item.item_id,
  //     unlist: true
  //   }
  // })
  // let chunkItemLists = []

  // const times = Math.ceil(products.length / 50)
  // for (let i = 0; i <= times; i++) {
  //   if (i !== times) {
  //     chunkItemLists = itemLists.slice(i * 50, (i + 1) * 50 - 1)
  //   } else {
  //     chunkItemLists = itemLists.slice(i * 50)
  //   }

  //   await unlistItems({
  //     shop_id: shopId,
  //     item_list: chunkItemLists
  //   }).then(data => {
  //     console.log(data)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  return products
  // 按照条件下架
}

async function autoSync () {
  // 查询所有站点
  const shops = await mongoShop.find()
  // 每隔2min同步一个站点
  for (let i = 0; i <= shops.length; i++) {
    syncItemsList({
      shop_id: shops[i].shop_id,
      region: shops[i].region
    })
    await new Promise(resolve => {
      setTimeout(resolve, 1000 * 60 * 2)
    })
  }
}

function autoSyncUnlist () {
  // 每日凌晨同步
  const scheduleCornSync = () => {
    schedule.scheduleJob('0 0 0 * * ?', () => {
      console.log('凌晨同步开始')
      Logger.info('凌晨同步开始')
      autoSync()
    })
  }
  scheduleCornSync()

  // 下架
  const scheduleCornUnlist = () => {
      schedule.scheduleJob('0 0 1 * * ?', async () => {
          console.log('凌晨下架开始')
          Logger.info('凌晨下架开始')
          batchUnlistAllShopItems()
      })
  }
  scheduleCornUnlist()
}

async function autoPublish () {
  scheduleTimes.forEach(time => {
    const simpleTime = time.split(':')[0]

    schedule.scheduleJob(`0 0 ${simpleTime} * * ?`, async () => {
      const today = moment().format('YYYY-MM-DD')
      console.log(`${time}定时任务设置成功`)
      Logger.info(`${time}定时任务设置成功`)

      const tasks = await mongoTask.find({ schedule_tag: `${today}/${time}` })
      tasks.forEach(item => {
        createPublishTask(item.params).then(data => {
          if (data.error) {
            console.log(`发布失败${today}/${time}`, data)
            Logger.info(`发布失败${today}/${time}`)
          } else {
            console.log(`发布成功${today}/${time}`, data)
            Logger.info(`发布成功${today}/${time}`)

            // 打折扣
            Logger.info(`taskID: ${data.response.publish_task_id}`)
            if (data.response && data.response.publish_task_id) {
              setTimeout(() => {
                setDiscountBackEnd(item, data.response.publish_task_id)
              }, 5000)
            }

            mongoTask.updateOne({ _id: item._id }, {
              publish_time: Date.now(),
              status: 1
            }, { upsert: true }).then(info2 => {
              console.log(info2)
              Logger.info(`任务状态更新成功 ${item._id}`)
            }).catch(error => {
              Logger.info(`任务状态更新失败 ${item._id}`)
              console.log(error)
            })
          }
        })
      })

    })

  })
  // const tasks = await mongoTask.find({schedule_tag: '2023-12-01/22:00'})
  // console.log(tasks)
  // tasks.forEach(item => {
  //   createPublishTask(item.params).then(data => {
  //     if (data.error) {
  //       console.log('发布失败12/01 22:00', data)
  //     } else {
  //       console.log('发布成功12/01 22:00', data)
  //       mongoTask.updateOne({_id: item._id}, {
  //         publish_time: Date.now(),
  //         status: 1
  //       }, {upsert: true})
  //     }
  //   })
  // })
  // schedule.scheduleJob('0 0 10 * * ?', async () => {
  //   console.log('10:00发布开始')
  //   Logger.info('10:00发布开始')
  //   batchUnlistAllShopItems()
  // })
}
// shops.forEach(shop => {
//   setTimeout(async () => {
//     await syncItemsList({
//       shop_id: shop.shop_id,
//       region: shop.region
//     })
//   }, 1000 * 60 * 2)
// })
// }

async function batchUnlistAllShopItems () {
  const shops = await mongoShop.find()

  // 每隔2min下架一个站点
  for (let i = 0; i <= shops.length; i++) {
    batchUnlistByShopId(shops[i].shop_id)
    await new Promise(resolve => {
      setTimeout(resolve, 1000 * 60 * 2)
    })
  }
}

async function autoBoost () {
  const scheduleCorn = async () => {
    const boostList = await mongoBoost.find()
    for (let i = 0; i <= boostList.length; i++) {
      boostItem(boostList[i].region, boostList[i].boost_items, boostList[i].shop_id)
      schedule.scheduleJob('0 */65 * * * ?', () => {
        boostItem(boostList[i].region, boostList[i].boost_items, boostList[i].shop_id)
      })
    }
  }
  scheduleCorn()
}

async function setDiscountBackEnd (item, publish_task_id) {
  // 请求发布结果
  // const publistResult = await getPublishTaskResult(publish_task_id)

  // 请求已发布站点
  const publishedInfo = await getPublishedList(item.params.global_item_id)
  console.log(publishedInfo.response.published_item)

  const itemData = publishedInfo.response.published_item.filter(data => Number(data.shop_id) === Number(item.shop_id))
  const itemId = itemData[0].item_id
  console.log(itemId)

  // // 请求model
  const modelData = await getModelListNew(item.shop_id, itemId)
  const model = modelData.response.model
  console.log(model)

  // // 获取discountId
  const discount = await queryDiscount({ shop_id: Number(item.shop_id) })
  const discountId = discount[0]._id
  console.log(discountId)

  addDiscountItem({
    shop_id: item.shop_id,
    item_list: [{
      item_id: itemId,
      purchase_limit: 0,
      model_list: adoptModel(model, item)
    }],
    discount_id: Number(discountId)
  }).then(result => {
    if (result.discount_id) {
      mongoTask.updateOne({ _id: item._id }, {
        status: 2
      }, { upsert: true }).then(info2 => {
        console.log(info2)
        Logger.info(`任务状态更新成功 ${item._id}`)
      }).catch(error => {
        Logger.info(`任务状态更新失败 ${item._id}`)
        console.log(error)
      })
    }
  })
}

module.exports = {
  batchUnlistByShopId,
  batchUnlistAllShopItems,
  autoSync,
  autoSyncUnlist,
  autoPublish,
  autoBoost,
  setDiscountBackEnd
}
