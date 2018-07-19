<template>
    <div class="transaction_container">
        <el-table
            :data="transactionRecords"
            stripe
            highlight-current-row
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange">
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100px'>
            </el-table-column>
            <el-table-column
                prop="saleName"
                label="接待人"
                min-width='140px'>
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="交易时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="payMoney"
                label="交易金额"
                min-width='120px'>
            </el-table-column>
            <el-table-column
                prop="uFinPay"
                label="欠款"
                min-width='140px'>
            </el-table-column>
            <el-table-column
                prop="orderid"
                label="CRM订单号"
                min-width='140px'>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                min-width='140px'>
                <template slot-scope="scope">
                    <span>{{scope.row.status === 'active' ? '未推送' : scope.row.status === 'finish' ? '已推送' : '作废'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_custom"
                label="是否定制单"
                min-width='140px'>
                <template slot-scope="scope">
                    <span>{{scope.row.is_custom === 'true' ? '是' : '否'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="交易清单"
                min-width='100px'>
                <template slot-scope="scope">
                    <el-tooltip placement="top" popper-class="transaction-tooltip" effect="light">
                        <div slot="content">
                            <el-table
                                :data="scope.row.goods"
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
                                    min-width='120px'
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="is_custom"
                                    label="是否定制"
                                    min-width='80px'>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.is_custom == 'true' ? '是' : '否'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop='orderDRemark'
                                    label="定制需求"
                                    min-width='120px'
                                    show-overflow-tooltip>
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
                                    <template slot-scope="scope">
                                        <span>{{scope.row.canal == 'wuliu' ? '物流' : scope.row.canal == 'kuaidi' ? '快递' : '自提'}}</span>
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
                        </div>
                        <el-button class="proDetail-btn">商品清单</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addTransactionRecord'>新建订单记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editTransactionRecord'>订单操作</el-button>
        </div>
    </div>
</template>
<script>
    import {post_login} from '@/service/getData';
    import {mapMutations,mapState} from 'vuex';

    export default{
        name:'transaction',
        props:['transactionRecords','infomation'],
        data(){
            return{
                currentrow:null
            }
        },
        computed: {
            ...mapState({
                cumtomFormData: state => state.order.cumtomFormData
            })
        },
        methods:{
            ...mapMutations([
                'UPDATECUSTOMINFO',
                'RESETCHECKOUTDATA'
            ]),
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            async loginCustomInfo(type){//结算页登录crm账户
                try {
                    let formData = {};
                    const that = this;
                    formData.information_id = this.infomation.id;
                    formData.mobile = this.infomation.mobile ? this.infomation.mobile : this.infomation.tel;
                    const res = await post_login(formData);
                    if(res.error){
                        this.$message({
                            showClose:true,
                            message: res.error,
                            type: 'error'
                        });
                        if(res.nologin == 1){//未登录
                            setTimeout(()=>{
                                that.$router.push('/');
                            },3000);
                        }
                        return false;
                    }
                    if(res.success.information && res.success.information.length == 1) {//一个账户
                        //赋值
                        if(type){//清除结算页数据
                            this.RESETCHECKOUTDATA();
                        }
                        this.UPDATECUSTOMINFO(res.success.information[0]);
                        this.$router.push('/search');
                    }
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            addTransactionRecord(){//新增交易记录
                const that = this;
                //先登录CRM客户信息
                if(this.cumtomFormData.searchPhone){//登录账户了
                    this.$confirm('是否登录当前CRM账户并清除结算页数据？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.loginCustomInfo('1');
                    }).catch((e) => {
                        if(e == 'cancel'){
                            return false;
                        }
                        that.$message({
                            message: e.message,
                            type: 'error'
                        });
                    });
                }else{
                   this.loginCustomInfo();
                }
            },
            editTransactionRecord(){//编辑交易记录
                try {
                    if(!this.currentrow){
                        this.$message({
                            showClose:true,
                            message:'请先选中需要编辑的交易记录！',
                            type:'error'
                        });
                        return false;
                    }
                    const orderid = this.currentrow.orderid;
                    if(!orderid){
                        this.$message({
                            showClose:true,
                            message:'订单号有误！',
                            type:'error'
                        });
                        return false;
                    }
                    this.$router.push({
                        path:'/historyOrders',
                        query: {
                            order_id: orderid
                        }
                    });
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .transaction_container{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .btns{
        text-align: right;
        padding: 16px 40px 16px 0;
    }
    .image_item_icon{
        position: absolute;
        right: 15px;
        bottom: 24px;
        color: #fff;
    }
    .image_carousel_item{
        width: 100%;
    }
    .proDetail-btn{
        padding: 0;
        border: none;
    }
</style>