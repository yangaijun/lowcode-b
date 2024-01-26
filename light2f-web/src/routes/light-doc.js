const routes = [
    {
        path: '/doc/light/introduce',
        component: () => import('views/doc/light/introduce')
    }, {
        path: '/doc/light/project',
        component: () => import('views/doc/light/project')
    }, {
        path: '/doc/light/code',
        component: () => import('views/doc/light/code')
    }, {
        path: '/doc/light/masterplate-page',
        component: () => import('views/doc/light/masterplatePage')
    }, {
        path: '/doc/light/masterplate-project',
        component: () => import('views/doc/light/masterplateProject')
    }, {
        path: '/doc/light/component',
        component: () => import('views/doc/light/component')
    }, {
        path: '/doc/light/model',
        component: () => import('views/doc/light/model')
    }, {
        path: '/doc/light/permission',
        component: () => import('views/doc/light/permission')
    },{
        path: '/doc/light/page',
        component: () => import('views/doc/light/page')
    }, {
        path: '/doc/light/fapi',
        component: () => import('views/doc/light/fapi')
    }, {
        path: '/doc/light/api',
        component: () => import('views/doc/light/api')
    }, {
        path: '/doc/light/tool',
        component: () => import('views/doc/light/tool')
    }, {
        path: '/doc/light/c/region',
        component: () => import('views/doc/light/components/region')
    }, {
        path: '/doc/light/c/search',
        component: () => import('views/doc/light/components/search')
    }, {
        path: '/doc/light/c/form',
        component: () => import('views/doc/light/components/form')
    }, {
        path: '/doc/light/c/formlist',
        component: () => import('views/doc/light/components/formlist')
    }, {
        path: '/doc/light/c/table',
        component: () => import('views/doc/light/components/table')
    }, {
        path: '/doc/light/c/list',
        component: () => import('views/doc/light/components/list')
    }, {
        path: '/doc/light/c/dialog',
        component: () => import('views/doc/light/components/dialog')
    }, {
        path: '/doc/light/c/drawer',
        component: () => import('views/doc/light/components/drawer')
    }
]

export default routes 