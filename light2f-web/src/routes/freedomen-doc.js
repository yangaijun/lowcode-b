const routes = [
  {
    path: '/doc/freedomen/introduce',
    component: () => import('views/doc/freedomen/introduce')
  }, {
    path: '/doc/freedomen/curd',
    component: () => import('views/doc/freedomen/demo/curd'),
  }, {
    path: '/doc/freedomen/region',
    component: () => import('views/doc/freedomen/region'),
  }, {
    path: '/doc/freedomen/list',
    component: () => import('views/doc/freedomen/list'),
  }, {
    path: '/doc/freedomen/form',
    component: () => import('views/doc/freedomen/form'),
  }, {
    path: '/doc/freedomen/search',
    component: () => import('views/doc/freedomen/search'),
  }, {
    path: '/doc/freedomen/drawer',
    component: () => import('views/doc/freedomen/drawer')
  }, {
    path: '/doc/freedomen/dialog',
    component: () => import('views/doc/freedomen/dialog'),
  }, {
    path: '/doc/freedomen/table',
    component: () => import('views/doc/freedomen/table'),
  },
  //elements
  {
    path: '/doc/freedomen/autocomplete',
    component: () => import('views/doc/freedomen/elements/autocomplete'),
  },
  {
    path: '/doc/freedomen/divider',
    component: () => import('views/doc/freedomen/elements/divider')
  },
  {
    path: '/doc/freedomen/button',
    component: () => import('views/doc/freedomen/elements/button'),
  }, {
    path: '/doc/freedomen/cascader',
    component: () => import('views/doc/freedomen/elements/cascader'),
  }, {
    path: '/doc/freedomen/checkboxs',
    component: () => import('views/doc/freedomen/elements/checkboxs'),
  }, {
    path: '/doc/freedomen/counter',
    component: () => import('views/doc/freedomen/elements/counter'),
  }, {
    path: '/doc/freedomen/radios',
    component: () => import('views/doc/freedomen/elements/radios'),
  }, {
    path: '/doc/freedomen/mentions',
    component: () => import('views/doc/freedomen/elements/mentions'),
  }, {
    path: '/doc/freedomen/date',
    component: () => import('views/doc/freedomen/elements/date'),
  }, {
    path: '/doc/freedomen/daterange',
    component: () => import('views/doc/freedomen/elements/daterange'),
  }, {
    path: '/doc/freedomen/timepicker',
    component: () => import('views/doc/freedomen/elements/timepicker'),
  }, {
    path: '/doc/freedomen/timerange',
    component: () => import('views/doc/freedomen/elements/timerange'),
  }, {
    path: '/doc/freedomen/input',
    component: () => import('views/doc/freedomen/elements/input'),
  }, {
    path: '/doc/freedomen/select',
    component: () => import('views/doc/freedomen/elements/select'),
  }, {
    path: '/doc/freedomen/segmented',
    component: () => import('views/doc/freedomen/elements/segmented'),
  }, {
    path: '/doc/freedomen/steps',
    component: () => import('views/doc/freedomen/elements/steps'),
  }, {
    path: '/doc/freedomen/dropdown',
    component: () => import('views/doc/freedomen/elements/dropdown'),
  }, {
    path: '/doc/freedomen/rate',
    component: () => import('views/doc/freedomen/elements/rate'),
  }, {
    path: '/doc/freedomen/slider',
    component: () => import('views/doc/freedomen/elements/slider')
  }, {
    path: '/doc/freedomen/progress',
    component: () => import('views/doc/freedomen/elements/progress'),
  }, {
    path: '/doc/freedomen/switch',
    component: () => import('views/doc/freedomen/elements/switch'),
  }, {
    path: '/doc/freedomen/tag',
    component: () => import('views/doc/freedomen/elements/tag'),
  }, {
    path: '/doc/freedomen/tags',
    component: () => import('views/doc/freedomen/elements/tags'),
  }, {
    path: '/doc/freedomen/text',
    component: () => import('views/doc/freedomen/elements/text'),
  }, {
    path: '/doc/freedomen/tree',
    component: () => import('views/doc/freedomen/elements/tree'),
  }, {
    path: '/doc/freedomen/treeselect',
    component: () => import('views/doc/freedomen/elements/treeselect'),
  }, {
    path: '/doc/freedomen/alert',
    component: () => import('views/doc/freedomen/elements/alert'),
  }, {
    path: '/doc/freedomen/tags',
    component: () => import('views/doc/freedomen/elements/tags'),
  }, {
    path: '/doc/freedomen/upload',
    component: () => import('views/doc/freedomen/elements/upload'),
  }, {
    path: '/doc/freedomen/avatar',
    component: () => import('views/doc/freedomen/elements/avatar'),
  }, {
    path: '/doc/freedomen/img',
    component: () => import('views/doc/freedomen/elements/img'),
  }, {
    path: '/doc/freedomen/image',
    component: () => import('views/doc/freedomen/elements/image'),
  }, {
    path: '/doc/freedomen/affix',
    component: () => import('views/doc/freedomen/container/affix')
  }, {
    path: '/doc/freedomen/formitem',
    component: () => import('views/doc/freedomen/container/formitem'),
  }, {
    path: '/doc/freedomen/popconfirm',
    component: () => import('views/doc/freedomen/container/popconfirm'),
  }, {
    path: '/doc/freedomen/card',
    component: () => import('views/doc/freedomen/container/card'),
  }, {
    path: '/doc/freedomen/fragment',
    component: () => import('views/doc/freedomen/container/fragment')
  }, {
    path: '/doc/freedomen/col',
    component: () => import('views/doc/freedomen/container/col'),
  }, {
    path: '/doc/freedomen/spin',
    component: () => import('views/doc/freedomen/container/spin'),
  }, {
    path: '/doc/freedomen/inputgroup',
    component: () => import('views/doc/freedomen/container/inputgroup'),
  }, {
    path: '/doc/freedomen/row',
    component: () => import('views/doc/freedomen/container/row'),
  }, {
    path: '/doc/freedomen/space',
    component: () => import('views/doc/freedomen/container/space'),
  }, {
    path: '/doc/freedomen/tooltip',
    component: () => import('views/doc/freedomen/container/tooltip'),
  }, {
    path: '/doc/freedomen/div',
    component: () => import('views/doc/freedomen/container/div'),
  }, {
    path: '/doc/freedomen/exele',
    component: () => import('views/doc/freedomen/other/exele'),
  }, {
    path: '/doc/freedomen/gconfig',
    component: () => import('views/doc/freedomen/other/gconfig'),
  }, {
    path: '/doc/freedomen/eregister',
    component: () => import('views/doc/freedomen/other/eregister'),
  }, {
    path: '/doc/freedomen/types',
    component: () => import('views/doc/freedomen/other/types'),
  }
]

export default routes