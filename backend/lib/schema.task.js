var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const task = new schema({
    shop_id: {type: String},
    item_sku: {type: String},
    platform: {type: String},
    region: {type: String},
    time: {type: Number}, // timestamp
    publish_time: {type: Number},
    params: {type: Object},
    _id: {type: String},
    schedule_tag: {type: String},
    discount: {type: Number},
    status: {type: Number, default: 0} // 0: 未發佈; 1: 已發佈; 2: 已设置折扣
})

module.exports = task