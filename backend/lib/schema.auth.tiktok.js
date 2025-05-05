var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const auth = new schema({
    access_token: {type: String},
    access_token_expire_in: {type: Number},
    refresh_token: {type: String},
    refresh_token_expire_in: {type: Number},
    open_id: {type: String},
    seller_name: {type: String},
    seller_base_region: {type: String},
    user_type: {type: Number},
    updated: {type: Number}
})

module.exports = auth
