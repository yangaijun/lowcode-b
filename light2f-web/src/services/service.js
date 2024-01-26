import axios from 'libs/axios'

class Service { 
    select(params) {
        return axios.post('/Service/select', params)
    } 
    selectByPageIds(params) {
        return axios.post('/Service/selectByPageIds', params)
    }
    inserts(params) {
        return axios.post('/Service/inserts', params)
    } 
    insertOrUpdates(params) {
        return axios.post('/Service/insertOrUpdates', params)
    }
    update(params) {
        return axios.post('/Service/update', params)
    }
    delete(params) {
        return axios.post('/Service/delete', params)
    } 
}

const service = new Service()
export default service