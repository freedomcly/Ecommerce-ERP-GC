var mongoose = require('./mongoose.js')
var schema = mongoose.Schema

const shop = new schema({
    shop_id: {type: String},
    platform: {type: String},
    region: {type: String},
    theme_id: {type: String}
})

module.exports = shop