import axios from './ajaxRequest'

export const login = params => {
  return axios.request({
      url: '/user/login',
      method: 'post',
      data: params
  })
}

export const register = params => {
  return axios.request({
      url: '/user/register',
      method: 'post',
      data: params
  })
}

export const logout = params => {
  return axios.request({
      url: '/user/logout',
      method: 'post',
      data: params
  })
}

export const info = params => {
  return axios.request({
      url: '/user/info',
      method: 'get',
      params
  })
}

export const list = params => {
  return axios.request({
      url: '/user/list',
      method: 'get',
      params
  })
}

export const remove = params => {
  return axios.request({
      url: '/user/remove',
      method: 'post',
      data: params
  })
}
