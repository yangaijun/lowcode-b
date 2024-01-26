const routes = [
    {
        label: '首页',
        path: '/home',
        component:() => import('views/home')
    }, {
        label: '会员管理',
        path: '/HotelVip',
        component:() => import('views/HotelVip')
    }, {
        label: '房间类型管理',
        path: '/HotelRoomType',
        component:() => import('views/HotelRoomType')
    }, {
        label: '房间管理',
        path: '/HotelRoom',
        component:() => import('views/HotelRoom')
    }, {
        label: '预约订单管理',
        path: '/HotelPrebook',
        component:() => import('views/HotelPrebook')
    }, {
        label: '订单管理',
        path: '/HotelOrder',
        component:() => import('views/HotelOrder')
    },
]
export default routes