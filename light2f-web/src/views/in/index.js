import { useCallback, useState } from 'react'
import { Tabs, Card, message, Button, Image } from 'antd';
import { Dialog, Form } from 'freedomen';
import User, { UserType } from 'libs/user';
import apiUser from 'services/user';
import { parseURLParams } from 'libs/utils';
import BookQrcode from 'imgs/book_qrcode.jpg'
import './index.less';
import { LockFilled, MailOutlined } from '@ant-design/icons';
const testEmail = (email) => {
    return !/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email)
}

export default function In({ history }) {
    const {
        type,
        from: _from,
    } = parseURLParams()

    const [loading, setLoading] = useState(false)
    const [isSend, setIsSend] = useState(false)
    const [isExsit, setIsExsit] = useState(true)
    const [visible, setVisible] = useState(false)

    const setUserInfo = useCallback(res => {
        setLoading(false)

        User.setToken(UserType.User, res.token)
        User.setUserId(res.user?.userId)
        User.setUserName(res.user?.userName)
        User.setUserAvatar(res.user?.userAvatar)
    }, [])

    const onSuccess = useCallback((res, msg) => {
        if (msg) {
            message.success(msg)
        }
        setUserInfo(res)
        if (_from) {
            history.push(_from)
        } else {
            history.push('/home')
        }
    }, [_from, setUserInfo, history])

    const getForgetForm = useCallback(() => {
        return <Form
            config={{ layout: "vertical" }}
            onEvent={params => {
                if (params.prop === 'sendCode') {
                    apiUser.email({ userEmail: params.row.userEmail, sendType: 'forget' }).then(res => {
                        message.success("验证码已发送，有效时长5分钟！")
                    })
                    params.row.isSend = !params.row.isSend
                    return params.row
                }
            }}
            onSubmit={data => {
                apiUser.forget(data).then(res => {
                    onSuccess(res, '密码修改成功！')
                })
            }}
            columns={[
                { type: 'input', prop: 'userEmail', label: '电子邮箱', placeholder: '请输入要修改密码的电子邮箱，如111@qq.com', rule: "email", config: { prefix: <MailOutlined /> } },
                [
                    { type: 'input', placeholder: '请输入验证码', prop: 'code', rule: { must: '请输入验证码' }, style: { width: 280, marginRight: 12 } },
                    {
                        type: 'button-primary', prop: 'sendCode', filter: () => isSend ? "验证码已发送" : '发送验证码', disabled({ data }) {
                            return (data.isSend || testEmail(data.userEmail))
                        }
                    },
                    { type: 'formitem', label: '验证码', config: { required: true } }
                ],
                { type: 'input-password', label: '新密码', prop: 'userPassword', placeholder: '请输入新密码', rule: { must: '请输入密码' }, config: { submitEventType: 'pressEnter', prefix: <LockFilled /> } },
            ]}
        />
    }, [isSend, onSuccess])

    const items = [
        {
            key: 'login',
            label: '登录',
            children: <div style={{ padding: 5 }}>
                <div style={{ marginBottom: 20, color: '#ccc' }}> 体验账号: 扫码<Button size='small' type="link" onClick={() => setVisible(true)}>订阅号</Button>回复(注意：同时只能一人使用)： 体验  </div>
                <Form
                    onSubmit={data => {
                        setLoading(true)
                        apiUser.login(data).then(onSuccess).catch(_ => {
                            setLoading(false)
                        })
                    }}
                    onEvent={params => {
                        if (params.prop === 'forget') {
                            Dialog.open("modify").then(set => {
                                set(getForgetForm())
                            })
                        }
                    }}
                    columns={[
                        { type: 'input', prop: 'userEmail', placeholder: '请输入电子邮箱，如111@qq.com', rule: "email", config: { maxLength: 120, prefix: <MailOutlined /> } },
                        { type: 'input-password', prop: 'userPassword', placeholder: '请输入密码', rule: { must: '请输入密码' }, config: { maxLength: 28, submitEventType: 'pressEnter', prefix: <LockFilled /> } },
                        { type: 'button-link@small', prop: 'forget', value: '忘记密码？', style: { marginLeft: -8 } },
                        { render: () => <br /> },
                        [
                            { type: 'button-primary', value: '登录', prop: '$submit', config: { shape: 'round', loading: loading }, style: { width: 260 } },
                            { type: 'div', style: { display: 'flex', justifyContent: 'center' } }
                        ]
                    ]}
                />
            </div>
        }, {
            key: 'register',
            label: '注册',
            children: <div style={{ padding: 25 }}>
                <Form
                    onSubmit={data => {
                        setLoading(true)
                        apiUser.register(data).then(res => {
                            onSuccess(res, '注册成功')
                        }).finally(_ => {
                            setLoading(false)
                            setIsSend(false)
                        })
                    }}
                    onEvent={params => {
                        if (params.prop === 'sendCode') {
                            setIsSend(true)
                            apiUser.email({ userEmail: params.row.userEmail }).then(res => {
                                message.success('验证码已发送，有效时长5分钟！')
                            })
                        }
                    }}
                    columns={[
                        {
                            type: 'input', prop: 'userEmail', placeholder: '请输入电子邮箱，如111@qq.com', rule({ value, rules }) {
                                if (!value) {
                                    return Promise.reject('请输入邮箱')
                                } else if (!rules.email.regular.test(value)) {
                                    return Promise.reject(rules.email.message)
                                }

                                return new Promise((resolve, reject) => {
                                    apiUser.get({ userEmail: value }).then(res => {
                                        if (res.length) {
                                            setIsExsit(true)
                                            reject('已经存在的电子邮箱')
                                        } else {
                                            setIsExsit(false)
                                            resolve()
                                        }
                                    })
                                })
                            },
                            config: { maxLength: 120, prefix: <MailOutlined /> }
                        },
                        [
                            { type: 'input', placeholder: '请输入验证码', prop: 'code', rule: { must: '请输入验证码' }, style: { width: 180, marginRight: 12 } },
                            {
                                type: 'button-primary', prop: 'sendCode', filter: () => isSend ? '验证码已发送' : '发送验证码', disabled({ data }) {
                                    return (isSend || isExsit || testEmail(data.userEmail))
                                }
                            },
                        ],
                        { type: 'input-password', prop: 'userPassword', placeholder: '请输入密码', rule: 'len6:', config: { maxLength: 28, prefix: <LockFilled /> } },
                        { render: () => <br /> },
                        [
                            { type: 'button-primary', value: '注册', prop: '$submit', config: { shape: 'round', loading: loading }, style: { width: 260 } },
                            { type: 'div', style: { display: 'flex', justifyContent: 'center' } }
                        ]
                    ]}
                />
            </div>
        }
    ]

    return (
        <div className="login">
            <Image
                width={200}
                style={{ display: 'none' }}
                preview={{
                    visible,
                    forceRender: false,
                    src: BookQrcode,
                    onVisibleChange: setVisible
                }}
            />
            <Dialog title='修改密码' name="modify" config={{ maskClosable: false }} width={680} />
            <div className="light-title" onClick={() => {
                history.push('/home')
            }}>
                Light2f
            </div>
            <Card hoverable bordered className={'login-form'}>
                <Tabs items={items} defaultActiveKey={type} />
            </Card>
        </div>
    )
}