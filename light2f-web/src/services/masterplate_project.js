import axios from 'libs/axios'

class MasterplateProject {
    select(params = {}) {
        return axios.post('/MasterplateProject/select', params)
    }
    selectSelf() {
        return axios.post('/MasterplateProject/selectSelf')
    }
    selectById(masterplateProjectId) {
        return axios.post(`/MasterplateProject/selectById/${masterplateProjectId}`)
    }
    permission(params) {
        return axios.post('/MasterplateProject/permission', params)
    }
    delete(params) {
        return axios.post('/MasterplateProject/delete', params)
    }
    insertOrUpdate(params) {
        return axios.post('/MasterplateProject/insertOrUpdate', params)
    }
    defaultId() {
        return axios.post('/MasterplateProject/defaultId')
    }
}

const masterplateProject = new MasterplateProject()
export default masterplateProject