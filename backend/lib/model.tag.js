var mongoose = require('./mongoose')
var schema = require('./schema.tag')
var modelTag = mongoose.model('tag', schema)

module.exports = modelTag
