import axios from './ajaxRequest'

export const getCategory = () => {
    return axios.request({
        url: '/shopee/getCategory',
        method: 'get'
    })
}

export const addGlobalItem = params => {
    return axios.request({
        url: '/shopee/addGlobalItem',
        method: 'post',
        data: params
    })
}

export const getGlobalItemInfo = params => {
    return axios.request({
        url: '/shopee/getGlobalItemInfo',
        method: 'get',
        params
    })
}

export const syncGlobalProducts = params => {
    return axios.request({
        url: '/shopee/syncGlobalProducts',
        method: 'get',
        params
    })
}

export const syncGlobalItemPublishedInfo = params => {
    return axios.request({
        url: '/shopee/syncGlobalItemPublishedInfo',
        method: 'get',
        params
    })
}

export const syncGlobalItemProductInfo = params => {
    return axios.request({
        url: '/shopee/syncGlobalItemProductInfo',
        method: 'get',
        params
    })
}

export const getGlobalModelList = params => {
    return axios.request({
        url: '/shopee/getGlobalModelList',
        method: 'get',
        params
    })
}

export const initTierVariation = params => {
    return axios.request({
        url: '/shopee/initTierVariation',
        method: 'post',
        data: params
    })
}

export const updateTierVariation = params => {
    return axios.request({
        url: '/shopee/updateTierVariation',
        method: 'post',
        data: params
    })
}

export const updateTierVariationProduct = params => {
    return axios.request({
        url: '/shopee/updateTierVariationProduct',
        method: 'post',
        data: params
    })
}

export const createPublishTask = params => {
    return axios.request({
        url: '/shopee/createPublishTask',
        method: 'post',
        data: params
    })
}

export const uploadImage = params => {
    return axios.request({
        url: '/shopee/uploadImage',
        method: 'post',
        data: params
    })
}

export const getAttributes = params => {
    return axios.request({
        url: '/shopee/getAttributes',
        method: 'get',
        params
    })
}

export const getPublishedList = params => {
    return axios.request({
        url: '/shopee/getPublishedList',
        method: 'get',
        params
    })
}

export const getPublishableShop = params => {
    return axios.request({
        url: '/shopee/getPublishableShop',
        method: 'get',
        params
    })
}

export const getChannelList = params => {
    return axios.request({
        url: '/shopee/getChannelList',
        method: 'get',
        params
    })
}

export const getPublishTaskResult = params => {
    return axios.request({
        url: '/shopee/getPublishTaskResult',
        method: 'get',
        params
    })
}

export const getShopCategoryList = params => {
    return axios.request({
        url: '/shopee/getShopCategoryList',
        method: 'get',
        params
    })
}

export const addItemListToShopCategory = params => {
    return axios.request({
        url: '/shopee/addItemListToShopCategory',
        method: 'post',
        data: params
    })
}

export const getDiscountList = params => {
    return axios.request({
        url: '/shopee/getDiscountList',
        method: 'get',
        params
    })
}

export const getDiscount = params => {
    return axios.request({
        url: '/shopee/getDiscount',
        method: 'get',
        params
    })
}

export const addDiscountItem = params => {
    return axios.request({
        url: '/shopee/addDiscountItem',
        method: 'post',
        data: params
    })
}

export const addDiscount = params => {
    return axios.request({
        url: '/shopee/addDiscount',
        method: 'post',
        data: params
    })
}

export const getModelList = params => {
    return axios.request({
        url: '/shopee/getModelList',
        method: 'get',
        params
    })
}

export const deleteDiscountItem = params => {
    return axios.request({
        url: '/shopee/deleteDiscountItem',
        method: 'post',
        data: params
    })
}

export const deleteBundleDealItem = params => {
    return axios.request({
        url: '/shopee/deleteBundleDealItem',
        method: 'post',
        data: params
    })
}

export const deleteAddOnDealMainItem = params => {
    return axios.request({
        url: '/shopee/deleteAddOnDealMainItem',
        method: 'post',
        data: params
    })
}

export const deleteAddOnDealSubItem = params => {
    return axios.request({
        url: '/shopee/deleteAddOnDealSubItem',
        method: 'post',
        data: params
    })
}

export const getItemPromotion = params => {
    return axios.request({
        url: '/shopee/getItemPromotion',
        method: 'get',
        params
    })
}

export const getOrderList = params => {
    return axios.request({
        url: '/shopee/getOrderList',
        method: 'get',
        params
    })
}

export const getOrderDetail = params => {
    return axios.request({
        url: '/shopee/getOrderDetail',
        method: 'get',
        params
    })
}

export const getEscrowDetail = params => {
    return axios.request({
        url: '/shopee/getEscrowDetail',
        method: 'get',
        params
    })
}

export const getVoucherList = params => {
    return axios.request({
        url: '/shopee/getVoucherList',
        method: 'get',
        params
    })
}

export const getVoucher = params => {
    return axios.request({
        url: '/shopee/getVoucher',
        method: 'get',
        params
    })
}

export const addVoucher = params => {
    return axios.request({
        url: '/shopee/addVoucher',
        method: 'post',
        data: params
    })
}

