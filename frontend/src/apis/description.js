import axios from './ajaxRequest'

export const getDescriptions = params => {
    return axios.request({
        url: '/description/search',
        method: 'get',
        params
    })
}

export const editDescription = params => {
    return axios.request({
        url: '/description/edit',
        method: 'post',
        data: params
    })
}

export const addDescription = params => {
    return axios.request({
        url: '/description/insert',
        method: 'post',
        data: params
    })
}

export const deleteDescription = params => {
    return axios.request({
        url: '/description/delete',
        method: 'post',
        data: params
    })
}
