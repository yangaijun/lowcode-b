import { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'antd';
import PreviewLogin from './login';
import PreviewBase from './base';
import { useDispatch } from 'react-redux';
import { setProject } from 'slices/projectSlice';
import ApiPlugUse from 'services/plug_use';
import DragDiv from 'components/DragDiv';
import { createGolbalStyleFromLessString, deleteGolbalStyle } from 'views/light/components/center/preview/lessUtil';
import { useIKnow, useProject } from 'hooks';
import { parseURLParams, replaceOrAddQuery } from 'libs/utils';
import history from 'libs/history';
import { clearUser } from 'views/light/components/center/preview/utils';
import Bus, { BUS_KEYS } from 'views/light/bus';
import styles from './index.module.less';
import { clearUserProjectMenuPaths } from 'slices/pageSlice';

export const menus = {
    'login': "1",
    'base': "2"
}
const iknowKey = "iknowpreview"

export default function PreviewProject() {
    const routerState = parseURLParams();

    const {
        c,
        mpId,
        projectId
    } = routerState

    const dispatch = useDispatch()
    const [current, setCurrent] = useState(menus.login)
    const project = useProject(projectId, mpId)
    const [loading, setLoading] = useState(true)
    const { iKnow, confirm } = useIKnow(iknowKey, '预览与实际运行略有差异，以实际运行为准。知道了，下次不再提示？')
    const moveRef = useRef(false)

    useEffect(() => {
        if (project) {
            dispatch(clearUserProjectMenuPaths(true))

            dispatch(setProject(project)) 
            createGolbalStyleFromLessString(
                project.masterplateProject?.masterplateProjectStyle
            )
            setLoading(false)
            return () => {
                deleteGolbalStyle()
            }
        }
    }, [project])

    useEffect(() => {
        //加载项目使用的自定义组件
        ApiPlugUse.selectByProjectId(projectId).then(res => {
            Bus.set(BUS_KEYS.componentList, res)
        })
        return () => {
            Bus.set(BUS_KEYS.componentList, [])
        }
    }, [projectId])

    useEffect(() => {
        if (!iKnow) {
            confirm()
        }
    }, [iKnow, confirm])

    useEffect(() => {
        c && setCurrent(c)
    }, [c])

    const switchMenu = () => {
        history.replace(replaceOrAddQuery({
            c: current === menus.login ? menus.base : menus.login
        }))
    }

    if (loading) return null

    return (
        <div className={styles.main}>
            <DragDiv className={styles.fn} onMove={() => {
                moveRef.current = true
            }}>
                <Button type='primary' onClick={_ => {
                    if (moveRef.current) {
                        moveRef.current = false
                    } else {
                        switchMenu()
                    }
                }}>
                    {current === menus.login ? "跳过登录，切换到主菜单页" : "切换到登录页"}
                </Button>
            </DragDiv>
            {current === menus.login ?
                <PreviewLogin project={project} routerState={routerState} />
                : <PreviewBase project={project} routerState={routerState} onLogout={() => {
                    Modal.confirm({
                        title: '提示',
                        content: '确定退出当前用户？确定将会清除登录信息并回到登录页',
                        onOk() {
                            dispatch(clearUserProjectMenuPaths(true))

                            clearUser()
                            switchMenu()
                        }
                    })
                }} />
            }
        </div>
    )
}