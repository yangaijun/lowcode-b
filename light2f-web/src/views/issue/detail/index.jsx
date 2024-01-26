import { useState } from 'react'
import { FloatButton, Button, Divider, message, Pagination, Spin } from 'antd'
import user from 'libs/user'
import dayjs from 'dayjs'
import { canDoNext, getUserAvatar, parseURLParams, replaceOrAddQuery } from 'libs/utils'
import { Dialog, Form } from 'freedomen'
import { useEffect } from 'react'
import { useCallback } from 'react'
import ApiIssue from 'services/issue'
import ApiIssueComment from 'services/issue_comment'
import ApiIssueCommentStar from 'services/issue_comment_star'
import { CommentOutlined, UnorderedListOutlined, LikeOutlined } from '@ant-design/icons'
import history from 'libs/history'
import styles from './index.module.less'
import { HttpErrorData } from 'libs/axios'

const formColumns = [
    { type: 'quill', prop: 'issueCommentContent', rule: { 'must': '请添加评语', 'len10:': '最少3个字符' }, placeholder: '请输入回复内容' },
    { type: 'button-primary', prop: '$submit', value: '提交评论' }
]

function resetList(list, item, nextIam) {
    let newList = []
    for (let el of list) {
        let newItem = {
            ...el
        }
        if (el.issueCommentId === item.issueCommentId) {
            newItem.issueCommentStarIam = nextIam
            newItem.issueCommentStar += nextIam ? 1 : -1
        }
        if (el.children.length) {
            newItem.children = resetList(el.children, item, nextIam)
        }
        newList.push(newItem)
    }
    return newList
}

export default function IssueDetail() {
    const {
        pageNo = 1,
        issueId
    } = parseURLParams()

    const [issue, setIssue] = useState(null)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [text, setText] = useState("")

    const loadComment = useCallback(() => {
        if (issue) {
            setLoading(true)
            ApiIssueComment.select({ pageNo, pageSize: 10, issueId: issue?.issueId }).then(res => {
                setList(res.data)
                setTotal(res.page.total)
                setLoading(false)
            })
        }
    }, [pageNo, issue])

    const onSubmit = useCallback((data) => {
        data.issueId = issue.issueId
        ApiIssueComment.insertOrUpdate(data).then(res => {
            message.success('评论成功！')
            loadComment()
        })
        //清空表单
        return null
    }, [pageNo, issue])

    const getReplyForm = useCallback((issueComment) => {
        return <Form
            onSubmit={data => {
                Dialog.loading("issueComment")
                data.issueId = issue.issueId
                data.parentId = issueComment.issueCommentId
                ApiIssueComment.insertOrUpdate(data).then(_ => {
                    message.success('回复成功！')
                    loadComment()
                    Dialog.close("issueComment")
                })
            }}
            columns={[formColumns[0]]}
        />
    }, [loadComment])

    const iLike = useCallback((el) => {
        const issueCommentStarIam = el.issueCommentStarIam ? 0 : 1
        ApiIssueCommentStar.insertOrUpdate({
            issueCommentId: el.issueCommentId,
            issueCommentStarId: el.issueCommentStarId,
            issueCommentStarIam
        })
        //会在前端重新设计list
        setList(resetList(list, el, issueCommentStarIam))
    }, [list])

    useEffect(() => {
        loadComment()
    }, [loadComment])

    useEffect(() => {
        ApiIssue.selectById(issueId).then(res => {
            if (res !== HttpErrorData) {
                setIssue(res)
            } else {
                setText("该问题不存在！")
            }
        })
    }, [])

    const getCommentList = useCallback((list = []) => {
        if (list.length) {
            return <ul>
                {
                    list.map((el, key) => <li key={key}>
                        <div className={styles.comment}>
                            <div className={styles.avatar}>
                                <img alt="头像" src={getUserAvatar(el.userAvatar)} />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.user}>
                                    <div className={styles.name}>{el.userName}</div>
                                    <div>{dayjs(el.createdAt).format("YYYY-MM-DD HH:mm")}</div>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: el.issueCommentContent }} />
                            </div>
                            <div className={styles.end}>
                                {
                                    user.getUserId() !== el.userId && <Button type="text" onClick={_ => {
                                        if (canDoNext("请先登录后回复！")) {
                                            Dialog.open('issueComment', { title: `回复@${el.userName}` })
                                                .then(set => set(getReplyForm(el)))
                                        }
                                    }} icon={<CommentOutlined />} />
                                }
                                <Button
                                    type="text"
                                    icon={<LikeOutlined />}
                                    className={el.issueCommentStarIam && styles.like}
                                    onClick={_ => {
                                        message.info("别点了，无效！")
                                        //iLike(el)
                                    }}
                                >
                                    {el.issueCommentStar}
                                </Button>
                            </div>
                        </div>
                        <Divider style={{ margin: '10px 0' }} />
                        {getCommentList(el.children)}
                    </li>)
                }
            </ul>
        }
    }, [list, iLike])

    if (!issue) return <div className={styles.main}>{text}</div>

    return <div className={styles.main}>
        <Dialog name="issueComment" width={680} />
        <div className={styles.header}>
            <div className={styles.avatar}>
                <img alt="头像" src={getUserAvatar(issue.userAvatar)} />
            </div>
            <div className={styles.info}>
                <div className={styles.title}>
                    {issue.issueTitle}
                </div>
                <div className={styles.user}>
                    <div className={styles.name}>{issue.userName}</div>
                    <div>{dayjs(issue.createdAt).format("YYYY-MM-DD hh:mm")}</div>
                </div>
            </div>
        </div>
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: issue.issueContent }} />
        <div className={styles.commentTitle}>
            <UnorderedListOutlined /> 评论列表
        </div>
        <Divider />
        {getCommentList(list)}
        <Spin spinning={loading}>
            <div className={styles.footer}>
                <Pagination
                    size="small"
                    total={total}
                    defaultCurrent={pageNo}
                    onChange={(pageNo) => {
                        history.push(replaceOrAddQuery({ pageNo }))
                    }}
                />
            </div>
            <Form
                className={styles.form}
                onEvent={_ => { canDoNext('请先登录后再评论！') }}
                onSubmit={onSubmit}
                columns={formColumns}
            />
        </Spin>
        <FloatButton.BackTop />
    </div>
}