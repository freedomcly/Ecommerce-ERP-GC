import axios from './ajaxRequest'

export const getShops = params => {
    return axios.request({
        url: '/shop/search',
        method: 'get',
        params
    })
}

export const editShop = params => {
    return axios.request({
        url: '/shop/edit',
        method: 'post',
        data: params
    })
}

export const addShop = params => {
    return axios.request({
        url: '/shop/insert',
        method: 'post',
        data: params
    })
}

export const deleteShop = params => {
    return axios.request({
        url: '/shop/delete',
        method: 'post',
        data: params
    })
}
