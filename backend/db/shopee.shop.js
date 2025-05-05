const mongo = require('../lib/model.shopee.shop.products.js')

function insertShopeeShopProduct (list) {
    return new Promise((resolve) => {
        mongo.insertMany(list).then(data => {
            resolve(data)
        })
    })
}

function dropShopeeShopProducts (query) {
  return new Promise((resolve) => {
    mongo.deleteMany(query).then(data => {
      resolve(0)
    }).catch(err => {
        console.log(err)
    })
  })
}

function updateProductBase (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        data_base: params.data_base
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

function updateProductExtra (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        data_extra: params.data_extra
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

function updateProductData (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        productData: params.data
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

function updateProductOrder (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        orders: params.orders
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

function updateProductInventory (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        productData: params.productData
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

function updateProductModelList (params) {
  mongo.updateOne({
    item_id: params.item_id,
    shop_id: params.shop_id
  }, {
      $set: {
        modelList: params.model_list
      }
  }).then(data => {
      // console.log(data)
  }).catch(err => {
      console.log('err', err)
  })
}

module.exports = {
  insertShopeeShopProduct,
  dropShopeeShopProducts,
  updateProductBase,
  updateProductExtra,
  updateProductData,
  updateProductOrder,
  updateProductInventory,
  updateProductModelList
}
