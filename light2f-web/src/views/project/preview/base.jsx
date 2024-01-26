import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Layout, Menu, Breadcrumb, Button, Spin } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import ApiPage from 'services/page'
import { useDispatch, useSelector } from 'react-redux';
import { setPageInfo } from 'slices/pageSlice';
import Preview from 'views/light/components/center/preview';
import { addParamsKeyPrefix, dataListToDesignList, getPageMenuOption, getPageRouteIdPathMap, getPageRouteMap, getSplitParams, pagesHasPath } from 'views/light/utils/util';
import history from 'libs/history';
import { getRouterPath, replaceOrAddQuery } from 'libs/utils';
import Bus, { BUS_KEYS } from 'views/light/bus';
import './base.less'

const { SubMenu } = Menu
const { Header, Sider, Footer, Content } = Layout

const getBreadcrumbList = (routes, pageFileName) => {
    for (let route of routes) {
        const breadcrumb = { title: route.pageName }

        if (route.pageFileName === pageFileName) {
            return [breadcrumb]
        } else if (route.children && route.children.length) {
            const _tempRoute = getBreadcrumbList(route.children, pageFileName)
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

export default function PreviewBase({ project, onLogout, routerState }) {
    const { projectId, projectName } = project
    const [active, setActive] = useState()
    const [breadcrumbList, setBreadcrumbList] = useState([])
    const [collapsed, setCollapsed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [menuLoading, setMenuLoading] = useState(false)
    const [designList, setDesignList] = useState([])
    const [routes, setRoutes] = useState([])
    const [pageRouteMap, setPageRouteMap] = useState()
    const { userPreviewProjectMenuPaths } = useSelector(state => state.page)
    const blockRef = useRef()
    const loadingRef = useRef()

    const dispatch = useDispatch()

    const defaultOpenKeys = useMemo(() => {
        if (!routerState.active) return []

        return getDefaultOpenKeys(routerState.active)
    }, [routerState.active])

    const loadPage = useCallback(async (page) => {
        //防止多次调用
        if (page.pageId === blockRef.current || loadingRef.current) return

        setLoading(true)
        loadingRef.current = true
        blockRef.current = page.pageId
        //防止接口数据大，list 中的 pageDataList太大，要单独查呢 
        const spage = await ApiPage.selectOne({ pageId: page.pageId })
        history.replace(replaceOrAddQuery({ active: page.pageRouter }))
        setActive(page.pageRouter)
        setBreadcrumbList(getBreadcrumbList(routes, page.pageFileName))
        await dispatch(setPageInfo({ pageId: page.pageId }))
        if (spage.pageDataList) {
            setDesignList(dataListToDesignList(JSON.parse(spage.pageDataList)))
        } else {
            setDesignList([])
        }
        loadingRef.current = false
        setLoading(false)
    }, [routes])

    const loadByPath = useCallback((path) => {
        const page = pageRouteMap[path]
        page && loadPage(page)
    }, [pageRouteMap, loadPage])

    useEffect(() => {
        setMenuLoading(true)

        ApiPage.selectNested({ projectId }).then(res => {
            setRoutes(res)

            const routeMap = getPageRouteMap(res)
            setPageRouteMap(routeMap)

            const pageRouteIdPathMap = getPageRouteIdPathMap(routeMap)
            Bus.set(BUS_KEYS.routeIdPath, pageRouteIdPathMap)

            Bus.set(BUS_KEYS.pageMenuOptions, getPageMenuOption(res, pageRouteIdPathMap))

            setMenuLoading(false)
        })
    }, [projectId, project])

    const hasMenu = useCallback((page) => {
        const pagePathMap = Bus.get(BUS_KEYS.routeIdPath) || {}

        if (userPreviewProjectMenuPaths) {
            return pagesHasPath([page], pagePathMap, userPreviewProjectMenuPaths)
        }
        return true
    }, [userPreviewProjectMenuPaths])

    useEffect(() => {
        const { active } = routerState

        if (active && pageRouteMap) {
            setActive(active)
            loadByPath(active)
        }
    }, [routerState.active, loadByPath, pageRouteMap])

    const renderSubMenu = useCallback((routes, prePath = '/') => {
        return <> {
            routes.map(route => {
                if (!hasMenu(route)) return null
                const path = prePath + route.pageRouter

                if (Array.isArray(route.children) && route.children.length) {
                    return <SubMenu
                        key={path}
                        icon={route.icon}
                        title={route.pageName}
                    >
                        {renderSubMenu(route.children, path + '/')}
                    </SubMenu>
                } else if (route.pageHidden !== 2) {
                    return <Menu.Item
                        key={path}
                        icon={route.icon}
                        style={{ color: 'white' }}
                        onClick={_ => {
                            const { vir, web } = getSplitParams(routerState)
                            if (Object.keys(vir).length) {
                                history.push(getRouterPath(web))
                            }
                            loadPage({ ...route, pageRouter: path })
                        }}>
                        {route.pageName}
                    </Menu.Item>
                } else {
                    return null
                }
            })
        } </>
    }, [routes, hasMenu])

    return (
        <Layout className="basic-layout">
            <Sider trigger={null} collapsible className="basic-sider" collapsed={collapsed}>
                <div className="basic-sider-logo" title={projectName}>
                    {getProjectName(projectName, collapsed)}
                </div>
                <Spin spinning={menuLoading || loading}>
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[active]}
                        defaultOpenKeys={defaultOpenKeys}
                    >
                        {renderSubMenu(routes)}
                    </Menu>
                </Spin>
            </Sider>
            <Layout className="basic-center">
                <Header className="basic-header">
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'basic-header-collapsed',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <div className="basic-header-center">
                        <Button type="link" icon={<LogoutOutlined />} onClick={onLogout}>
                            退出
                        </Button>
                    </div>
                </Header>
                <Content className="basic-center-content">
                    <Breadcrumb className="basic-center-content-bread" items={breadcrumbList} />

                    <div className="basic-center-content-page">
                        {
                            active ? <Spin spinning={loading}>
                                <Preview designList={designList} historyKey="projectpv" historyPush={(path, params) => {
                                    const state = { ...params }
                                    history.replace(
                                        replaceOrAddQuery({ ...routerState, active: path, ...addParamsKeyPrefix(state) }, true)
                                    )
                                }} />
                            </Spin> : <div className='basic-center-content-tip'> 请选择想要预览的页面 </div>
                        }
                    </div>
                    <Footer style={{ textAlign: 'center' }}>Freedomen ©2023 Created by Freedom men</Footer>
                </Content>
            </Layout>
        </Layout>
    )
}