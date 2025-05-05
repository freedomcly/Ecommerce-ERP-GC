var mongoose = require('./mongoose')
var schema = require('./schema.user')
var modelUser = mongoose.model('user', schema)

module.exports = modelUser
