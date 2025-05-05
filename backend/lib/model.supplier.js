var mongoose = require('./mongoose')
var schema = require('./schema.supplier')
var modelProduct = mongoose.model('supplier', schema)

module.exports = modelProduct
