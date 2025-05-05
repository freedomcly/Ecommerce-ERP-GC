import axios from './ajaxRequest'

export const searchData = params => {
    return axios.request({
        url: '/data/search',
        method: 'get',
        params
    })
}
