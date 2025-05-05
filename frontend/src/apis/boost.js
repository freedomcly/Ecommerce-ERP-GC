import axios from './ajaxRequest'

export const getBoostList = () => {
    return axios.request({
        url: '/boost_shopee/getBoostList',
        method: 'get'
    })
}

export const getBoostCoolDownSecond = params => {
    return axios.request({
        url: '/boost_shopee/getBoostCoolDownSecond',
        method: 'get',
        params
    })
}

export const boostItem = params => {
    return axios.request({
        url: '/boost_shopee/boostItem',
        method: 'post',
        data: params
    })
}

export const addBoost = params => {
    return axios.request({
        url: '/boost_shopee/addBoost',
        method: 'post',
        data: params
    })
}

export const removeBoost = params => {
    return axios.request({
        url: '/boost_shopee/removeBoost',
        method: 'post',
        data: params
    })
}

export const removeBoostShop = params => {
    return axios.request({
        url: '/boost_shopee/removeBoostShop',
        method: 'post',
        data: params
    })
}

export const addBoostShop = params => {
    return axios.request({
        url: '/boost_shopee/addBoostShop',
        method: 'post',
        data: params
    })
}
