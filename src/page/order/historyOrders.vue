<template>
    <div class="historyOrdersDialog historyOrders-container">
        <el-form ref="searchForm" :model="searchForm" class='searchForm'>
            <el-row :gutter="20">
                <el-col :span='5'>
                    <el-form-item prop='gonghao'>
                        <el-input placeholder="请输入接待人名称" v-model="searchForm.gonghao" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='start_time'>
                        <el-date-picker
                                v-model="searchForm.start_time"
                                type="datetime"
                                placeholder="起始时间"
                                value-format='yyyy-MM-dd HH:mm:ss'
                                clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='end_time'>
                        <el-date-picker
                                v-model="searchForm.end_time"
                                type="datetime"
                                placeholder="结束时间"
                                value-format='yyyy-MM-dd HH:mm:ss'
                                clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                    <el-form-item prop='mobile'>
                        <el-input placeholder="请输入客户联系方式" v-model="searchForm.mobile" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='3'>
                    <el-button type="primary"  @click='searchFormDatas'>查询</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-collapse accordion>
            <el-collapse-item name="1">
                <template slot="title">
                    <div class="header-left">
                        <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                        <span class="txt">订单编号：D10011295</span>
                        <span class="txt">接待人</span>
                        <span class="txt">2018-06-02 14:52</span>
                        <span class="txt">客户名</span>
                        <span class="txt">123 1212 1234</span>
                        <span class="txt">福建省/泉州市/惠安县</span>
                        <span class="txt">当前账户余额</span>
                        <span class="txt">已支付</span>
                        <span class="txt">未支付</span>
                    </div>
                    <div class="header-right">
                        <!--<span class="txt money-item">实付金额：￥<strong>1200.00</strong></span>-->
                        <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                    </div>
                </template>
                <el-tabs type="border-card" class='el_tabs_footer' >
                    <el-tab-pane label="商品清单">
                        <el-table
                            :data="temp"
                            stripe
                            highlight-current-row
                            class='checkoutTableInfo'
                            header-row-class-name='header_row_style'>
                            <el-table-column
                                type="index"
                                :index="1"
                                label='序号'
                                width='80'>
                            </el-table-column>
                            <el-table-column
                                prop="space"
                                label="空间"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop="bn"
                                label="产品型号"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop="product_name"
                                label="产品名称"
                                min-width='120px'>
                            </el-table-column>
                            <el-table-column
                                prop="is_custom"
                                label="是否定制"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop='orderDRemark'
                                label="定制需求"
                                min-width='130px'>
                            </el-table-column>
                            <el-table-column
                                prop='send_time'
                                label="交期"
                                min-width='110px'>
                            </el-table-column>
                            <el-table-column
                                prop='canal'
                                label="配送方式"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop='fileStr'
                                label="附件"
                                min-width='100px'>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.fileStr !== ''">查看附件</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop='price'
                                label="单价"
                                min-width='110px'>
                            </el-table-column>
                            <el-table-column
                                prop='num'
                                label="数量"
                                min-width='100px'>
                            </el-table-column>
                            <el-table-column
                                prop='sum'
                                label="小计"
                                min-width='120px'>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="订单信息">
                        <ul class="orderInfo">
                            <li>
                                <p class="txt"><span class="t0">创建人工号：</span><span class="t1">12345</span></p>
                                <p class="txt"><span class="t0">下单时间：</span><span class="t1">2018/06/01  13:44:06</span></p>
                                <p class="txt"><span class="t0">订单编号：</span><span class="t1">145234541223360122</span></p>
                                <p class="txt"><span class="t0">仓库交货时间：</span><span class="t1">2018/06/10</span></p>
                                <p class="txt"><span class="t0">付款方式：</span><span class="t1">微信支付</span></p>
                                <p class="txt"><span class="t0">订单备注：</span><span class="t1">客户备注客户备注客户备注客户备注客户备注客户备注客户备注客户备注客户备注客户备注客户</span></p>
                            </li>
                            <li>
                                <p class="txt"><span class="t0">姓名：</span><span class="t1">李文文</span></p>
                                <p class="txt"><span class="t0">联系方式：</span><span class="t1">123 1234 1234</span></p>
                                <p class="txt"><span class="t0">收货地区：</span><span class="t1">新疆维吾尔族自治区  克孜勒苏克尔克孜自治州  阿图什市</span></p>
                                <p class="txt"><span class="t0">详细地址：</span><span class="t1">详细地址详细地址详细地址.....</span></p>
                                <p class="txt"><span class="t0">特殊需求：</span><span class="t1">特殊需求特殊需求特殊需求特殊需求特殊需求特殊需求特殊需求特殊需求特殊特殊需求特殊特殊需求</span></p>
                            </li>
                            <li class="item3">
                                <p class="txt"><span class="t0">商品总金额：</span><span class="t1">￥1290.00</span></p>
                                <p class="txt"><span class="t0">运费：</span><span class="t1">￥20.00</span></p>
                                <p class="txt"><span class="t0">优惠金额：</span><span class="t1">￥200.00</span></p>
                                <p class="txt"><span class="t0">收款抵扣金额：</span><span class="t1">￥150.00</span></p>
                                <p class="txt"><span class="t0">订单支付金额：</span><span class="t1">￥1290.00</span></p>
                                <p class="txt"><span class="t0">入SAP的总优惠金额：</span><span class="t1">￥350.00</span></p>
                                <p class="txt"><span class="t0">入SAP的最终价格：</span><span class="t1">￥1090.00</span></p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="订单进度">
                        <ul class="orderInfo orderProgress">
                            <li>
                                <p class="txt"><span class="t0">2018-06-01  13:44</span><span class="t1">订单创建成功</span></p>
                                <p class="txt"><span class="t0">2018-06-02  09:23</span><span class="t1">订单已经备货</span></p>
                                <p class="txt">
                                    <span class="t0">2018-06-02  09:23</span>
                                    <span class="t1">订单全部商品发货完成，物流单号：
                                        <span style="color: #1876EF;">中通快递123456789123121</span>
                                        <a href="javascript:void(0);" @click="showProgressInfo">（可点击跟踪物流信息）</a>
                                    </span>
                                </p>
                                <p class="txt"><span class="t0">2018-06-02  09:23</span><span class="t1">订单完成</span></p>
                            </li>
                        </ul>
                    </el-tab-pane>
                </el-tabs>

            </el-collapse-item>
        </el-collapse>
        <el-dialog title="物流信息" :visible.sync="progressDialogVisible" >
            <el-steps direction="vertical" :active="1" >
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title='2018-06-01 13:44:00' description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>
        </el-dialog>
    </div>