export const getFollowPrizeList = params => {
    return axios.request({
        url: '/shopee/getFollowPrizeList',
        method: 'get',
        params
    })
}

export const getFollowPrizeDetail = params => {
    return axios.request({
        url: '/shopee/getFollowPrizeDetail',
        method: 'get',
        params
    })
}

export const getItemBaseInfo = params => {
    return axios.request({
        url: '/shopee/getItemBaseInfo',
        method: 'get',
        params
    })
}

export const getItemExtraInfo = params => {
    return axios.request({
        url: '/shopee/getItemExtraInfo',
        method: 'get',
        params
    })
}

export const updateGlobalItemStock = params => {
    return axios.request({
        url: '/shopee/updateGlobalItemStock',
        method: 'post',
        data: params
    })
}

export const updateGlobalItem = params => {
    return axios.request({
        url: '/shopee/updateGlobalItem',
        method: 'post',
        data: params
    })
}

export const updateGlobalModel = params => {
    return axios.request({
        url: '/shopee/updateGlobalModel',
        method: 'post',
        data: params
    })
}

export const addGlobalModel = params => {
    return axios.request({
        url: '/shopee/addGlobalModel',
        method: 'post',
        data: params
    })
}

export const deleteGlobalModel = params => {
    return axios.request({
        url: '/shopee/deleteGlobalModel',
        method: 'post',
        data: params
    })
}

export const updateShopItem = params => {
    return axios.request({
        url: '/shopee/updateShopItem',
        method: 'post',
        data: params
    })
}

export const syncProductsList = params => {
    return axios.request({
        url: '/shopee/syncProductsList',
        method: 'get',
        params
    })
}

export const unlistItems = params => {
    return axios.request({
        url: '/shopee/unlistItems',
        method: 'post',
        data: params
    })
}

export const deleteItem = params => {
    return axios.request({
        url: '/shopee/deleteItem',
        method: 'post',
        data: params
    })
}

export const batchUnlist = params => {
    return axios.request({
        url: '/shopee/batchUnlist',
        method: 'post',
        data: params
    })
}

export const getItemLimit = params => {
    return axios.request({
        url: '/shopee/getItemLimit',
        method: 'get',
        params
    })
}

export const getItemList = params => {
    return axios.request({
        url: '/shopee/getItemList',
        method: 'get',
        params
    })
}

export const bindFirstMile = params => {
    return axios.request({
        url: '/shopee/bindFirstMile',
        method: 'post',
        data: params
    })
}

export const getChannelIdList = params => {
    return axios.request({
        url: '/shopee/get_channel_list',
        method: 'get',
        params
    })
}

export const downloadShippingDocument = params => {
    return axios.request({
        url: '/shopee/downloadShippingDocument',
        method: 'post',
        responseType: 'blob',
        headers: {
            'Accept': 'application/octet-stream'
        },
        data: params
    })
}

export const createShippingDocument = params => {
    return axios.request({
        url: '/shopee/createShippingDocument',
        method: 'post',
        data: params
    })
}

export const getShippingDocumentResult = params => {
    return axios.request({
        url: '/shopee/getShippingDocumentResult',
        method: 'post',
        data: params
    })
}

export const getShippingDocumentDataInfo = params => {
    return axios.request({
        url: '/shopee/getShippingDocumentDataInfo',
        method: 'post',
        data: params
    })
}

export const getTrackingNumber = params => {
    return axios.request({
        url: '/shopee/getTrackingNumber',
        method: 'get',
        params
    })
}

export const generateFirstMileTrackingNumber = params => {
    return axios.request({
        url: '/shopee/generateFirstMileTrackingNumber',
        method: 'post',
        data: params
    })
}

export const getFirstMileTrackingNumber = params => {
    return axios.request({
        url: '/shopee/getFirstMileTrackingNumber',
        method: 'get',
        params
    })
}

export const addModel = params => {
    return axios.request({
        url: '/shopee/addModel',
        method: 'post',
        data: params
    })
}

export const syncAllShop = params => {
    return axios.request({
        url: '/shopee/syncAllShop',
        method: 'get',
        params
    })
}

export const batchUnlistAllShop = params => {
    return axios.request({
        url: '/shopee/batchUnlistAllShop',
        method: 'get',
        params
    })
}

export const setDiscountBackEnd = params => {
    return axios.request({
        url: '/shopee/setDiscountBackEnd',
        method: 'get',
        params
    })
}

export const addFlashSaleItems = params => {
    return axios.request({
        url: '/shopee/addFlashSaleItems',
        method: 'post',
        data: params
    })
}

export const createFlashSale = params => {
    return axios.request({
        url: '/shopee/createFlashSale',
        method: 'post',
        data: params
    })
}

export const getFlashSaleTimeSlotId = params => {
    return axios.request({
        url: '/shopee/getFlashSaleTimeSlotId',
        method: 'get',
        params
    })
}

export const getFlashSaleList = params => {
    return axios.request({
        url: '/shopee/getFlashSaleList',
        method: 'get',
        params
    })
}
