import React from 'react';
import freedomenDocRoutes from './freedomen-doc'
import lightDocRoutes from './light-doc'
import videoDocRoutes from './video-doc'


const routes = [
  // 用于测试， 上线要删除掉
  {
    path: '/test',
    component: () => import('views/user/test')
  },
  {
    path: '/light',
    component: () => import('components/Layout/Light'),
    routes: [
      {
        path: '/light/in',
        component: () => import('views/in')
      },
      {
        path: '/light/design',
        component: () => import('views/light/index'),
      },
    ]
  },
  //项目预览
  {
    path: '/preview',
    component: () => import('views/project/preview'),
    name: 'preview'
  },
  {
    path: '/plug/code-view',
    component: () => import('views/lib/public/plug/codeView')
  },
  //has header
  {
    path: '/',
    component: () => import('components/Layout/Home'),
    routes: [
      {
        path: '/doc',
        component: () => import('components/Layout/Blank'),
        routes: [
          {
            path: '/doc/introduce',
            component: () => import('views/doc')
          },
          {
            path: '/doc/light',
            component: () => import('components/Layout/Doc/Light'),
            routes: lightDocRoutes
          },
          {
            path: '/doc/freedomen',
            component: () => import('components/Layout/Doc/Freedomen'),
            routes: freedomenDocRoutes
          },
          {
            path: '/doc/video',
            component: () => import('components/Layout/Doc/Video'),
            routes: videoDocRoutes
          }
        ]
      },
      {
        path: '/',
        component: () => import('components/Layout/Main'),
        routes: [
          //admin 功能
          {
            path: '/propDoc',
            component: () => import('views/admin/propDoc')
          },
          {
            path: '/home',
            component: () => import('views/index')
          }, {
            path: '/project',
            component: () => import('views/project'),
          }, {
            path: '/help',
            component: () => import('views/help'),
          }, {
            path: '/example',
            component: () => import('views/example')
          }, {
            path: '/lib',
            component: () => import('views/lib')
          }, {
            path: '/plate-project/detail',
            component: () => import('views/lib/public/masterplate/project/detail')
          }, {
            path: '/plug/detail',
            component: () => import('views/lib/public/plug/detail')
          }, {
            path: '/plug/create',
            component: () => import('views/lib/public/plug/create')
          }, {
            path: '/plug/doc',
            component: () => import('views/lib/public/plug/doc')
          }, {
            path: '/private',
            component: () => import('views/private')
          }, {
            path: '/log',
            component: () => import('views/log')
          }, {
            path: '/issue/list',
            component: () => import('views/issue')
          }, {
            path: '/issue/detail',
            component: () => import('views/issue/detail')
          },
          //user
          {
            path: '/user/setting',
            component: () => import('views/user/setting'),
          },
          {
            path: '/user/notice',
            component: () => import('views/user/notice'),
          },
          {
            path: '/user/info',
            component: () => import('views/user/info'),
          },
        ]
      }
    ]
  }
]
function addLazyComponent(routes = []) {
  routes.forEach(route => {
    route.component = React.lazy(route.component);
    if (route.routes) {
      addLazyComponent(route.routes);
    }
  });
}
addLazyComponent(routes);

export default routes;