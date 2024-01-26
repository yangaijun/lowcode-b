import axios from 'libs/axios'

class Issue { 
    select(params) {
        return axios.post('/Issue/select', params)
    }  
    selectById(issueId) {
        return axios.post(`/Issue/selectById/${issueId}`)
    }  
    insertOrUpdate(params) {
        return axios.post('/Issue/insertOrUpdate', params)
    }
    delete(params) {
        return axios.post('/Issue/delete', params)
    }  
}


const issue = new Issue()
export default issue