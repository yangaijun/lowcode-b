const routes = [
    {
        path: '/doc/video/basic',
        component: () => import('views/doc/video/basic')
    }, {
        path: '/doc/video/example',
        component: () => import('views/doc/video/example')
    }
]

export default routes 