import axios from 'libs/axios'

class InitCode { 
    select(params) {
        return axios.post('/InitCode/select', params)
    } 
    selectByPageIds(params) {
        return axios.post('/InitCode/selectByPageIds', params)
    }
    selectOne(params) {
        return axios.post('/InitCode/selectOne', params)
    } 
    insertOrUpdate(params) {
        return axios.post('/InitCode/insertOrUpdate', params)
    }
    delete(params) {
        return axios.post('/InitCode/delete', params)
    } 
    updates(params) {
        return axios.post('/InitCode/updates', params)
    }
}

const initCode = new InitCode()
export default initCode