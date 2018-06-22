//订单模块
import mutations from './mutations';
import actions from './actions';

export default {
    state:{
        goods:[],//结算页商品清单
        method:'',//配送方式
        totalMoney:0,//合计金额
        discount:0,//门店优惠金额
        payMoney:0,//实付金额
        freight:0,//运费
        orderid:'',//订单号
        cumtomFormData:{
            acceptOrdMan:'',//收货人
            acceptOrdPhone:'',//收货人手机号
            area:[],//收货地区
            addr:'',//收货地址
            sendProDate:'',//仓库完成时间
            contractCode:'',//合同编码
            custReRemark:'',//客户特殊要求
            orderRemarks:'',//订单备注
            liftSel:false,//是否有电梯
            fileUrls:false,//表头附件
            information_id:'',//crm客户id
            sum_money:0,//用户可用余额
            last_discount:0,//用户可用折扣
            uFinPay:0,//用户欠款金额
        },
        checkoutSwitch:0,//结算页开关 0为显示第一页 1位显示第二页
        checkoutDetailInfo:{}//结算页第二页明细
    },
    mutations:mutations,
    actions:actions
}