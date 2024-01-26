import styles from './index.module.less'
import dayjs from 'dayjs'
import { EditOutlined, DownloadOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { getUserAvatar } from 'libs/utils'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Divider, Space } from 'antd'

export default function ProjectCard({ project, onEdit, onPreview, showId, className, onDownLoad, onDev }) {

    return <div className={classnames(styles.main, className)}>
        <div className={styles.cover}>
            <Space size={"middle"}>
                {onEdit && <div
                    className={styles.item}
                    title='编辑'
                    onClick={onEdit} >
                    <EditOutlined />
                </div>}
                {onDownLoad && <div
                    className={styles.item}
                    title='打包下载项目'
                    onClick={onDownLoad}>
                    <DownloadOutlined />
                </div>}
                {onPreview && <Link
                    title='模拟预览项目'
                    className={styles.item}
                    to={{ pathname: `/preview?projectId=${project.projectId}&mpId=${project.masterplateProject?.masterplateProjectId}` }}
                    target="_blank"
                    onClick={() => {
                        onPreview(project)
                    }}>
                    <EyeOutlined />
                </Link>}
                {onDev && <div
                    title='进入开发工作台'
                    className={styles.item}
                    onClick={() => { onDev(project) }}>
                    <ArrowRightOutlined />
                </div>}
            </Space>
        </div>

        <div className={styles.name}>
            {project.projectName}
        </div>
        {
            showId && <div className={styles.pid}>
                ID: {project.projectId}
            </div>
        }
        <div className={styles.desWraper}>
            <div className={classnames(styles.des, 'des')}>
                {project.projectDes}
            </div>
        </div>
        <div className={styles.pageCounts}>
            已建页面：{project.pageCounts || 0} 页
        </div>
        <Divider style={{ marginBottom: 12 }} />
        <div className={styles.bottom}>
            {
                project.userAvatar && <img alt={project.userName} className={styles.avatar} src={getUserAvatar(project.userAvatar)} />
            }
            <div >
                {project.userName}
            </div>
            <div className={styles.date}>
                {dayjs(project.createdAt).format("YY-MM-DD hh:mm")}
            </div>
        </div>
    </div>
}