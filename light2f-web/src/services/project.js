import axios from 'libs/axios'

class Project {
    isMaxProject() {
        return axios.post('/Project/isMaxProject')
    }
    aiGenerate(params) {
        return axios.post('/Project/aiGenerate', params)
    }
    aiUploadSql(file) {
        const formData = new FormData()
        formData.append('file', file)

        return axios.post(`/Project/parserSql`, formData)
    }
    aiTestDBConnect(params) {
        return axios.post('/Project/testDBConnect', params)
    }
    aiGetDbInfo(params) {
        return axios.post('/Project/getDbInfo', params)
    }
    aiGetDbInfoByUid(uid) {
        return axios.post(`/Project/getDbInfoByUid/${uid}`)
    }
    permission(params) {
        return axios.post('/Project/permission', params)
    }
    selectExp() {
        return axios.post('/Project/selectExp')
    }
    select(params) {
        return axios.post('/Project/select', params)
    }
    selectById(projectId) {
        return axios.post(`/Project/selectById/${projectId}`)
    }
    selectPublic() {
        return axios.post('/Project/selectPublic')
    }
    insert(params) {
        return axios.post('/Project/insert', params)
    }
    delete(params) {
        return axios.post('/Project/delete', params)
    }
    insertOrUpdate(params) {
        return axios.post('/Project/insertOrUpdate', params)
    }
    down(params, projectName) {
        return new Promise((resolve) => {
            axios.post('/Project/down', params, {
                responseType: 'blob'
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${projectName}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                resolve()
            })
        }) 
    }
}

const project = new Project()
export default project