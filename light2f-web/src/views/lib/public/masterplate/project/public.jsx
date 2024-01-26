import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import classNames from 'classnames'
import ApiMasterplateProject from 'services/masterplate_project'
import { setLight } from 'slices/loadingSlice';
import { Button } from "antd";
import dayjs from 'dayjs';
import history from 'libs/history';
import styles from '../index.module.less'
import { TypeType } from 'views/light/types';
import user from 'libs/user';
import { getRouterPath } from 'libs/utils';

export default function PublicProject() {
    const [list, setList] = useState([])
    const dispatch = useDispatch()

    const loadData = useCallback(() => {
        dispatch(setLight(true))
        ApiMasterplateProject.select({ masterplateProjectType: TypeType.public }).then(res => {
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

    return <div className={styles.main}>
        <div className={styles.create} />

        <div className={styles.cards}>
            {
                list.map(el => <div key={el.masterplateProjectId} className={styles.card}>
                    <div className={styles.title}>
                        <div className={classNames(styles.name, 'text-ellipsis')}>{el.masterplateProjectName} </div>
                        {el.userId === user.getUserId() && <div className={styles.df}>self</div>}
                    </div>
                    <div className={styles.des}>
                        {el.masterplateProjectDes}
                    </div>
                    <div className={styles.date}>
                        {dayjs(el.createdAt).format("YY-MM-DD hh:mm")}
                    </div>
                    <div className={styles.bottom}>
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
                        <Button type='link' size='small' onClick={_ => {
                            toDetail({ id: el.masterplateProjectId })
                        }}>详情</Button>
                    </div>
                </div>)
            }
        </div>
    </div>
}