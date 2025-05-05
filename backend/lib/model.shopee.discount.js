var mongoose = require('./mongoose')
var schema = require('./schema.shopee.discount')
var shopeeDiscount = mongoose.model('shopee.discount', schema)

module.exports = shopeeDiscount
