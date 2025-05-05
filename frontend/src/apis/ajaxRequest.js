
import axios from 'axios'
import {baseURL} from '@/constants/url'

class AjaxRequest {
    constructor () {
        this.baseURL = baseURL
        this.timeout = 30000000
    }

    merge (options) {
        return {
            ...options,
            baseURL: this.baseURL,
            timeout: this.timeout
        }
    }

    setInterceptor (instance) {
        instance.interceptors.request.use(config => {
            return config
        })
        instance.interceptors.response.use(res => {
            return res.data
        })
    }

    request (options) {
        let instance = axios.create()
        this.setInterceptor(instance)

        let config = this.merge(options)
        return instance(config)
    }
}

export default new AjaxRequest()
