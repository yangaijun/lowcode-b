import styles from './index.module.less'
import { Dialog, Region } from 'freedomen'
import { Badge, Button, message } from 'antd'
import { getAddToMeForm } from '.'
import { CheckOutlined } from '@ant-design/icons'
import ApiPlugUse from 'services/plug_use'
import { canDoNext } from 'libs/utils'
import { useMemo } from 'react'

export default function AddPlugButton({ plug, projectId, plugUses, callBack }) {
    const isAdd = projectId && plugUses.find(p => {
        return p.projectId === Number(projectId) && p.plugSameId === plug.plugSameId
    })
    const { sames = [], uses = [] } = plug 
    const currentPlug = uses.find(el => el.projectId === Number(projectId))

    const options = useMemo(() => {
        return sames.map(el => {
            return {
                label: 'verion:' + el.plugVersion,
                value: el.plugVersion,
                disabled: el.plugVersion === currentPlug?.plugUseVersion
            }
        }).sort((a, b) => {
            return a.value - b.value
        })
    }, [sames, currentPlug])

    const isDot = useMemo(() => {
        if (!projectId || !sames.length) return false

        return !!sames.find(el => el.plugVersion > currentPlug?.plugUseVersion)
    }, [projectId, sames, currentPlug])

    return <div className={styles.use} onClick={e => { e.stopPropagation() }}>
        {
            isAdd ? <div className={styles.isAdd}>
                <Button disabled icon={<CheckOutlined />} className={styles.leftBtn}>
                    已添加
                </Button>
                <Badge dot={isDot}>
                    <Region
                        onEvent={params => {
                            if (params.prop === 'dropdown') {
                                const plugId = sames.find(el => el.plugVersion === params.value)?.plugId
                                if (!plugId) {
                                    message.error('切换版本失败，请刷新重试！')
                                    return
                                }

                                ApiPlugUse.insertOrUpdate({
                                    plugId,
                                    plugUseId: currentPlug.plugUseId,
                                    plugUseVersion: params.value
                                }).then(() => {
                                    message.success('版本切换成功！')
                                    callBack()
                                })
                            }
                        }}
                        columns={[
                            {
                                type: 'dropdown', prop: 'dropdown', options: options, config: {
                                    content: <Button className={styles.addMenu} >
                                        ...
                                    </Button>,
                                    trigger: 'click',
                                    placement: 'bottomRight'
                                }
                            }
                        ]}
                    />
                </Badge>
            </div> : <Button type='dashed' onClick={_ => {
                if (canDoNext("请选登录后，才可以添加")) {
                    Dialog.open("addToMe", { title: '添加到我的组件' }).then(set => {
                        set(getAddToMeForm(plug, projectId ? Number(projectId) : null, callBack))
                    })
                }
            }}>添加到项目</Button>
        }
    </div>
}

