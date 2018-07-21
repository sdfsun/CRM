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
    id,
    showLoad:'3'
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

//搜索产品页 获取历史记录和定制单数据
export const goods_custom = () => axios.post('/crm-goods_custom.html',{
    showLoad: '3'
});

//搜索产品
export const search_goods = (bval) => axios.post('/crm-search_goods.html',{
    bval
});

//获取多规格数据
export const add_new = (goods_id,product_id) => axios.post('/crm-add_new.html',{
    goods_id,
    product_id
});

//下单
export const pre_order = (formData) => axios.post('/crm-pre_order.html',formData);

//根据手机号判断是否为crm客户
export const post_login = (formData) => axios.post('/crm-post_login.html',formData);

//门店销售报表
export const order_counts = (formData) => axios.post('/crm-order_counts.html',formData);

//获取奖品列表
export const prize_index = () => axios.post('/crm-prize_index.html');

//奖品保存
export const prize_save = (formData) => axios.post('/crm-prize_save.html',formData);

//奖品领取记录
export const prize_log = (formData) => axios.post('/crm-prize_log.html',formData);

//奖品发放
export const prize_grant = (formData) => axios.post('/crm-prize_grant.html',formData);

//获取安装服务
export const service = (formData) => axios.post('/crm-service.html',formData);

//推送订单
export const push_order = (transaction_id) => axios.post('/crm-push_order.html',{
    transaction_id
});

//历史订单
export const order_detail = (page,num,formData) => axios.post('/crm-order_detail-'+page+'-'+num+'.html',formData);

//非CRM用户支付订单
export const ajax_pay = (formData) => axios.post('/crm-ajax_pay.html',formData);

//查询支付订单是否完成
export const query_new = (formData) => axios.post('/crm-query_new.html',formData);

//微信、支付宝支付重新调用（防止图片过期）
export const pay_new = (payment_id,payment) => axios.post('/crm-pay_new.html',{
    payment_id,
    payment,
    showLoad:'3'
});

//订单作废
export const order_dead = (transaction_id) => axios.post('/crm-order_dead.html',{
    transaction_id
});

//订单补款
export const order_supplement = (transaction_id) => axios.post('/crm-order_supplement.html',{
    transaction_id
});

//订单审批
export const order_arrears = (transaction_id) => axios.post('/crm-order_arrears.html',{
    transaction_id
});

//查询物流进度
export const order_logistic = (logistic_no) => axios.post('/crm-order_logistic.html',{
    logistic_no
});

//客户状态管理
export const state_index = () => axios.post('/crm-state_index.html');

//保存客户状态
export const state_save = (formData) => axios.post('/crm-state_save.html',formData);

//特殊指派
export const special_assign = (formData) => axios.post('/crm-special_assign.html',formData);

//删除客户信息
export const delete_information = (information_id) => axios.post('/crm-delete_information.html',{
    information_id
});

//新增或编辑客户信息时 校验电话或手机号是否已存在当前CRM客户中
export const check_mobile = (mobile) => axios.post('/crm-check_mobile.html',{
    mobile,
    showLoad:'3'
});

//推送订单驳回
export const order_reject = (formData) => axios.post('/crm-order_reject.html',formData);