
const prefix = '/api/v2'

const global_product_get_category = `${prefix}/global_product/get_category`
const global_product_get_attributes = `${prefix}/global_product/get_attributes`
const global_product_add_global_item = `${prefix}/global_product/add_global_item`
const global_product_get_global_item_info = `${prefix}/global_product/get_global_item_info`
const global_product_get_global_model_list = `${prefix}/global_product/get_global_model_list`
const global_product_get_global_item_list = `${prefix}/global_product/get_global_item_list`
const global_product_init_tier_variation = `${prefix}/global_product/init_tier_variation`
const global_product_update_tier_variation = `${prefix}/global_product/update_tier_variation`
const global_product_get_published_list = `${prefix}/global_product/get_published_list`
const global_product_get_publishable_shop = `${prefix}/global_product/get_publishable_list`
const global_product_create_publish_task = `${prefix}/global_product/create_publish_task`
const global_product_get_publish_task_result = `${prefix}/global_product/get_publish_task_result`
const global_product_update_stock = `${prefix}/global_product/update_stock`
const global_product_update_global_item = `${prefix}/global_product/update_global_item`
const global_product_update_global_model = `${prefix}/global_product/update_global_model`
const global_product_add_global_model = `${prefix}/global_product/add_global_model`
const global_product_delete_global_model = `${prefix}/global_product/delete_global_model`

const order_get_order_list = `${prefix}/order/get_order_list`
const order_get_order_detail = `${prefix}/order/get_order_detail`

const logistics_get_channel_list = `${prefix}/logistics/get_channel_list`
const logistics_download_shipping_document = `${prefix}/logistics/download_shipping_document`
const logistics_create_shipping_document = `${prefix}/logistics/create_shipping_document`
const logistics_get_shipping_document_result = `${prefix}/logistics/get_shipping_document_result`
const logistics_get_tracking_number = `${prefix}/logistics/get_tracking_number`
const logistics_ship_order = `${prefix}/logistics/ship_order`
const logistics_get_shipping_parameter = `${prefix}/logistics/get_shipping_parameter`
const get_shipping_document_data_info = `${prefix}/logistics/get_shipping_document_data_info`

const shop_auth_partner = `${prefix}/shop/auth_partner`
const auth_token_get = `${prefix}/auth/token/get`
const auth_access_token_get = `${prefix}/auth/access_token/get`
const media_space_upload_image = `${prefix}/media_space/upload_image`
const media_space_init_video_upload= `${prefix}/media_space/init_video_upload`
const media_space_upload_video_part = `${prefix}/media_space/upload_video_part`
const media_space_complete_video_upload = `${prefix}/media_space/complete_video_upload`
const media_space_get_video_upload_result = `${prefix}/media_space/get_video_upload_result`

const product_get_item_base_info = `${prefix}/product/get_item_base_info`
const product_get_item_extra_info = `${prefix}/product/get_item_extra_info`
const product_get_boosted_list = `${prefix}/product/get_boosted_list`
const product_boost_item = `${prefix}/product/boost_item`
const product_get_model_list = `${prefix}/product/get_model_list`
const product_update_tier_variation = `${prefix}/product/update_tier_variation`
const product_get_item_promotion = `${prefix}/product/get_item_promotion`
const product_update_item = `${prefix}/product/update_item`
const product_unlist_item = `${prefix}/product/unlist_item`
const product_delete_item = `${prefix}/product/delete_item`
const product_get_item_limit = `${prefix}/product/get_item_limit`
const product_add_model = `${prefix}/product/add_model`

const shop_category_get_shop_category_list = `${prefix}/shop_category/get_shop_category_list`
const shop_category_add_item_list = `${prefix}/shop_category/add_item_list`
const discount_get_discount_list = `${prefix}/discount/get_discount_list`
const discount_get_discount = `${prefix}/discount/get_discount`
const discount_add_discount = `${prefix}/discount/add_discount`
const discount_add_discount_item = `${prefix}/discount/add_discount_item`
const discount_delete_discount_item = `${prefix}/discount/delete_discount_item`
const bundle_deal_delete_bundle_deal_item = `${prefix}/bundle_deal/delete_bundle_deal_item`
const add_on_deal_delete_add_on_deal_main_item = `${prefix}/add_on_deal/delete_add_on_deal_main_item`
const add_on_deal_delete_add_on_deal_sub_item = `${prefix}/add_on_deal/delete_add_on_deal_sub_item`

