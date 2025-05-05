var mongoose = require('./mongoose')
var schema = require('./schema.auth.lazada')
var modelAuth = mongoose.model('auth_lazada', schema)

module.exports = modelAuth
