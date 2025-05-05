import axios from './ajaxRequest'

export const getOrder = params => {
    return axios.request({
        url: '/order/search',
        method: 'get',
        params
    })
}

export const addOrder = params => {
    return axios.request({
        url: '/order/add',
        method: 'post',
        data: params
    })
}

export const removeOrder = params => {
    return axios.request({
        url: '/order/remove',
        method: 'post',
        data: params
    })
}

export const editOrder = params => {
    return axios.request({
        url: '/order/edit',
        method: 'post',
        data: params
    })
}

export const shipOrder = params => {
    return axios.request({
        url: '/order/shipOrder',
        method: 'post',
        data: params
    })
}

export const editOrderBatch = params => {
    return axios.request({
        url: '/order/editBatch',
        method: 'post',
        data: params
    })
}

export const autoImport = params => {
    return axios.request({
        url: '/order/autoImport',
        method: 'get',
        params
    })
}
