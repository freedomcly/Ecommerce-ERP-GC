import axios from './ajaxRequest'

export const getDefaultDiscount = params => {
    return axios.request({
        url: '/activity/getDefaultDiscount',
        method: 'get',
        params
    })
}

export const addDefaultDiscount = params => {
    return axios.request({
        url: '/activity/addDefaultDiscount',
        method: 'post',
        data: params
    })
}
