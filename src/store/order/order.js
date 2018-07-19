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
        cumtomFormData:{//存储CRM用户相关信息
            acceptOrdMan:'',//收货人c
            acceptOrdPhone:'',//收货人手机号
            area:[],//收货地区
            addr:'',//收货地址
            searchPhone:'',//用来搜索是否为CRM账户或商城账户
            sendProDate:'',//仓库完成时间
            contractCode:'',//合同编码
            custReRemark:'',//客户特殊要求
            orderRemarks:'',//订单备注
            liftSel:false,//是否有电梯
            fileUrls:'',//表头附件
            information_id:'',//crm客户id
            sum_money:0,//用户可用余额
            last_discount:0,//用户可用折扣
            uFinPay:0//用户欠款金额
        },
        buyInstallFlag:false,//是否可购买安装服务
        member_id:'',//商城用户id
        checkoutSwitch:0,//结算页开关 0为显示第一页 1位显示第二页
        checkoutDetailInfo:{},//结算页第二页明细
        invoice:{
            tax_company:'',//发票抬头
            tax_content:'',//发票内容
            tax_type:'',//发票类型
            tax_no:'',//纳税人识别号
            invoice_file:'',//电子发票文件
            vat_invoice:'false',//是否开增值税发票
            invoice_mark:''//发票备注
        },
        isStandFlag:false//设置是否有定制单
    },
    mutations:mutations,
    actions:actions
}