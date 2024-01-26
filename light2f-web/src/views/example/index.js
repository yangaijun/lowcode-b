import { useState, useEffect } from 'react'
import { Modal, Spin } from 'antd';
import ApiProject from 'services/project'
import classnames from 'classnames'
import ProjectCard from 'components/ProjectCard';
import { canDoNext, downloadProject, toDesign } from 'libs/utils';
import styles from './index.module.less'

export default function Example() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState()

    useEffect(() => {
        setLoading(true)
        ApiProject.selectExp().then(res => {
            setProjects(res)
            setLoading(false)
        })
    }, [])

    return <div className={classnames(styles.main, 'main-center-project')}>
        <Spin spinning={loading} >
            <div className={styles.cards}>
                {
                    projects.map(project => (
                        <ProjectCard
                            key={project.projectId}
                            project={project}
                            className={"project-card"}
                            onPreview={() => { }}
                            onDev={toDesign}
                            onDownLoad={() => {
                                if (canDoNext("请先登录后再下载！")) {
                                    Modal.confirm({
                                        content: '确认下载此项目？',
                                        onOk() {
                                            setLoading(true)
                                            downloadProject(project, () => {
                                                setLoading(false)
                                            })
                                        }
                                    })
                                }
                            }}
                        />
                    ))
                }
            </div>
        </Spin>
    </div>

}