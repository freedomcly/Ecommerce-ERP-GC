import axios from './ajaxRequest'

export const getType = params => {
    return axios.request({
        url: '/type/search',
        method: 'get',
        params
    })
}

export const editType = params => {
    return axios.request({
        url: '/type/edit',
        method: 'post',
        data: params
    })
}

export const addType = params => {
    return axios.request({
        url: '/type/insert',
        method: 'post',
        data: params
    })
}

export const deleteType = params => {
    return axios.request({
        url: '/type/delete',
        method: 'post',
        data: params
    })
}
