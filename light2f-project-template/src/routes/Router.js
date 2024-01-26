import React, { Suspense, useMemo } from 'react';
import { Redirect, Router as ReactRouter } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { Spin as Loading } from 'antd';
import { useSelector } from 'react-redux';
import history from 'libs/history';
import routes from 'routes';
//不在权限控制中的路径
const defaultLoadPaths = ["/login", "/"]

const getLoadRoutes = (routes = [], paths) => {
    const loadRoutes = []
    for (let route of routes) {
        const newRoute = { ...route }
        if (route.routes?.length) {
            let newRoutes = getLoadRoutes(route.routes, paths)

            if (newRoutes.length) {
                newRoute.routes = newRoutes
                loadRoutes.push(newRoute)
            }
        } else if (!route.path || paths.includes(route.path)) {
            loadRoutes.push(newRoute)
        }
    }
    return loadRoutes
}

const Routes = props => {
    return (
        <CacheSwitch>
            {props.routes?.map(({ component: Component, ...route }, index) => {
                return (
                    <CacheRoute
                        path={route.path}
                        key={index}
                        {...route}
                        render={routeProps => {
                            if (route.redirect) {
                                return <Redirect to={route.redirect} />;
                            }

                            return (
                                <Suspense fallback={<Loading />}>
                                    <Component {...route} {...routeProps} >
                                        <Routes routes={route.routes} />
                                    </Component>
                                </Suspense>
                            );
                        }}
                    />
                );
            })}
        </CacheSwitch>
    );
};

const Router = () => {
    const { userMenuPaths } = useSelector(state => state.user)
    const loadRoutes = useMemo(() => {
        if (userMenuPaths) {
            return getLoadRoutes(routes, [...defaultLoadPaths, ...userMenuPaths])
        }
        return routes
    }, [routes, userMenuPaths])

    return <ReactRouter history={history}>
        <Routes routes={loadRoutes} />
    </ReactRouter>
}

export default React.memo(Router);