import axios from './ajaxRequest'

export const getTask = params => {
    return axios.request({
        url: '/task/search',
        method: 'get',
        params
    })
}

export const addTask = params => {
    return axios.request({
        url: '/task/add',
        method: 'post',
        data: params
    })
}

export const removeTask = params => {
    return axios.request({
        url: '/task/remove',
        method: 'post',
        data: params
    })
}

export const removeAllTask = params => {
    return axios.request({
        url: '/task/removeAll',
        method: 'post',
        data: params
    })
}

export const editTask = params => {
    return axios.request({
        url: '/task/edit',
        method: 'post',
        data: params
    })
}

export const editTaskBatch = params => {
    return axios.request({
        url: '/task/editBatch',
        method: 'post',
        data: params
    })
}
