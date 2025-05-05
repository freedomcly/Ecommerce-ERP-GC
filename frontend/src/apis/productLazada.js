import axios from './ajaxRequest'

export const categoryTreeGet = params => {
    return axios.request({
        url: '/product_lazada/categoryTreeGet',
        method: 'get',
        params
    })
}

export const categoryAttributesGet = params => {
    return axios.request({
        url: '/product_lazada/categoryAttributesGet',
        method: 'get',
        params
    })
}

export const createProduct = params => {
    return axios.request({
        url: '/product_lazada/createProduct',
        method: 'post',
        data: params
    })
}

export const imagesMigrate = params => {
    return axios.request({
        url: '/product_lazada/imagesMigrate',
        method: 'post',
        data: params
    })
}

export const imageMigrate = params => {
    return axios.request({
        url: '/product_lazada/imageMigrate',
        method: 'post',
        data: params
    })
}

export const productItemGet = params => {
    return axios.request({
        url: '/product_lazada/productItemGet',
        method: 'get',
        params
    })
}

export const adjustSellableQuantity = params => {
    return axios.request({
        url: '/product_lazada/adjustSellableQuantity',
        method: 'post',
        data: params
    })
}

export const deactivateProduct = params => {
    return axios.request({
        url: '/product_lazada/deactivateProduct',
        method: 'post',
        data: params
    })
}
