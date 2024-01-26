import axios from 'axios'
import user from 'libs/user'
import { isPlainObject } from './util';
import qs from "qs";

const customAxiosInstance = axios.create()

customAxiosInstance.interceptors.response.use(response => {
    console.log("来自 " + response.config.url + ' 接口返回成功的数据：', response.data)
    return response.data
})

export function axiosCall(url, params = {}, { tokenName, contentType, responseType }, method = 'post', message) { 
    const parseUrl = new Function("params", "return `" + url + "`")(params) 
    
    const config = {
        timeout: 15000,
        url: parseUrl,
        method,
        params,
        data: params,
        headers: {},
        paramsSerializer: {
            serialize: params => {
                return qs.stringify(params);
            }
        }
    }
    if (tokenName) {
        config.headers[tokenName] = user.getUserProjectToken()
    }
    if (contentType) {
        config.headers['Content-Type'] = contentType
    }
    let userProjectAxiosHeaders = user.getUserProjectAxiosHeaders()
    if (userProjectAxiosHeaders) {
        try {
            let headers = (new Function('return ' + userProjectAxiosHeaders))()
            if (isPlainObject(headers)) {
                config.headers = {
                    ...config.headers,
                    ...headers
                }
            } else {
                message.error('调试数据 headers 数据结构不正确，示例： { tid: "" }')
            }
        } catch (error) {
            message.error('调试数据 headers 数据不正确，请检查')
        }
    }
    if (responseType) {
        config.responseType = responseType
    }

    return customAxiosInstance(config)
}