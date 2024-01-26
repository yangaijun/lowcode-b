import axios from 'axios';
import { message } from 'antd';
import { baseURL, tokenName, contentType } from 'systemConfig';
import { getToken } from './util';
import qs from 'qs';

const axiosConfig = {
	timeout: 30000,
  baseURL
} 
if (contentType) {
	axiosConfig.headers = {
		'Content-Type': contentType
	}
}
const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use(response => {
  return response.data
}, (error) => {
  const data = error.response?.data
  message.error(data?.message)
  //todo 跳到登錄
  // if (1001 === data?.code) {
  //   history.replace('/login')
  // }
  return Promise.reject(error.response)
})

axiosInstance.interceptors.request.use(config => { 
  const token = getToken()
  if (tokenName && token) { 
	if (!config.headers) config.headers = {}
    config.headers[tokenName] = token
  }
  
  return config
})

const paramsSerializer ={
    serialize: params => {
      //不同框架可能需要不一样的配置, { allowDots: true }
      return qs.stringify(params);
    }
} 

class HTTP {
  post(url, params, config) {
    return Promise.resolve({}) // axiosInstance.post(url, params, config)
  }
  get(url, params, config) {
    return axiosInstance.get(url, {
      params,
      paramsSerializer,
      ...config
    })
  }
  put(url, params, config) {
    return axiosInstance.put(url, params, config)
  }
  delete(url, params, config) {
    return axiosInstance.delete(url, {
      params,
      paramsSerializer,
      ...config
    })
  }
}

const Http = new HTTP()

export default Http