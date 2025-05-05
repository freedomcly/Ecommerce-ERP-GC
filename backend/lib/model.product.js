var mongoose = require('./mongoose')
var schema = require('./schema.product')
var modelProduct = mongoose.model('products', schema)

module.exports = modelProduct
