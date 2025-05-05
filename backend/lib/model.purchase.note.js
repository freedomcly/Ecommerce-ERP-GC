var mongoose = require('./mongoose')
var schema = require('./schema.purchase.note')
var purchaseNote = mongoose.model('purchase.note', schema)

module.exports = purchaseNote
