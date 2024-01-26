import axios from 'libs/axios'

class Notice {
    hasPermission(params) {
        return axios.post('/Notice/hasPermission', params)
    }
    sendNotice(params) {
        return axios.post('/Notice/sendNotice', params)
    }
    isAllRead(params) {
        return axios.post('/Notice/isAllRead', params)
    }
    select(params) {
        return axios.post('/Notice/select', params)
    }
    getBadgeCount(params) {
        return axios.post('/Notice/getBadgeCount', params)
    } 
}

const notice = new Notice();
export default notice