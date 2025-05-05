import axios from './ajaxRequest'

export const addProductCP = params => {
    return axios.request({
        url: '/coupang/addProductCP',
        method: 'post',
        data: params
    })
}

export const searchProduct = params => {
    return axios.request({
        url: '/coupang/searchProduct',
        method: 'get',
        params
    })
}

export const searchCategory = params => {
    return axios.request({
        url: '/coupang/searchCategory',
        method: 'get',
        params
    })
}
