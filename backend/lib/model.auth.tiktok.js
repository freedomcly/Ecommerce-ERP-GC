var mongoose = require('./mongoose')
var schema = require('./schema.auth.tiktok')
var modelAuth = mongoose.model('auth_tiktok', schema)

module.exports = modelAuth
