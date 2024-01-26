import axios from 'libs/axios'

class Page { 
    selectOne(params) {
        return axios.post('/Page/selectOne', params)
    }
    selectLogin(params) {
        return  axios.post('/Page/selectLogin', params)
    }
    select(params) {
        return axios.post('/Page/select', params)
    }
    selectNested(params) {
        return axios.post('/Page/selectNested', params)
    }
    insert(params) {
        return axios.post('/Page/insert', params)
    }
    insertOrUpdate(params) {
        return axios.post('/Page/insertOrUpdate', params)
    }
    delete(params) {
        return axios.post('/Page/delete', params)
    }
    update(params) {
        return axios.post('/Page/update', params) 
    }
    updateNested(params) {
        return axios.post('/Page/updateNested', params)
    }
    tableNames(params) {
        return axios.post('/Page/tableNames', params)
    }
    tablesInfo(params) {
        return axios.post('/Page/tablesInfo', params) 
    }
}

const page = new Page()
export default page