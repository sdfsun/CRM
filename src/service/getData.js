import axios from '../axios/index';

//登录
export const ajax_login = (login_account,login_password) => axios.post('/crm-ajax_login.html',{
    login_account,
    login_password
});

// 获取客户列表
export const getCustomLists = (key,page,formData) => axios.post('/crm-customer_index-'+key+'-'+page+'.html',formData);

// 获取客户基本信息
export const customer_detail = (information_id) => axios.post('/crm-customer_detail.html',{
    information_id
});

//获取客户的沟通记录
export const communicate = (information_id) => axios.post('/crm-communicate.html',{
    information_id
});

//获取客户的测量记录
export const measures = (information_id) => axios.post('/crm-measure.html',{
    information_id
});

//获取客户的收款记录
export const receivableItems = (information_id) => axios.post('/crm-receivables.html',{
    information_id
});

//获取客户的方案记录
export const programmes = (information_id) => axios.post('/crm-programme.html',{
    information_id
});

//获取客户的具体方案明细
export const programme_detail = (id) => axios.post('/crm-programme_detail.html',{
    id
});

//获取客户的交易记录
export const transactions = (information_id) => axios.post('/crm-transaction.html',{
    information_id
});

//获取客户的投诉记录
export const complaints = (information_id) => axios.post('/crm-complaint.html',{
    information_id
});

//保存客户基本信息
export const customer_save = (formData) => axios.post('/crm-customer_save.html',formData);

//保存沟通记录
export const communicate_save = (formData) => axios.post('/crm-communicate_save.html',formData);

//保存测量记录
export const measure_save = (formData) => axios.post('/crm-measure_save.html',formData);

//保存收款记录
export const receivables_save = (formData) => axios.post('/crm-receivables_save.html',formData);

//保存方案明细
export const programme_save = (formData) => axios.post('/crm-programme_save.html',formData);

//方案定案
export const confirm_scheme = (id,final) => axios.post('/crm-confirm_scheme.html',{
    id,
    final
});

//保存交易记录
export const transaction_save = (formData) => axios.post('/crm-transaction_save.html',formData);

//保存投诉记录
export const complaint_save = (formData) => axios.post('/crm-complaint_save.html',formData);

//获取渠道来源记录
export const source_index = () => axios.post('/crm-source_index.html');

//保存渠道来源记录
export const source_save = (formData) => axios.post('/crm-source_save.html',formData);

//获取角色记录
export const member_role = () => axios.post('/crm-member_role.html');

//保存角色记录
export const add_role = (formData) => axios.post('/crm-add_role.html',formData);

//获取用户记录
export const member = () => axios.post('/crm-member.html');

//保存用户记录
export const member_save = (formData) => axios.post('/crm-member_save.html',formData);

//用户修改密码
export const password = (formData) => axios.post('/crm-password.html',formData);

// 获取设计师列表
export const getDesignerLists = () => axios.post('/crm-designer_list.html');

// 初始化设计师日程
export const getVisitInit = () => axios.post('/crm-visit.html');

// 记录设计师可上门日期
export const postVisitSave = (formData) => axios.post('/crm-visit_save.html',formData);

// 所有日程
export const getAllPlan = (formData) => axios.post('/crm-schedules.html',formData);

//获取可分配设计师列表
export const stylist = (information_id,assign_times) => axios.post('/crm-stylist.html',{
    information_id,
    assign_times
});

//分配设计师并发送微信通知
export const assign = (formData) => axios.post('/crm-assign.html',formData);

//用户退出
export const unset_member = (showLoad) => axios.post('/crm-unset_member.html',showLoad);

// 获取活动列表
export const activitys = () => axios.post('/crm-activity.html');

//活动保存
export const activity_save = (formData) => axios.post('/crm-activity_save.html',formData);

// 保持session
export const store_vain = () => axios.post('/crm-store_vain.html', {
    showLoad: '3'
});

//报表
export const incomeSearch = (formData) => axios.post('/crm-incomeSearch.html',formData);

//获取菜单列表
export const menus = () => axios.post('/crm-menus.html');

//新增菜单或编辑菜单
export const add_menus = (formData) => axios.post('/crm-add_menus.html',formData);

//为角色配置权限
export const role_access = (formData) => axios.post('/crm-role_access.html',formData);