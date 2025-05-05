var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const discount = new schema({
    _id: {type: Number, require: true},
    region: {type: String, require: true},
    shop_id: {type: String}
})

module.exports = discount