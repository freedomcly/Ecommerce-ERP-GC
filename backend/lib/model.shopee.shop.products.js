var mongoose = require('./mongoose')
var schema = require('./schema.shopee.shop.products')
var shopeeShopProducts = mongoose.model('shopee.shop.products', schema)

module.exports = shopeeShopProducts
