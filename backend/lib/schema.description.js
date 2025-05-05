var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const description = new schema({
    long: {type: String},
    short: {type: String},
    long_trans: {type: String},
    long_trans_traditional: {type: String},
    short_trans: {type: String},
    short_trans_traditional: {type: String},
    type: {type: String}
})

module.exports = description