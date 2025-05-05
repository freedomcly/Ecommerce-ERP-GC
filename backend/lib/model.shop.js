var mongoose = require('./mongoose')
var schema = require('./schema.shop')
var modelShop = mongoose.model('shop', schema)

module.exports = modelShop
