var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const purchase = new schema({
    picking_list: {type: Array},
    cutoff: {type: String, unique: true},
    starting_time: {type: Number},
    return_time: {type: Number},
    total_cost: {type: Number},
    payment: {type: Number}
})

module.exports = purchase
