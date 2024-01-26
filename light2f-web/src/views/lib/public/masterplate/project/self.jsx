import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import classNames from 'classnames'
import { PlusCircleOutlined } from "@ant-design/icons";
import ApiMasterplateProject from 'services/masterplate_project'
import { setLight } from 'slices/loadingSlice';
import { Button, Modal } from "antd";
import dayjs from 'dayjs';
import history from 'libs/history';
import styles from '../index.module.less'
import { getRouterPath } from 'libs/utils';
import user from 'libs/user';
import { TypeType } from 'views/light/types';

export default function SelfProject() {
    const [list, setList] = useState([])
    const dispatch = useDispatch()

    const loadData = useCallback(() => {
        dispatch(setLight(true))
        ApiMasterplateProject.selectSelf().then(res => {
            setList(res)
            dispatch(setLight(false))
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    const toDetail = useCallback((params) => {
        history.push(getRouterPath(params, { pathname: '/plate-project/detail' }))
    }, [])

    const load = (data) => {
        return data.userId === user.getUserId() || data.masterplateProjectType !== TypeType.system
    }

    return <div className={styles.main}>
        <div className={styles.create}>
            <div className={styles.tips}>
                提示：与项目应一一对应，相似或相同项目也建议复制一套而不多个项目使用同一母版
            </div>
            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={_ => {
                toDetail()
            }}>新建</Button>
        </div>
        <div className={styles.cards}>
            {
                list.map(el => <div key={el.masterplateProjectId} className={styles.card} onClick={_ => {
                    toDetail({ id: el.masterplateProjectId })
                }}>
                    <div className={styles.title}>
                        <div className={classNames(styles.name, 'text-ellipsis')}>{el.masterplateProjectName} </div>
                        {el.masterplateProjectType === TypeType.system && <div className={styles.sys}>系统预定义</div>}
                    </div>
                    <div className={styles.des}>
                        {el.masterplateProjectDes}
                    </div>
                    <div className={styles.date}>
                        {dayjs(el.createdAt).format("YYYY-MM-DD hh:mm")}
                    </div>
                    <div className={styles.bottom} onClick={e => e.stopPropagation()}>
                        <Button
                            type='link'
                            size='small'
                            className={styles.edit}
                            onClick={_ => {
                                toDetail({
                                    id: el.masterplateProjectId,
                                    insertType: 'copy'
                                })
                            }}>
                            复制
                        </Button>
                        {
                            !load(el) && <Button type='link' size='small' onClick={_ => {
                                toDetail({ id: el.masterplateProjectId })
                            }}>详情</Button>
                        }
                        {load(el) && <>
                            <Button
                                type='link'
                                size='small'

                                onClick={_ => {
                                    toDetail({ id: el.masterplateProjectId })
                                }}>
                                编辑
                            </Button>
                            <Button
                                type='link'
                                size='small'
                                danger
                                onClick={_ => {
                                    Modal.confirm({
                                        content: '确定要删除此项目母版？',
                                        onOk() {
                                            ApiMasterplateProject.delete(el).then(res => {
                                                loadData()
                                            })
                                        }
                                    })
                                }}>
                                删除
                            </Button>
                        </>}
                    </div>
                </div>)
            }
        </div>
    </div>
}