var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const auth = new schema({
    region: {type: String},
    access_token: {type: String},
    refresh_token: {type: String},
    code: {type: String},
    updated: {type: Number},
    country_user_info: {type: Array},
    expires_in: {type: Number},
    account_id: {type: String},
    country: {type: String},
    account_platform: {type: String},
    account: {type: String},
    refresh_expires_in: {type: Number}
})

module.exports = auth
