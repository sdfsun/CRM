const login = r => require.ensure([], () => r(require('@/page/login/login.vue')), '登录页');
const home = r => require.ensure([], () => r(require('@/page/home/home.vue')), '主页');
const custom = r => require.ensure([], () => r(require('@/page/custom/custom.vue')), '客户列表页');
const designer = r => require.ensure([], () => r(require('../page/designer/designer')), '设计师列表');
const hours = r => require.ensure([], () => r(require('../page/designer/hours')), '工时上报');
const source = r => require.ensure([], () => r(require('@/page/customerSource/customerSource.vue')), '渠道来源');
const role = r => require.ensure([], () => r(require('@/page/role/role.vue')), '角色管理');
const user = r => require.ensure([], () => r(require('@/page/user/user.vue')), '用户管理');
const activity = r => require.ensure([], () => r(require('@/page/activity/activity.vue')), '活动管理');
const updatePasd = r => require.ensure([], () => r(require('@/page/updatePasd/updatePasd.vue')), '修改密码');
const report = r => require.ensure([], () => r(require('@/page/report/report.vue')), '报表管理');
const notFound = r => require.ensure([], () => r(require('@/page/notFound/notFound.vue')), '404页面');
const authority = r => require.ensure([], () => r(require('@/page/authority/authority.vue')), '菜单管理');
const orderSearch = r => require.ensure([], () => r(require('@/page/order/search.vue')), '产品下单');
const orderCheckout = r => require.ensure([], () => r(require('@/page/order/checkout.vue')), '结算页');


export default [
    {
        path: '/',
        component: login
    },
    {
        path: '/home',
        component: home,
        children:[
            {
                path: '/custom/:id',
                component: custom
            },
            {
                path:'/source',
                component: source
            },
            {
                path:'/role',
                component: role
            },
            {
                path:'/user',
                component: user
            },
            {
                path:'/activity',
                component: activity
            },
            {
                path: '/designer',
                component: designer
            },
            {
                path: '/hours',
                component: hours
            },
            {
                path: '/updatePasd',
                component: updatePasd
            },
            {
                path: '/report',
                component: report
            },
            {
                path: '/authority',
                component: authority
            },
            {
                path: '/search',
                component: orderSearch
            },
            {
                path: '/checkout',
                component: orderCheckout
            }

        ]
    },
    { 
        path: '*', 
        component: notFound
    }
]