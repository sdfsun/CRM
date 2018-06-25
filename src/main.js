// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import ElementUI from 'element-ui'
import routes from './router'
import store from './store/'
import 'normalize.css/normalize.css'
import '../theme/index.css'
import './assets/css/index.css'
import './assets/css/designer.css'
import {store_vain} from '@/service/getData/';

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)

//自定义指令
Vue.directive('focus', function (el) {
    el.querySelector('input').focus()
})

const router = new VueRouter({
    routes
});

// 路由权限验证
router.beforeEach((to, from, next) => {
    if (to.path === '/'){
        next();
    }else{
        let memberRoleId = JSON.parse(localStorage.getItem('memberRoleId'));
        if(memberRoleId && memberRoleId.member_role_id){//已登录
            next();
        }else{//未登录
            next({ path: '/' });
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

//设置当前登录账户id
store.dispatch('setMemberRoleId','memberRoleId');
//设置客户资源
store.dispatch('setCustomSource','customSource');
//设置用户等级
store.dispatch('setMemberRoles','memberRoles');
//设置活动列表
store.dispatch('setActivitys','activitys');
//设置设计师列表
store.dispatch('setDesigners','designers');
//设置菜单权限列表
store.dispatch('setMenus','menus');

// 隔5分钟调用一次 保持session
setInterval(function(){
    store_vain();
},300000);

