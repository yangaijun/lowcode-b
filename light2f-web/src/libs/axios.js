import { message } from 'antd';
import axios from 'axios';
import user from 'libs/user'
import ApiUser from 'services/user'
import history from './history';

const axiosInstance = axios.create({
  baseURL: "/lightApi",
  timeout: 30000
});

axiosInstance.interceptors.request.use(request => {
  request.headers['token'] = user.getToken()

  if (request.data === void 0) {
    request.data = {}
  }
  return request
})

let isRefreshing = false,
  requests = [];

function blobToJSON(blob, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    var data = JSON.parse(reader.result);
    callback(data);
  }
  reader.readAsText(blob);
}

axiosInstance.interceptors.response.use(response => {
  return (response.data.data === void 0) ? response.data : response.data.data
}, async (error) => {
  const data = error.response?.data
  const config = error.response?.config

  if (1001 === data?.code) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const res = await ApiUser.refreshToken()
        isRefreshing = false;

        if (res.token) {
          user.resetToken(res.token)
          requests.forEach(rq => rq());
          requests.length = 0;
          return axiosInstance(config);
        }
      } catch (error) {
        isRefreshing = false;
        user.logout()
        history.replace('/light/in?type=login')
        return Promise.reject(error)
      }
    } else {
      return new Promise((resolve) => {
        requests.push(() => {
          resolve(axiosInstance(config));
        })
      })
    }
  } else {
    if (data instanceof Blob) {
      blobToJSON(data, (d) => {
        message.error(d?.message || '无法连接服务器')
      })
    } else {
      message.error(data?.message || '无法连接服务器')
    }

    if (1002 === data?.code) {
      history.replace('/light/in?type=login')
    }

    return Promise.reject(error.response)
  }
})

export default axiosInstance;

export const HttpErrorData = -1;
