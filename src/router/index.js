const login = r => require.ensure([], () => r(require('../page/login/login.vue')), '登录页');
const home = r => require.ensure([], () => r(require('../page/home/home.vue')), '主页');
const custom = r => require.ensure([], () => r(require('../page/custom/custom.vue')), '客户列表页');
const designer = r => require.ensure([], () => r(require('../page/designer/designer')), '设计师列表');
const hours = r => require.ensure([], () => r(require('../page/designer/hours')), '工时上报');

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
                path: '/designer',
                component: designer
            },
            {
                path: '/hours',
                component: hours
            }
        ]
    }
]