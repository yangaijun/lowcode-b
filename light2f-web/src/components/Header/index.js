import { useState, useEffect, useMemo, useCallback } from 'react'
import { Menu, Button, Modal, Image, Badge } from "antd";
import { Region } from 'freedomen'
import user, { UserType } from 'libs/user'
import { getUserAvatar, toExample, toFreedomenDoc, toIssueList, toLib, toProject } from 'libs/utils';
import BookQrcode from 'imgs/book_qrcode.jpg'
import ApiNotice from 'services/notice'
import Logo from 'imgs/logo.png'
import './index.less'
import { useSelector } from 'react-redux';

export default function Index(props) {
    const { location: { pathname }, push } = props.history
    const [current, setCurrent] = useState(null)
    const { userInfo } = useSelector(state => state.temporary)
    const [visible, setVisible] = useState(false)
    const [noticeCount, setNoticeCount] = useState(0)
    const { userAvatar = user.getUserAvatar(), userName = user.getUserName(), roleType = user.getRoleType() } = userInfo

    useEffect(() => {
        roleType === UserType.User && ApiNotice.getBadgeCount().then(res => {
            setNoticeCount(res)
        })
    }, [roleType])

    useEffect(() => {
        if (pathname === '/project') {
            setCurrent('project')
        } else if (pathname.includes('doc/freedomen')) {
            setCurrent('doc/freedomen')
        } else if (pathname.includes('doc/light')) {
            setCurrent('doc/light')
        } else if (pathname.includes('doc/video')) {
            setCurrent('doc/video')
        } else if (pathname.includes('example')) {
            setCurrent('example')
        } else if (pathname.includes('help')) {
            setCurrent('help')
        } else if (pathname.includes('log')) {
            setCurrent('log')
        } else if (pathname.includes('issue/')) {
            setCurrent('issue')
        } else if (pathname.includes('/lib') || pathname.includes('plug/') || pathname.includes('plate-project/')) {
            setCurrent('lib')
        } else {
            setCurrent('')
        }
    }, [pathname])



    const menuItems = useMemo(() => {
        return [
            {
                key: 'SubMenu',
                label: '文档',
                children: [
                    // {
                    //     key: 'doc/introduce',
                    //     label: '介绍',
                    //     onClick() {
                    //         push('/doc/introduce')
                    //     }
                    // },
                    // {
                    //     key: 'doc/video',
                    //     label: '视频教程（Video）',
                    //     onClick() {
                    //         push('/doc/video/basic')
                    //     }
                    // },
                    {
                        key: 'doc/light',
                        label: '设计器文档（Light）',
                        onClick() {
                            push('/doc/light/introduce')
                        }
                    },
                    {
                        key: 'doc/freedomen',
                        label: '代码文档（Freedomen）',
                        onClick: toFreedomenDoc
                    },
                ]
            },
            {
                key: 'example',
                label: '开发示例',
                onClick: toExample
            },
            {
                key: 'project',
                label: '我的项目',
                onClick: toProject
            },
            {
                key: 'lib',
                label: '库',
                onClick: toLib
            },
            {
                key: 'issue',
                label: 'Issues',
                onClick: toIssueList
            },
            {
                key: 'log',
                label: <Badge dot offset={[5, 0]}>更新日志</Badge>,
                onClick() {
                    push('/log')
                }
            },
        ]
    }, [])

    const getNoticeBadge = useCallback((children, offset) => {
        return <Badge size='small' count={noticeCount ? noticeCount : null} offset={offset}>{children}</Badge>
    }, [noticeCount])

    return <div className="gheader">
        <div className="gheader-left">
            <img
                src={Logo}
                alt='logo'
                className="logo"
                onClick={_ => {
                    push('/home')
                }}
            />
        </div>
        <div className="gheader-menu">
            <Menu mode="horizontal" selectedKeys={[current]} items={menuItems} />
        </div>
        <div className={'gheader-right'}>
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
            <Region
                onEvent={({ prop, value }) => {
                    if (prop === 'login') {
                        push('/light/in?type=login')
                    } else if (prop === 'gitee') {
                        window.open('https://gitee.com/MiLuBianFu/light-single', '_blank')
                    } else if (prop === 'book') {
                        setVisible(true)
                    } else if (prop === 'register') {
                        push('/light/in?type=register')
                    } else if (prop === 'user') {
                        if (value === '退出') {
                            Modal.confirm({
                                content: '确定退出当前账号？',
                                onOk() {
                                    user.logout()
                                    setTimeout(() => {
                                        push('/home')
                                        window.location.reload()
                                    }, 30);
                                }
                            })
                        } else if (value === '通知') {
                            setNoticeCount(0)
                            push('/user/notice')
                        } else if (value === '设置') {
                            push('/user/setting')
                        } else if (value === '个人资料') {
                            push('/user/info')
                        }
                    }
                }}
                columns={[ 
                    {
                        type: 'dropdown', 
                        options: [
                            { label: <a href='https://gitee.com/MiLuBianFu/lowcode-b' target='_blank'>gitee</a>, value: "gitee" }, 
                            { label: <a href='https://github.com/yangaijun/lowcode-b' target='_blank'>github</a>, value: "github" }
                        ], 
                        config: {
                            content: <Button type="text">开源地址</Button> 
                        }
                    },
                    { type: 'button-text', value: '订阅号', prop: 'book' }, 
                    [
                        { type: 'button-text', value: '登录', prop: 'login' },
                        { type: 'divider', config: { type: 'vertical' } },
                        { type: 'button-text', value: '注册', prop: 'register' },
                        { type: 'div', load: () => roleType !== UserType.User }
                    ],
                    {
                        type: 'dropdown',
                        prop: 'user',
                        options: [
                            { label: "个人资料", value: "个人资料" },
                            {
                                label: getNoticeBadge("通知", [12, 0]),
                                value: "通知"
                            },
                            { label: "退出", value: "退出" }
                        ],
                        load: () => roleType === UserType.User,
                        config: {
                            content: getNoticeBadge(<Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={getUserAvatar(userAvatar)} className="user-avatar" />
                                {userName}
                            </Button>)
                        }
                    }
                ]}
            />
        </div>
    </div>
}