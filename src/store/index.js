import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import order from './order/order';

Vue.use(Vuex);

const state = {
    memberRoleId:{},//当前登录账户的角色id
    customSource:[],//客户来源
    customStatus:[],//客户状态
    memberRoles:[],//角色等级
    activitys:[],//活动列表
    designers:[],//设计师列表
    qrcode:{},//微信绑定二维码弹框
    menus:[]//权限列表
};

export default new Vuex.Store({
    modules:{
        order:order
    },
    state,
    actions,
    mutations
});