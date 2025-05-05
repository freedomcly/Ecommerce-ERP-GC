import axios from './ajaxRequest'

export const getSupplier = params => {
    return axios.request({
        url: '/supplier/search',
        method: 'get',
        params
    })
}

export const addSupplier = params => {
    return axios.request({
        url: '/supplier/add',
        method: 'post',
        data: params
    })
}

export const editSupplier = params => {
    return axios.request({
        url: '/supplier/edit',
        method: 'post',
        data: params
    })
}

export const deleteSupplier = params => {
    return axios.request({
        url: '/supplier/remove',
        method: 'post',
        data: params
    })
}
