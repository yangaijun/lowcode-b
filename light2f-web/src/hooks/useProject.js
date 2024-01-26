import { useEffect, useState } from 'react'
import ApiProject from 'services/project'
import ApiMasterplateProject from 'services/masterplate_project'

export default function useProject(projectId, masterplateProjectId) {
    const [project, setProject] = useState(null)

    useEffect(() => {
        if (projectId && masterplateProjectId) {
            Promise.all([
                ApiProject.selectById(projectId),
                ApiMasterplateProject.selectById(masterplateProjectId)
            ]).then(([r1, r2]) => {
                setProject({ ...r1, masterplateProject: r2 })
            })
        } else if (projectId) {
            ApiProject.selectById(projectId).then((res) => {
                setProject(res)
            })
        } else if (masterplateProjectId) {
            ApiMasterplateProject.selectById(masterplateProjectId).then(r => {
                setProject({ masterplateProject: r  })
            })
        }
    }, [projectId, masterplateProjectId])

    return project
}