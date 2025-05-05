import axios from './ajaxRequest'

export const getProducts = params => {
    return axios.request({
        url: '/product/search',
        method: 'get',
        params
    })
}

export const getProductsBatch = params => {
    return axios.request({
        url: '/product/searchMany',
        method: 'get',
        params
    })
}

export const addProduct = params => {
    return axios.request({
        url: '/product/add',
        method: 'post',
        data: params
    })
}

export const removeProducts = params => {
    return axios.request({
        url: '/product/remove',
        method: 'post',
        data: params
    })
}

export const editProduct = params => {
    return axios.request({
        url: '/product/edit',
        method: 'post',
        data: params
    })
}

export const editProductVideo = params => {
    return axios.request({
        url: '/product/editVideo',
        method: 'post',
        data: params
    })
}

export const editProductStatus = params => {
    return axios.request({
        url: '/product/editStatus',
        method: 'post',
        data: params
    })
}

export const editAttribute = params => {
    return axios.request({
        url: '/product/editAttribute',
        method: 'post',
        data: params
    })
}

export const getNewId = params => {
    return axios.request({
        url: '/product/getNewId',
        method: 'get',
        params
    })
}

export const getShopeeShopProducts = params => {
    return axios.request({
        url: '/product/searchShopeeShopProducts',
        method: 'get',
        params
    })
}

export const updateInventory = params => {
    return axios.request({
        url: '/product/updateInventory',
        method: 'post',
        data: params
    })
}
