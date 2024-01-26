import { useState, useCallback, useEffect } from 'react'
import { Spin, Divider, Pagination, Space, Tag, Button, Alert, Empty, Modal } from 'antd'
import { Dialog, Region } from 'freedomen'
import styles from './index.module.less'
import history from 'libs/history'
import ApiPlug from 'services/plug'
import ApiPlugUse from 'services/plug_use'
import { StarOutlined, HeartOutlined, MessageOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { canDoNext, getUserAvatar } from 'libs/utils'
import AddPlugButton from './components/AddPlugButton'
import classnames from 'classnames'
import user from 'libs/user'
import { useIKnow } from 'hooks'
import { ComponentType } from 'views/light/types'
import { getTypeTag } from './components'

const iknowKey = "iknowplug"

export default function Plug({ projectId, pt, onPage, pageNo = 1, pageSize = 20 }) {
    const [loading, setLoading] = useState(false)
    const [plugUses, setPlugUses] = useState([])
    const [list, setList] = useState([])
    const [keyword, setKeyword] = useState("")
    const [type, setType] = useState("all")
    const [plugType, setPlugType] = useState(pt ? Number(pt) : null)
    const [total, setTotal] = useState(0)

    const loadData = useCallback(() => {
        setLoading(true)

        Promise.all([ApiPlug.select({ keyword, pageNo, plugType, pageSize, type }), ApiPlugUse.select()]).then(([{ data, page }, plugUses]) => {
            setList(data)
            setTotal(page.total)
            setLoading(false)

            setPlugUses(plugUses)

        })
    }, [keyword, pageNo, pageSize, plugType, type])

    useEffect(() => {
        loadData()
    }, [loadData])

    const { iKnow, confirm } = useIKnow(iknowKey)

    const stopPropagation = useCallback((e) => {
        e.stopPropagation()
    }, [])

    return <div className={classnames(styles.main)}>
        <Dialog name='addToMe' />
        {!iKnow && <Alert message="在系统库中组件无法满足需求时，可以自由编写组件上传并使用，如您需要的组件没有找到，需求合理，或有需求的人比较多，或您做为非前端人员不会开发自定义组件，可以在右下角反馈里描述您需要的组件" closable onClose={confirm} className={styles.alert} />}
        <Region
            className={styles.region}
            data={{ plugType, type, search: keyword }}
            onEvent={params => {
                if (params.type === 'search') {
                    setKeyword(params.value)
                } else if (params.prop === 'type') {
                    setType(params.value)
                } else if (params.prop === 'add') {
                    canDoNext("请先登录后，再创建你的组件！", "/plug/create")
                } else if (params.prop === 'plugType') {
                    setPlugType(params.value)
                }
            }}
            columns={[
                { type: "text", value: 'Plugs：' },
                [
                    { type: 'select', prop: 'type', placeholder: '请选择', options: { all: "全部", use: '已使用', self: "我的", fav: "收藏", star: "喜欢" }, style: { width: 120 } },
                    {
                        prop: 'plugType',
                        type: 'select',
                        placeholder: '组件类型',
                        options: { [ComponentType.element]: '元素', [ComponentType.container]: '容器' },
                        style: { width: 100 },
                        config: { allowClear: true }
                    },
                    { type: 'input-search', placeholder: '请输入关键字如：日历、图表...', prop: 'search', config: { allowClear: true } },
                    { type: 'inputgroup' }
                ],

                { type: 'button-primary', prop: 'add', value: '添加组件', style: { marginLeft: 25 }, config: { icon: <PlusOutlined /> } }
            ]}
        />
        <Spin spinning={loading}>
            {
                list.length
                    ? <ul>
                        {
                            list.map((el, index) => <li key={index}>
                                <Divider className={styles.line} />
                                <div className={styles.item} onClick={() => {
                                    window.open(`#/plug/detail?plugId=${el.plugId}${projectId ? '&projectId=' + projectId : ''}`, '_blank')
                                }}>
                                    <div className={styles.content}>
                                        <div className={styles.header}>
                                            <span className={styles.name} title="点击进入详情" target="_blank" >
                                                {el.plugName}
                                            </span>

                                            {user.getUserId() === el.userId && <Button icon={<EditOutlined />} title="编辑" size="small" type='link' onClick={(evt) => {
                                                evt.stopPropagation()
                                                history.push(`/plug/create?plugId=${el.plugId}`)
                                            }} />}
                                            <div className={styles.type}>
                                                {getTypeTag(el.plugType)}
                                            </div>
                                        </div>
                                        <Divider dashed style={{ margin: '12px 0' }} />
                                        <div className={styles.tags}>
                                            {
                                                JSON.parse(el.plugTags).map((tag, i) => {
                                                    return <Tag key={i} color="geekblue">{tag}</Tag>
                                                })
                                            }
                                        </div>
                                        <div className={'des'}>
                                            {el.plugDes}
                                        </div>
                                        <div className={styles.user} onClick={stopPropagation}>
                                            <img src={getUserAvatar(el.userAvatar)} alt="头像" className={styles.avatar} />
                                            <div className={styles.uname}>
                                                {el.userName}
                                            </div>
                                        </div>
                                        <div className={styles.fns} onClick={stopPropagation}>
                                            <Space split={<Divider type="vertical" />}>
                                                <div className={styles.fn} title="喜欢">
                                                    <HeartOutlined />
                                                    {el.plugStarCount}
                                                </div>
                                                <div className={styles.fn} title="收藏">
                                                    <StarOutlined />
                                                    {el.plugFavCount}
                                                </div>
                                                <div className={styles.fn} title="评论">
                                                    <MessageOutlined />
                                                    {el.plugCommentCount}
                                                </div>
                                            </Space>
                                        </div>
                                    </div>
                                    <AddPlugButton plug={el} projectId={projectId} plugUses={plugUses} callBack={loadData} />
                                </div>
                            </li>)
                        }
                    </ul>
                    :
                    <Empty style={{ marginTop: 25 }} description="暂无相关组件" />
            }
            <Divider className={styles.line} />
            <div className={styles.footer}>
                <Pagination
                    size="small"
                    total={total}
                    defaultPageSize={pageSize}
                    defaultCurrent={pageNo}
                    onChange={onPage}
                />
            </div>
        </Spin>
    </div>
}