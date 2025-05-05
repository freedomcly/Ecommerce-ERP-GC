var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const product = new schema({
    global_item_id: {type: Number, require: true},
    published_info: {type: Object},
    product_info: {type: Object},
    update_time: {type: String}
})

module.exports = product