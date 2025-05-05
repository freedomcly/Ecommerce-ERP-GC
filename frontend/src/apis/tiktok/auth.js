import axios from '../ajaxRequest'

export const getAccessTokenTiktok = params => {
    return axios.request({
        url: '/tiktok/auth/getAccessToken',
        method: 'get',
        params
    })
}

export const getAuthorizedShops = params => {
    return axios.request({
        url: '/tiktok/auth/getAuthorizedShops',
        method: 'get',
        params
    })
}
