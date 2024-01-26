import axios from 'libs/axios'

class Plug {
    select(params) {
        return axios.post('/Plug/select', params)
    }
    codeNames(plugUid) {
        return axios.post(`/Plug/${plugUid}/codeNames`)
    }
    selectById(plugId) {
        return axios.post(`/Plug/selectById/${plugId}`)
    }
    selectBySameId(plugSameId) {
        return axios.post(`/Plug/selectBySameId/${plugSameId}`)
    }
    selectBySameIds(plugSameIds) {
        return axios.post(`/Plug/selectBySameIds`, plugSameIds)
    }
    insertOrUpdate(params) {
        return axios.post('/Plug/insertOrUpdate', params)
    }
}

const plug = new Plug()
export default plug