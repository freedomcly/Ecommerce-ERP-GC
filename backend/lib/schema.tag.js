var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const tag = new schema({
    value: {type: String},
    type: {type: Number},
    trans_en: {type: String},
    trans_tr: {type: String},
    synonym: {type: String},
    features: {type: String}
})

module.exports = tag