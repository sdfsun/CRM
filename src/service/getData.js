import axios from '../axios/index';

//登录
export const ajax_login = (login_account,login_password) => axios.post('/crm-ajax_login.html',{
    login_account,
    login_password
});

// 获取客户列表
export const getCustomLists = (key,page) => axios.post('/crm-customer_index-'+key+'-'+page+'.html');
