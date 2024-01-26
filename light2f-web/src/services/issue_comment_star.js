import axios from 'libs/axios'

class IssueCommentStar { 
    insertOrUpdate(params) {
        return axios.post('/IssueCommentStar/insertOrUpdate', params)
    } 
}

export default new IssueCommentStar()