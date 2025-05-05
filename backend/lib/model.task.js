var mongoose = require('./mongoose')
var schema = require('./schema.task')
var modelTask = mongoose.model('task', schema)

module.exports = modelTask
