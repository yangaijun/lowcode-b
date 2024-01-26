import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Menu, Breadcrumb, Button, Spin, Modal } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { projectName } from 'systemConfig'
import { history, logout } from 'libs/util'
import './index.less'

const { Header, Sider, Footer, Content } = Layout
const getBreadcrumbList = (routes, pathname) => {
    for (let route of routes) {
        const breadcrumb = { title: route.label }

        if (route.path === pathname) {
            return [breadcrumb]
        } else if (route.routes && route.routes.length) {
            const _tempRoute = getBreadcrumbList(route.routes, pathname)
            if (_tempRoute.length) {
                return [
                    breadcrumb,
                    ..._tempRoute
                ]
            }
        }
    }
    return []
}

const getDefaultOpenKeys = (pathname = '') => {
    const keys = pathname.split('/')
    let defaultOpenKeys = []
    if (keys.length > 2) {
        let preKey = ''
        for (let i = 1; i < keys.length - 1; i++) {
            preKey += "/" + keys[i]
            defaultOpenKeys.push(preKey)
        }
    }
    return defaultOpenKeys
}

const getProjectName = (projectName = '', collapsed) => {
    if (projectName.length) {
        return collapsed ? projectName.charAt(0).toUpperCase() : projectName
    }
    return projectName
}

function Tags({ cacheRoutes, activity }) {
    return <div className='basic-tags'>
        {
            cacheRoutes.map((el, index) => {
                return <div key={index}>
                    {el.label}
                </div>
            })
        }
    </div>
}

export default function Basic(props) {
    const { routes, location: { pathname = '' } } = props
    const [collapsed, setCollapsed] = useState(false)
    const [activity, setActivity] = useState(pathname)
    const [breadcrumbList, setBreadcrumbList] = useState([])
    const { pageLoading } = useSelector(state => state.user)
    const [cacheRoutes, setCacheRoutes] = useState([])

    const defaultOpenKeys = useMemo(() => {
        return getDefaultOpenKeys(pathname)
    }, [pathname])

    useEffect(() => {
        setActivity(pathname)
        setBreadcrumbList(getBreadcrumbList(routes, pathname))
    }, [routes, pathname])

    useEffect(() => {
        if (pathname === '/') {
            history.replace('/login')
        }
    }, [pathname])

    const renderSubMenu = (routes) => {
        return routes.filter(route => !route.hidden)
            .map(route => {
                const newRoute = {
                    key: route.path,
                    icon: route.icon,
                    label: route.label
                }
                if (route.routes) {
                    newRoute.children = renderSubMenu(route.routes)
                } else {
                    newRoute.onClick = () => {
                       
                        if (!cacheRoutes.find(r => r.path === route.path)) {
                            const newRoutes = [...cacheRoutes]
                            newRoutes.push(route)
                            console.log(newRoutes)
                            setCacheRoutes(newRoutes)
                        }
                       
                        history.push(route.path)
                    }
                }
                return newRoute
            })
    }

    const menuItems = useMemo(() => renderSubMenu(routes), [routes])

    return (
        <Layout className="basic-layout">
            <Sider trigger={null} collapsible className="basic-sider" collapsed={collapsed}>
                <div className="basic-sider-logo" title={projectName}>
                    {getProjectName(projectName, collapsed)}
                </div>

                <Menu
                    mode="inline"
                    theme="dark"
                    defaultOpenKeys={defaultOpenKeys}
                    selectedKeys={[activity]}
                    items={menuItems}
                />
            </Sider>
            <Layout className="basic-center">
                <Header className="basic-header">
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'basic-header-collapsed',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <div className="basic-header-center">
                        <Button type="link" icon={<LogoutOutlined />} onClick={() => {
                            Modal.confirm({
                                content: '确定要退出当前用户并回到登录页面？',
                                onOk: logout
                            })
                        }}>
                            退出
                        </Button>
                    </div>
                </Header>
                <Tags cacheRoutes={cacheRoutes} activity={activity} />
                <Content className="basic-center-content">
                    <Spin spinning={pageLoading}>
                        <Breadcrumb className="basic-center-content-bread" items={breadcrumbList} />
                        <div className="basic-center-content-page">
                            {props.children}
                        </div>
                        <Footer style={{ textAlign: 'center' }}>
                            <a href="https://light2f.com" target="_blank">Freedomen ©2023 Created by Light</a>
                        </Footer>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    )
}