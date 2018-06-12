import * as types from './mutation-types.js';

export default {
    //设置当前登录账户id
    [types.SETMEMBERROLEID](state,memberRoleId){
        state.memberRoleId = memberRoleId;
    },
    //设置客户资源
    [types.SETCUSTOMSOURCE](state,customSource){
        state.customSource = customSource;
    },
    //设置用户等级
    [types.SETMEMBERROLES](state,memberRoles){
        state.memberRoles = memberRoles;
    },
    //设置活动列表
    [types.SETACTIVITYS](state,activitys){
        state.activitys = activitys;
    },
    //设置设计师
    [types.SETDESIGNERS](state,data){
        state.designers = data;
    },
    //设置微信二维码
    [types.SETQRCODE](state,data){
        state.qrcode = data;
    },
    //设置菜单权限
    [types.SETMENUS](state,data){
        state.menus = data;
    }
}