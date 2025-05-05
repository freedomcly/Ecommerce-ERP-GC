var mongoose = require('./mongoose')
var schema = require('./schema.type')
var modelType = mongoose.model('type', schema)

module.exports = modelType
