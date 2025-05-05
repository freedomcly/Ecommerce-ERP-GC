import axios from './ajaxRequest'

export const getAuthUrl = params => {
    return axios.request({
        url: '/auth/getAuthUrl',
        method: 'get',
        params
    })
}

export const getToken = params => {
    return axios.request({
        url: '/auth/getToken',
        method: 'get',
        params
    })
}

export const getAccessToken = params => {
    return axios.request({
        url: '/auth/getAccessToken',
        method: 'get',
        params
    })
}

export const getAuthList = params => {
    return axios.request({
        url: '/auth/getAuthList',
        method: 'get',
        params
    })
}

export const insertAuthRegion = params => {
    return axios.request({
        url: '/auth/insertAuthRegion',
        method: 'post',
        data: params
    })
}
