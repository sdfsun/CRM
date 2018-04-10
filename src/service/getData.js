import axios from '../axios/index';

// 获取客户列表
export const getCustomLists = (key,page) => axios.post('/crm-customer_index-'+key+'-'+page+'.html');
