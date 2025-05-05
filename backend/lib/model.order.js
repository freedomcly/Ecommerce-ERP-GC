var mongoose = require('./mongoose')
var schema = require('./schema.order')
var modelOrder = mongoose.model('order', schema)

module.exports = modelOrder
