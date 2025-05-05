var mongoose = require('./mongoose')
var schema = require('./schema.globalProduct')
var modelProduct = mongoose.model('globalProduct', schema)

module.exports = modelProduct
