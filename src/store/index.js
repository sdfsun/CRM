import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';

Vue.use(Vuex);

const state = {
    memberRoleId:'',//当前登录账户的角色id
    customSource:[],//客户来源
    customStatus:[
        {val:'0',label:'未联系'},
        {val:'1',label:'需再联系'},
        // {val:'2',label:'已联系'},
        {val:'3',label:'已拒绝'},
        {val:'4',label:'等待量尺'},
        {val:'5',label:'制作方案'},
        {val:'6',label:'确认方案'},
        {val:'7',label:'已交订金/等待复尺'},
        // {val:'8',label:'等待复尺'},
        {val:'9',label:'已复尺'},
        {val:'10',label:'终稿方案确认'},
        {val:'11',label:'签合同（交尾款）'},
        {val:'12',label:'已下单'},
        {val:'13',label:'已送货'},
        {val:'14',label:'已安装'},
        {val:'15',label:'安装异常1'},
        {val:'16',label:'安装异常2'},
        {val:'17',label:'安装异常3'},
        {val:'18',label:'安装异常4'},
        {val:'19',label:'安装异常5'},
        {val:'20',label:'已结案'}
    ],
    memberRoles:[],//角色等级
    activitys:[],//活动列表
    designers:[],//设计师列表
};

export default new Vuex.Store({
    state,
    actions,
    mutations
});