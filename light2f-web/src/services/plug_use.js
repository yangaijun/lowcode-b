import axios from 'libs/axios'

class PlugUse {  
    select(params = {}) {
        return axios.post('/PlugUse/select', params)
    }
    selectByProjectId(projectId) {
        return axios.post(`/PlugUse/selectByProjectId/${projectId}`)
    } 
    insertOrUpdate(params) {
        return axios.post('/PlugUse/insertOrUpdate', params)
    }
    /**
     * @param {plugUseType: string} params 
     * @returns promise
     */
    uniqueType(params) {
        return axios.post('/PlugUse/uniqueType', params)
    }
    
}

const plugUse = new PlugUse()
export default plugUse