var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const shopeeShopProducts = new schema({
    region: {type: String},
    shop_id: {type: Number},
    item_id: {type: Number},
    update_time: {type: Number},
    sync_time: {type: Number},
    item_status: {type: String},
    data_base: {type: Object},
    data_extra: {type: Object},
    productData: {type: Object},
    modelList: {type: Object},
    orders: {type: Array},
    suggest: {type: Number}
})

module.exports = shopeeShopProducts