</template>
<script>
    import {order_detail} from '@/service/getData';
    export  default {
        name:'historyOrders',
        data(){
            return{
                temp:[],
                searchForm:{
                    gonghao:'',
                    start_time:'',
                    end_time:'',
                    mobile:''
                },
                progressDialogVisible:false//物流信息进度弹框
            }
        },
        methods:{
            async searchFormDatas(){//搜索历史订单数据
                try {
                    const that = this;
                    const res = await order_detail();
                    if(res.error){
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        if(res.nologin === 1){//未登录
                            setTimeout(()=>{
                                that.$router.push('/');
                            },3000);
                        }
                        return false;
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            showProgressInfo(){//查询订单物流进度
                this.progressDialogVisible = true;
            }
        }
    }
</script>
<style scoped>
    .searchForm{
        padding: 20px 30px 0;
    }
    .el-date-editor.el-input,.el-button{
        width: 100%;
    }
    .el-table{
        height: 100%;
    }
    .orderInfo{
        overflow: hidden;
        font-size: 12px;
        line-height: 22px;
        color: #919191;
        padding: 11px 15px;
    }
    .orderInfo li{
        float: left;
        list-style-type: none;
        width: 38%;
        margin-right: 2%;
    }
    .orderInfo .item3{
        width: 20%;
        margin-right: 0;
    }
    .orderInfo .txt{
        display: flex;
    }
    .orderInfo .t0{
        width: 84px;
        text-align: right;
    }
    .orderInfo .item3 .t0{
        width: 120px;
    }
    .orderInfo .t1{
        color: #4D4D4D;
        flex: 1;
    }
    .orderProgress li{
        width: 100%;
    }
    .orderProgress .t0{
        width: 100px;
        text-align: center;
        margin-right: 13px;
    }
    .orderProgress a{
        text-decoration: none;
        color: #4D4D4D;
    }
</style>