const payment_get_escrow_detail = `${prefix}/payment/get_escrow_detail`

const voucher_get_voucher_list = `${prefix}/voucher/get_voucher_list`
const voucher_get_voucher = `${prefix}/voucher/get_voucher`
const voucher_add_voucher = `${prefix}/voucher/add_voucher`
const follow_prize_get_follow_prize_list = `${prefix}/follow_prize/get_follow_prize_list`
const follow_prize_get_follow_prize_detail = `${prefix}/follow_prize/get_follow_prize_detail`

const get_item_list = `${prefix}/product/get_item_list`

const bind_first_mile_tracking_number = `${prefix}/first_mile/bind_first_mile_tracking_number`
const get_channel_list = `${prefix}/first_mile/get_channel_list`
const first_mile_generate_first_mile_tracking_number = `${prefix}/first_mile/generate_first_mile_tracking_number`

// falshsale
const shop_flash_sale_get_time_slot_id = `${prefix}/shop_flash_sale/get_time_slot_id`
const shop_flash_sale_add_shop_flash_sale_items = `${prefix}/shop_flash_sale/add_shop_flash_sale_items`
const shop_flash_sale_create_shop_flash_sale = `${prefix}/shop_flash_sale/create_shop_flash_sale`
const shop_flash_sale_get_shop_flash_sale_list = `${prefix}/shop_flash_sale/get_shop_flash_sale_list`

module.exports = {
    global_product_get_category,
    global_product_get_attributes,
    global_product_add_global_item,
    global_product_get_global_item_info,
    global_product_get_global_model_list,
    global_product_get_global_item_list,
    global_product_init_tier_variation,
    global_product_update_tier_variation,
    global_product_get_published_list,
    global_product_get_publishable_shop,
    global_product_create_publish_task,
    global_product_get_publish_task_result,
    global_product_update_stock,
    global_product_update_global_item,
    global_product_update_global_model,
    global_product_add_global_model,
    global_product_delete_global_model,
    logistics_get_channel_list,
    logistics_download_shipping_document,
    logistics_create_shipping_document,
    logistics_get_shipping_document_result,
    logistics_get_tracking_number,
    logistics_ship_order,
    logistics_get_shipping_parameter,
    shop_auth_partner,
    auth_token_get,
    auth_access_token_get,
    media_space_upload_image,
    media_space_init_video_upload,
    media_space_upload_video_part,
    media_space_complete_video_upload,
    media_space_get_video_upload_result,
    product_get_item_base_info,
    product_get_item_extra_info,
    product_get_boosted_list,
    product_boost_item,
    product_update_item,
    product_delete_item,
    product_unlist_item,
    product_get_item_limit,
    product_add_model,
    shop_category_get_shop_category_list,
    shop_category_add_item_list,
    discount_get_discount_list,
    discount_get_discount,
    discount_add_discount,
    discount_add_discount_item,
    product_get_model_list,
    discount_delete_discount_item,
    product_update_tier_variation,
    product_get_item_promotion,
    bundle_deal_delete_bundle_deal_item,
    add_on_deal_delete_add_on_deal_main_item,
    add_on_deal_delete_add_on_deal_sub_item,
    order_get_order_list,
    order_get_order_detail,
    payment_get_escrow_detail,
    voucher_get_voucher_list,
    voucher_get_voucher,
    voucher_add_voucher,
    follow_prize_get_follow_prize_list,
    follow_prize_get_follow_prize_detail,
    get_item_list,
    bind_first_mile_tracking_number,
    get_channel_list,
    get_shipping_document_data_info,
    first_mile_generate_first_mile_tracking_number,
    shop_flash_sale_get_time_slot_id,
    shop_flash_sale_add_shop_flash_sale_items,
    shop_flash_sale_create_shop_flash_sale,
    shop_flash_sale_get_shop_flash_sale_list
}
