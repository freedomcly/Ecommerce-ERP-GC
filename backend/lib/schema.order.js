var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const order = new schema({
    _id: {type: String},
    platform: {type: String},
    region: {type: String},
    shop_id: {type: String},
    delivery_date: {type: String},
    delivery_date_timestamp: {type: Number}, // 打包时间
    transport_timestamp: {type: Number},
    updated: {type: Date},
    weight: {type: Number},
    freebie: {type: Array},
    packaging: {type: String},
    items: {type: Array},
    status: {type: Number},
    cutoff: {type: Array},
    waybill_download_num: {type: Number, default: 0},
    info_from_platform: {type: Object},
    shippingRemark: {type: String}
})

module.exports = order