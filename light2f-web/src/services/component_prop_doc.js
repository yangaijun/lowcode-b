import axios from 'libs/axios'

class ComponentPropDoc {  
    insertOrUpdate(params) {
        return axios.post('/ComponentPropDoc/insertOrUpdate', params)
    }
    select(params) {
        return axios.post('/ComponentPropDoc/select', params)
    }
    selectAdmin() {
        return axios.post('/ComponentPropDoc/selectAdmin')
    }
    delete(params) {
        return axios.post('/ComponentPropDoc/delete', params)
    }
}

const componentPropDoc = new ComponentPropDoc();
export default componentPropDoc