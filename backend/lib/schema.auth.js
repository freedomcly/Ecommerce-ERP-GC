var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const auth = new schema({
    region: {type: String},
    access_token: {type: String},
    refresh_token: {type: String},
    code: {type: String},
    updated: {type: Number},
    shop_id: {type: String}
})

module.exports = auth