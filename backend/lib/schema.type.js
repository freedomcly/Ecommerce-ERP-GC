var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const type = new schema({
    name: {type: String},
    used_name: {type: String},
    brand: {type: Number},
    length: {type: Number},
    width: {type: Number},
    height: {type: Number},
    weight: {type: Number},
    price: {type: Number},
    sort: {type: Number},
    release_type: {type: String}
})

module.exports = type
