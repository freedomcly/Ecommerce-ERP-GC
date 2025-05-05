var mongoose = require('./mongoose')
var schema = require('./schema.boost.shopee')
var modelBoost = mongoose.model('boost_shopee', schema)

module.exports = modelBoost
