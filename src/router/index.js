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
const report = r => require.ensure([], () => r(require('@/page/report/report.vue')), 'CRM报表');
const storeMarket = r => require.ensure([], () => r(require('@/page/report/storeMarket.vue')), '门店销售报表');
const present = r => require.ensure([], () => r(require('@/page/present/present.vue')), '奖品管理');
const receive = r => require.ensure([], () => r(require('@/page/present/receive.vue')), '奖品领取管理');

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
                path: '/storeMarket',
                component: storeMarket
            },
            {
                path: '/present',
                component: present
            },
            {
                path: '/receive',
                component: receive
            }
        ]
    }
]