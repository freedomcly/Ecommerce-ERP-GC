import axios from '../ajaxRequest'

export const createProductTiktok = params => {
    return axios.request({
        url: '/tiktok/product/createProduct',
        method: 'post',
        data: params
    })
}

export const publishProductTiktok = params => {
    return axios.request({
        url: '/tiktok/product/publishProduct',
        method: 'post',
        data: params
    })
}

export const searchCategoryTiktok = params => {
    return axios.request({
        url: '/tiktok/product/searchCategoryTiktok',
        method: 'get',
        params
    })
}

export const uploadImageTikTok = params => {
    return axios.request({
        url: '/tiktok/product/uploadImageTikTok',
        method: 'post',
        data: params
    })
}

export const getGlobalProductTiktok = params => {
    return axios.request({
        url: '/tiktok/product/getGlobalProduct',
        method: 'get',
        params
    })
}
