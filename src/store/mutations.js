import * as types from './mutation-types.js';

export default {
    //设置客户资源
    [types.SETCUSTOMSOURCE](state,customSource){
        state.customSource = customSource;
    }
}