const login = r => require.ensure([], () => r(require('@/page/login/login.vue')), '登录页');
const home = r => require.ensure([], () => r(require('@/page/home/home.vue')), '主页');
const custom = r => require.ensure([], () => r(require('@/page/custom/custom.vue')), '客户列表页');
const designer = r => require.ensure([], () => r(require('@/page/designer/designer')), '设计师列表');
const designerHours = r => require.ensure([], () => r(require('@/page/designer/children/hours')), '工时上报');
const source = r => require.ensure([], () => r(require('@/page/customerSource/customerSource.vue')), '渠道来源');
const role = r => require.ensure([], () => r(require('@/page/role/role.vue')), '角色管理');
const user = r => require.ensure([], () => r(require('@/page/user/user.vue')), '用户管理');

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
            }
        ]
    },
    {
        path: '/designer',
        component: designer,
        children:[
            {
                path: '/designerHours',
                component: designerHours
            }
        ]
    }
]
