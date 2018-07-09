import * as types from './mutation-types.js';

export default {
    [types.ADDCARTGOODS](state,res){//添加购物车产品
        state.goods.push(res);
    },
    [types.DELETEGOOD](state,index){//删除购物车产品
        state.goods.splice(index, 1);
    },
    [types.UPDATEGOODDATA](state,res){//更新购物车产品相关数据，数量，价格，产品名称，空间，定制需求，配送方式等
        state.goods[res.index] = res.goodData;
    },
    [types.UPDATEORDERMONEY](state,res){//更新购物车应付金额，实付金额，运费
        const tempMoney = res.totalMoney;
        if(state.goods && state.goods.length>0){
            if(res.selectedZitiMethod){//购物车产品全都为自提
                state.freight = 0;
            }else{
                state.freight = tempMoney > 200 ? 0 : 12;
            }
            state.totalMoney = Number(tempMoney) + Number(state.freight);
            let tempPayMoney = Number(Number(state.totalMoney)-Number(state.discount)).toFixed(2);
            state.payMoney = tempPayMoney < 0 ? 0 : tempPayMoney;
        }else{
            state.freight = 0;
            state.totalMoney = 0;
            state.payMoney = 0;
        }
    },
    [types.UPDATEDISCOUNT](state,val){//更新门店优惠金额，实付金额
        let tempPayMoney = Number(Number(state.totalMoney)-Number(val)).toFixed(2);
        state.discount = val;
        state.payMoney = tempPayMoney < 0 ? 0 : tempPayMoney;
    },
    [types.SETORDERMETHOD](state,method){//添加购物车产品设置配送方式
        state.method = method;
    },
    [types.RESETGOODMETHOD](state){//重置产品的配送方式
        const method = state.method;
        state.goods.forEach(item => {
             if(method === 'wuliu' && item.canal === 'kuaidi'){
                 item.canal = 'wuliu';
             }
             if(method === 'kuaidi' && item.canal === 'wuliu'){
                item.canal = 'kuaidi';
             }
        });
    },
    [types.UPDATECUSTOMINFO](state,data){//更新crm客户信息 姓名，电话，地址，地区，用户可用余额，用户可抵扣金额，用户欠款金额，用户id
        state.cumtomFormData.addr = data.addr;
        if(!data.area){
            state.cumtomFormData.area = [];
        }else{
            state.cumtomFormData.area = data.area.split(" ");
        }
        state.cumtomFormData.information_id = data.id;
        state.cumtomFormData.acceptOrdPhone = data.mobile;
        state.cumtomFormData.acceptOrdMan = data.name;
        state.cumtomFormData.sum_money = data.sum_money;
        state.cumtomFormData.last_discount = data.last_discount;
        state.cumtomFormData.uFinPay = data.uFinPay;
        state.cumtomFormData.searchPhone = data.mobile;
        // state.status = data.status;
        // state.status_name = data.status_name;
        // state.tel = data.tel;
    },
    [types.UPDATECHECKOUTDETAILINFO](state,data){//更新结算页第二页数据
        state.checkoutSwitch = 1;
        state.checkoutDetailInfo = data;
        if(data.invoice){//发票
            state.invoice = data.invoice;
        }else{
            state.invoice = {};
        }
        state.orderid = data.transaction_id;
    },
    [types.RESETCHECKOUTDATA](state,type){//重置结算页数据
        if(type === 'logoutCustom' && state.orderid || !type){//没有生成订单号时 退出客户登录信息时不需要清除以下数据
            state.goods = [];//结算页商品清单
            state.method = '';//配送方式
            state.totalMoney = 0;//合计金额
            state.discount = 0;//门店优惠金额
            state.payMoney = 0;//实付金额
            state.freight = 0;//运费
            state.buyInstallFlag = false;//是否可购买安装服务
            state.checkoutSwitch = 0;//结算页开关 0为显示第一页 1位显示第二页
            state.checkoutDetailInfo = {};//结算页第二页明细
            state.orderid = '';//订单号
        }
        state.cumtomFormData ={
            acceptOrdMan:'',//收货人
            acceptOrdPhone:'',//收货人手机号
            area:[],//收货地区
            addr:'',//收货地址
            searchPhone:'',//搜索手机号是否为CRM账户或商城账户
            sendProDate:'',//仓库完成时间
            contractCode:'',//合同编码
            custReRemark:'',//客户特殊要求
            orderRemarks:'',//订单备注
            liftSel:false,//是否有电梯
            fileUrls:'',//表头附件
            information_id:'',//crm客户id
            sum_money:0,//用户可用余额
            last_discount:0,//用户可用折扣
            uFinPay:0,//用户欠款金额
        };
        state.member_id = '';//商城用户id
        state.invoice = {
            tax_company:'',//发票抬头
            tax_content:'',//发票内容
            tax_type:'',//发票类型
            tax_no:'',//纳税人识别号
            invoice_file:'',//电子发票文件
            vat_invoice:'false',//是否开增值税发票
            invoice_mark:''//发票备注
        }
    },
    [types.SETMEMBERID](state,data) {//设置商城用户member_id
        state.member_id = data;
    },
    [types.SETBUYINSTALLFLAG](state,data) {//设置是否可购买安装服务
        state.buyInstallFlag = data;
    },
    [types.ADDSERVICES](state,data) {//添加安装服务，重置购物车
        state.goods = data;
    },
    [types.UPDATECHECKOUTSWITCH](state,data) {//更新结算页切换按钮
        state.checkoutSwitch = data;
    },
    [types.UPDATEINVOICEDATA](state,data) {//更新结算页发票数据
        state.invoice = Object.assign({},data);
    },
    [types.EXTRACTORDERSETDATA](state,data) {//提取订单更新结算页数据 能提取订单的都是未推送的订单
        state.goods = data.goods;//结算页商品清单
        state.method = data.shipping === 'true' ? 'wuliu' : 'kuaidi';//配送方式
        state.totalMoney = data.totalMoney;//合计金额
        state.discount = data.discount;//门店优惠金额
        state.payMoney = data.payMoney;//实付金额
        state.freight = data.freight;//运费
        state.orderid = data.orderid;//订单号
        state.cumtomFormData = data.cumtomFormData;//crm用户相关信息
        state.cumtomFormData.area = data.cumtomFormData.area.split(" ");//地区
        state.cumtomFormData.sum_money = data.cumtomFormData.payment_money;//用户订单提取后可用余额
        state.cumtomFormData.last_discount = data.cumtomFormData.payment_discount;//用户订单提取后可用折扣
        state.cumtomFormData.uFinPay = data.cumtomFormData.payment_uFinPay;//用户订单提取后欠款金额
        state.cumtomFormData.liftSel = data.cumtomFormData.liftSel == 'true' ? true : false;//是否有电梯
        state.buyInstallFlag = data.product_install;//是否可购买安装服务
        state.member_id = data.member_id;//商城用户id
        state.checkoutSwitch = 0;//结算页开关 0为显示第一页 1位显示第二页
        state.checkoutDetailInfo = {};//结算页第二页明细
        if(data.invoice){//发票
            state.invoice = data.invoice;
        }else{
            state.invoice = {
                tax_company:'',//发票抬头
                tax_content:'',//发票内容
                tax_type:'',//发票类型
                tax_no:'',//纳税人识别号
                invoice_file:'',//电子发票文件
                vat_invoice:'false',//是否开增值税发票
                invoice_mark:''//发票备注
            };
        }
    }

}