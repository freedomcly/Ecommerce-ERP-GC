var mongoose = require('./mongoose')
var schema = require('./schema.auth')
var modelAuth = mongoose.model('auth', schema)

module.exports = modelAuth
