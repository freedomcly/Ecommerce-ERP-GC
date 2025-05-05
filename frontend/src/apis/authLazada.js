import axios from './ajaxRequest'

export const createToken = params => {
    return axios.request({
        url: '/auth_lazada/createToken',
        method: 'get',
        params
    })
}

export const getCurrentTokenData = params => {
    return axios.request({
        url: '/auth_lazada/getCurrentTokenData',
        method: 'get',
        params
    })
}

export const refreshToken = params => {
    return axios.request({
        url: '/auth_lazada/refreshToken',
        method: 'get',
        params
    })
}
