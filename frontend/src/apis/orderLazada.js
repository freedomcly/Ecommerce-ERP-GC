import axios from './ajaxRequest'

export const getOrders = params => {
    return axios.request({
        url: '/order_lazada/getOrders',
        method: 'get',
        params
    })
}

export const getOrderItems = params => {
    return axios.request({
        url: '/order_lazada/getOrderItems',
        method: 'get',
        params
    })
}

export const getOrdersItems = params => {
    return axios.request({
        url: '/order_lazada/getOrdersItems',
        method: 'get',
        params
    })
}

export const getOrderLazada = params => {
    return axios.request({
        url: '/order_lazada/getOrder',
        method: 'get',
        params
    })
}

export const getTransactionDetails = params => {
    return axios.request({
        url: '/order_lazada/getTransactionDetails',
        method: 'get',
        params
    })
}
