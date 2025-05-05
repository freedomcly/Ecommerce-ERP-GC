import axios from './ajaxRequest'

export const getTag = params => {
    return axios.request({
        url: '/tag/search',
        method: 'get',
        params
    })
}

export const editTag = params => {
    return axios.request({
        url: '/tag/edit',
        method: 'post',
        data: params
    })
}

export const addTag = params => {
    return axios.request({
        url: '/tag/insert',
        method: 'post',
        data: params
    })
}

export const deleteTag = params => {
    return axios.request({
        url: '/tag/delete',
        method: 'post',
        data: params
    })
}
