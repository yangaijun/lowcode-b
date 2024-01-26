import axios from 'libs/axios'
class User {
    login(params) {
        return axios.post('/User/login', params)
    }
    refreshToken() {
        return axios.post('/User/refreshToken')
    }
    register(params) {
        return axios.post('/User/register', params)
    }
    count() {
        return axios.post('/User/count')
    }
    forget(params) {
        return  axios.post('/User/forget', params)
    }
    get(params) {
        return axios.post('/User/select', params)
    }
    email(params) {
        return axios.post('/User/email', params)
    }
    info() {
        return axios.post('/User/info')
    }
    update(params) {
        return axios.post('/User/update', params)
    }
    getGuestToken() {
        return axios.post('/User/guestToken')
    }

    upload(formData) {
        return axios.post('/User/uploadComponent', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            }
        })
    }

    feedback(params) {
        return axios.post('/Log/insertOrUpdate', params)
    }
}

const user = new User()
export default user