import { Alert, Modal, Spin } from "antd"
import { useCallback, useEffect, useState } from "react"
import projectService from "services/project"
import ProjectCard from "components/ProjectCard"
import { downloadProject, toDesign } from "libs/utils"
import styles from './index.module.less'
import { useIKnow } from "hooks"
import user from "libs/user"

const iknowKey = "iknowpubproject"

export default function PublicProject() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState()

    const loadData = useCallback(() => {
        setLoading(true)
        projectService.selectPublic().then(res => {
            setProjects(res.filter(
                el => el.userId !== user.getUserId()
            ))
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    const { iKnow, confirm } = useIKnow(iknowKey)

    return <Spin spinning={loading} >
        {!iKnow && <Alert closable message="公共项目可以被任何人使用，创建项目的时候被复制，或被直接下载" onClose={confirm} className={styles.alert} />}

        <div className={styles.cards} >
            {
                projects.map(project => (
                    <ProjectCard
                        onDev={toDesign}
                        showId
                        project={project}
                        onPreview={() => { }}
                        key={project.projectId}
                        className={"project-card"}
                        onDownLoad={() => {
                            Modal.confirm({
                                content: '确认下载此项目？',
                                onOk() {
                                    setLoading(true)
                                    downloadProject(project, () => {
                                        setLoading(false)
                                    })
                                }
                            })
                        }}
                    />
                ))
            }
        </div>
    </Spin>
}