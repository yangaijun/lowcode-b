import React from 'react';
import modules from './modules'

const routes = [
  {
    path: '/login',
    component: () => import('views/Login')
  }, {
    path: '/',
    component: () => import('Layouts/Basic'),
    routes: [
      ...modules,
      { component: () => import('views/NotFound') }
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