import axios from 'libs/axios'

class Component {
    createInfo(params) {
        return axios.post('/Component/createInfo', params)
    }
    updateSorts(params) {
        return axios.post('/Component/updateSorts', params)
    }
    groupOptions(params) {
        return axios.post('/Component/groupOptions', params)
    }
    insertOrUpdate(params) {
        return axios.post('/Component/insertOrUpdate', params)
    }
    select(params) {
        return axios.post('/Component/select', params)
    }
    delete(params) {
        return axios.post('/Component/delete', params)
    }
}

const component = new Component();
export default component