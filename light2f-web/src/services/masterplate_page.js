import axios from 'libs/axios'

class MasterplatePage {  
    aiCopy() {
        return axios.post('/MasterplatePage/copyDefault')
    }
    select(params = {}) {
        return axios.post('/MasterplatePage/select', params)
    }
    selectById(masterplatePageId) {
        return axios.post(`/MasterplatePage/selectById/${masterplatePageId}`)
    }
    selectSelf() {
        return axios.post('/MasterplatePage/selectSelf')
    }
    delete(params) {
        return axios.post('/MasterplatePage/delete', params)
    }
    insertOrUpdate(params) {
        return axios.post('/MasterplatePage/insertOrUpdate', params)
    }
    defaultId() {
        return axios.post('MasterplatePage/defaultId')
    }
}

const masterplatePage = new MasterplatePage()
export default masterplatePage