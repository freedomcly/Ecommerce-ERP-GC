var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const product = new schema({
    name: {type: String, require: true},
    serial: {type: Number, require: true,  unique: true},
    series: {type: Array, require: false},
    address: {type: Object, require: false},
    QQGroup: {type: String, require: false},
    wechat: {type: String, require: false},
    tags: {type: Array, require: false}
})

module.exports = product