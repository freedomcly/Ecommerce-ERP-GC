var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const firstMile = new schema({
    first_mile_tracking_number: {type: String},
    shop_id: {type: Number},
    declare_date: {type: String}
})

module.exports = firstMile
