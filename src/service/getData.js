import axios from '../axios/index';

// 获取产品关键词
export const get_product_keys = () => axios.post('/store/wap_cashier/keywords/');