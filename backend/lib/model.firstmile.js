var mongoose = require('./mongoose')
var schema = require('./schema.firstmile')
var firstMile = mongoose.model('firstmile', schema)

module.exports = firstMile
