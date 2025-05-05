var mongoose = require('./mongoose.js')

var schema = mongoose.Schema

const product = new schema({
    _id: {type: Number, require: true},
    old_supplier_id: {type: Number},
    supplier_id: {type: Number, require: true},
    product_id: {type: String},
    name_by_supplier: {type: String},
    selling_point: {type: String},
    selling_point_traditional: {type: String},
    features: {type: Array},
    thickness: {type: Number},
    hardness: {type: Number, default: 0},
    material: {type: Array},
    model_type: {type: String},
    images: {type: Array, require: true},
    images_sku: {type: Array, require: false},
    video_upload_id_in_shopee: {type: String},
    video_url: {type: String},
    weight: {type: Number, require: true, default: 0.05},
    parcel_size_length: {type: Number, require: true, default: 25},
    parcel_size_width: {type: Number, require: true, default: 21},
    parcel_size_height: {type: Number, require: true, default: 5},
    cost_price: {type: Number},
    multi_cost_price: {type: Array},
    sku_model: {type: String},
    sku_info: {type: Object},
    published: {type: Array},
    global_item_id: {type: Number}, // For Shopee
    item_id_in_lazada: {type: Object}, // For Lazada
    item_id_in_coupang: {type: Number},
    global_item_id_in_tiktok: {type: String},
    serie: {type: String},
    category: {type: Number}, // For Shopee
    theme: {type: Number}, // For Shopee
    status: {type: Number},
    launch_time: {type: Number}, // timestamp
    inventory: {type: Object},
    quality_control: {type: Array},
    price_orientation: {type: Number},
    tags: {type: Array},
    brand_compatibility_id: {type: Number}
})

module.exports = product