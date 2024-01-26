import { useState } from 'react';
import { Divider, message, Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import ApiIssue from 'services/issue'
import history from 'libs/history';
import { Dialog, Form, Region } from 'freedomen';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useCallback } from 'react';
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { getUserAvatar, canDoNext, replaceOrAddQuery, parseURLParams } from 'libs/utils';
import classnames from 'classnames'
import styles from './index.module.less'

var pageSize = 20

export default function Issue() {
    const {
        pageNo = 1
    } = parseURLParams()

    const [loading, setLoading] = useState(true)
    const [list, setList] = useState([])
    const [keyword, setKeyword] = useState("")
    const [total, setTotal] = useState(0)

    const loadData = useCallback(() => {
        setLoading(true)
        ApiIssue.select({ pageNo, keyword, pageSize }).then(({ data, page }) => {
            setList(data)
            setTotal(page.total)
            setLoading(false)
        })
    }, [pageNo, pageSize, keyword])

    useEffect(() => {
        loadData()
    }, [loadData])

    const createForm = useMemo(() => {
        return <Form
            onSubmit={data => {
                Dialog.loading("issue")
                ApiIssue.insertOrUpdate(data).then(_ => {
                    Dialog.close("issue")
                    message.success('创建成功！')
                    loadData()
                })
            }}
            columns={[
                { type: 'input', prop: 'issueTitle', label: '标题', rule: 'must', config: { maxLength: 56 } },
                { type: 'quill', prop: 'issueContent', label: '具体描述', rule: 'must', style: { height: 280, marginBottom: 58 } }
            ]}
        />
    }, [])

    return <div className={classnames(styles.main, 'main-center')}>
        <Dialog name="issue" width={680} />
        <Region
            className={styles.region}
            onEvent={params => {
                if (params.type === 'search') {
                    setKeyword(params.value)
                } else if (params.prop === 'create') {
                    if (canDoNext('请先登录后创建')) {
                        Dialog.open("issue", { title: '新建  Issue' }).then(set => set(createForm))
                    }
                }
            }}
            columns={[
                { type: 'button-primary', prop: 'create', value: '新建  Issue', config: { icon: <PlusOutlined /> } },
                { type: 'input-search', prop: 'search', placeholder: '请输入关键字如：插件怎么用', className: styles.search, config: { allowClear: true } }
            ]}
        />
        <Spin spinning={loading}>
            {list.length ? <>
                <ul>
                    {
                        list.map(el => <li key={el.issueId}>
                            <Divider className={styles.line} />
                            <div className={styles.content}>
                                <div className={styles.avatar}>
                                    <img alt="头像" src={getUserAvatar(el.userAvatar)} />
                                </div>
                                <div className={styles.info}>
                                    <Link className={styles.issueTitle} to={`/issue/detail?issueId=${el.issueId}`} target="_blank">
                                        {el.issueTitle}
                                    </Link>
                                    <div className={styles.user}>
                                        <div className={styles.name}>{el.userName}</div>
                                    </div>
                                </div>
                                <div className={styles.end}>
                                    <div>{el.issueCommentCount} <MessageOutlined /></div>
                                    {dayjs(el.createdAt).format("YYYY-MM-DD hh:mm")}
                                </div>
                            </div>
                        </li>)
                    }
                </ul>
                <Divider className={styles.line} />
                <div className={styles.footer}>
                    <Pagination
                        size="small"
                        total={total}
                        defaultPageSize={pageSize}
                        defaultCurrent={pageNo}
                        onChange={(pNo, pSize) => {
                            pageSize = pSize
                            history.push(replaceOrAddQuery({ pageNo: pNo }))
                        }}
                    />
                </div> </> :
                <div className={styles.empty}>
                    未找到相关Issues, 您可以点击新建 Issue 来添加
                </div>
            }
        </Spin>
    </div>
}
