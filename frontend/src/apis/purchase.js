import axios from './ajaxRequest'

export const getPurchaseNote = params => {
    return axios.request({
        url: '/purchase/search',
        method: 'get',
        params
    })
}

export const addPurchaseNote = params => {
    return axios.request({
        url: '/purchase/add',
        method: 'post',
        data: params
    })
}

export const removePurchaseNote = params => {
    return axios.request({
        url: '/purchase/remove',
        method: 'post',
        data: params
    })
}

export const editPurchaseNote = params => {
    return axios.request({
        url: '/purchase/edit',
        method: 'post',
        data: params
    })
}
