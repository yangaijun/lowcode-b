
import React, { useEffect, useState } from 'react'
import { Form } from 'freedomen'
import ApiNotice from 'services/notice'
import { Divider, message } from 'antd'
import dayjs from 'dayjs'

export default function Notice() {
    const [hasPermission, setHasPermission] = useState(false)
    const [noticeList, setNoticeList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        //进来就全部已读
        ApiNotice.isAllRead()

        ApiNotice.hasPermission().then(res => {
            if (res) {
                setHasPermission(res)
            } else {
                ApiNotice.select().then(res => {
                    setNoticeList(res)
                })
            }
        })
    }, [])

    return (
        <div>
            <h1>系统通知</h1>
            {hasPermission ? <div>
                <Form
                    onSubmit={data => {
                        setLoading(true)
                        ApiNotice.sendNotice(data).then(res => {
                            message.success("成功发送" + res + "条通知！")
                            setLoading(false)
                        })
                    }}
                    columns={[
                        { type: "input", prop: "noticeTitle", placeholder: "请输入标题", rule: 'must' },
                        { type: "quill", prop: "noticeContent", placeholder: "请输入内容", rule: 'must' },
                        { type: "input", prop: "email", placeholder: "请输入用户的e-mail，不输入则默认是系统中所有人", rule: "empty,email"},
                        { type: "button-primary", prop: "$submit", value: "发送", config: { loading } },
                    ]}
                />
            </div> : <div>
                {noticeList.map(el => <div key={el.noticeId}>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, marginRight: 12 }}>{el.noticeTitle}</div>
                        <span style={{ color: '#999', fontSize: 12 }}>{dayjs(el.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: el.noticeContent }} />
                    <Divider />
                </div>)}
            </div>}
        </div>
    )
}