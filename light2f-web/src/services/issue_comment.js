import axios from 'libs/axios'

class IssueComment { 
    select(params) {
        return axios.post('/IssueComment/select', params)
    }  
    insertOrUpdate(params) {
        return axios.post('/IssueComment/insertOrUpdate', params)
    }
    delete(params) {
        return axios.post('/IssueComment/delete', params)
    }  
}

const issueComment = new IssueComment()
export default issueComment