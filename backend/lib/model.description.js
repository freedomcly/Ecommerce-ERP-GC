var mongoose = require('./mongoose')
var schema = require('./schema.description')
var modelDescription = mongoose.model('descriptions', schema)

module.exports = modelDescription
