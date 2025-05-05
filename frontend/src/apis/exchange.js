import axios from './ajaxRequest'

export const getExchangeRate = () => {
  return axios.request({
      url: 'https://api.exchangerate-api.com/v4/latest/CNY',
      method: 'get'
  })
}
