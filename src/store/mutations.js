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
    }
}