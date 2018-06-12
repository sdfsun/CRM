import { setStore,getStore} from '@/utils/'

export default{
    setMemberRoleId({commit},name){//设置当前登录的用户id
        const memberRoleId = JSON.parse(getStore(name));
        commit('SETMEMBERROLEID',memberRoleId);
    },
    setCustomSource({commit},name){//设置客户来源
        const customSources = JSON.parse(getStore(name));
        commit('SETCUSTOMSOURCE',customSources);
    },
    updateCustomSource({state,commit},result){//更新客户来源
        let customSources = [];
        if(state.customSource && state.customSource.length>0){
            customSources = state.customSource.slice();
            const index = state.customSource.findIndex(function(item, index, arr) {
                return item.id === result.id;
            });
            if(index !== -1){//编辑
                customSources[index] = result;
            }else{//新增
                customSources.push(result);
            }
        }else{
            customSources.push(result);
        }
        setStore("customSource",customSources);
        commit('SETCUSTOMSOURCE',customSources);
    },
    setMemberRoles({commit},name){//设置用户等级
        const memberRoles = JSON.parse(getStore(name));
        commit('SETMEMBERROLES',memberRoles);
    },
    updateMemberRoles({state,commit},result){//更新用户等级
        let memberRoles = [];
        if(state.memberRoles && state.memberRoles.length>0){
            memberRoles = state.memberRoles.slice();
            const index = state.memberRoles.findIndex(function(item, index, arr) {
                return item.member_role_id === result.member_role_id;
            });
            if(index !== -1){//编辑
                memberRoles[index] = result;
            }else{//新增
                memberRoles.push(result);
            }
        }else{
            memberRoles.push(result);
        }
        setStore("memberRoles",memberRoles);
        commit('SETMEMBERROLES',memberRoles);
    },
    setActivitys({commit},name){//设置活动列表
        const lists = JSON.parse(getStore(name));
        commit('SETACTIVITYS',lists);
    },
    updateActivitys({state,commit},result){//更新活动列表
        let activitys = [];
        if(state.activitys && state.activitys.length>0){
            activitys = state.activitys.slice();
            const index = state.activitys.findIndex(function(item, index, arr) {
                return item.id === result.id;
            });
            if(index !== -1){//编辑
                activitys[index] = result;
            }else{//新增
                activitys.push(result);
            }
        }else{
            activitys.push(result);
        }
        setStore("activitys",activitys);
        commit('SETACTIVITYS',activitys);
    },
    setDesigners({commit},name){//设置设计师列表
        const lists = JSON.parse(getStore(name));
        commit('SETDESIGNERS',lists);
    },
    updateDesigners({state,commit},result){//更新设计师列表
        let tempLists=[];
        if(state.designers && state.designers.length>0){
            tempLists = state.designers.slice();
            const index = tempLists.findIndex(function(item, index, arr) {
                return item.id === result.id;
            });
            if(index !== -1){//编辑
                tempLists[index] = result;
            }else{//新增
                tempLists.push(result);
            }
        }else{
            tempLists.push(result);
        }
        setStore("designers",tempLists);
        commit('SETDESIGNERS',tempLists);
    },
    setMenus({commit},name){//设置菜单权限列表
        const lists = JSON.parse(getStore(name));
        commit('SETMENUS',lists);
    }
}