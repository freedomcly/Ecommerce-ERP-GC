var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const boost_shopee = new schema({
    region: {type: String},
    shop_id: {type: String},
    boost_num: {type: Number},
    boost_items: {type: Object}
})

module.exports = boost_shopee
