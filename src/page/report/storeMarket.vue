<template>
    <section class="report_container">
        <el-form ref="search_form" :model="searchForm" class='search_form'>
            <el-row :gutter="20">
                <el-col :span="7">
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
                <el-col :span="7">
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
                <el-col :span='3'>
                    <el-button type="primary"  @click='searchFormDatas'>查询</el-button>
                </el-col>
                <el-col :span='3'>
                    <el-button type="primary"  @click='incomeExcel'>导出</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="market-wrapper" v-for="(item,index) in reportLists">
            <h2 class="title">{{index}}</h2>
            <el-table
                ref='reportListsTable'
                :data="item"
                stripe
                show-summary
                class='tableInfo'
                header-row-class-name='header_row_style'
                @cell-click="cellClickHandle">
                <el-table-column
                    prop="name"
                    label="店员名称"
                    min-width='100px'
                    class-name='cell_0_label cell_1'>
                </el-table-column>
                <el-table-column
                    prop="gonghao"
                    label="工号"
                    min-width='80px'
                    class-name='cell_0_label cell_1 cell_noSum_label'>
                </el-table-column>
                <el-table-column label='订单统计' class-name='cell_2 cell_all'>
                    <el-table-column
                        prop='order_num'
                        label="单数"
                        min-width='120px'
                        class-name='cell_2'>
                    </el-table-column>
                    <el-table-column
                        prop='final_amount'
                        label="总金额"
                        min-width='120px'
                        class-name='cell_2'>
                    </el-table-column>
                </el-table-column>
                <el-table-column label='退款统计' class-name='cell_3 cell_all'>
                    <el-table-column
                        prop='refund_num'
                        label="单数"
                        min-width='120px'
                        class-name='cell_3'>
                    </el-table-column>
                    <el-table-column
                        prop='amount'
                        label="总金额"
                        min-width='120px'
                        class-name='cell_3'>
                    </el-table-column>
                </el-table-column>
                <el-table-column label='退货统计' class-name='cell_4 cell_all'>
                    <el-table-column
                        prop='after_num'
                        label="单数"
                        min-width='120px'
                        class-name='cell_4'>
                    </el-table-column>
                    <el-table-column
                        prop='after_amount'
                        label="总金额"
                        min-width='120px'
                        class-name='cell_4'>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <!--订单明细 收款明细弹框-->
        <el-dialog title="明细" :visible.sync="orderInfoDialogVisible" class='orderInfoDialog'>
            <h2 class="title">订单明细</h2>
            <el-table
                ref='reportListsTable'
                :data="currentRow.order"
                stripe
                show-summary
                class='customListsTableInfo'
                header-row-class-name='header_row_style'>
                <el-table-column
                    prop="order_id"
                    label="订单号"
                    min-width='120px'>
                </el-table-column>
                <el-table-column
                    prop="final_amount"
                    label="商品总金额"
                    min-width='120px'>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    min-width='120px'
                    class-name="cell_noSum_label">
                </el-table-column>
                <el-table-column
                    prop="pay_time"
                    label="支付时间"
                    min-width='120px'>
                </el-table-column>
            </el-table>
            <h2 class="title">收款明细</h2>
            <el-table
                ref='reportListsTable'
                :data="currentRow.receivables"
                stripe
                show-summary
                class='customListsTableInfo'
                header-row-class-name='header_row_style'>
                <el-table-column
                    prop="receivables_id"
                    label="收款单号"
                    min-width='120px'>
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="收款金额"
                    min-width='120px'>
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    min-width='120px'
                    class-name="cell_noSum_label">
                </el-table-column>
                <el-table-column
                    prop="times"
                    label="收款时间"
                    min-width='120px'>
                </el-table-column>
            </el-table>
        </el-dialog>
    </section>
</template>
<script>
    import {order_counts} from '@/service/getData';
    export default{
        name:'storeMarket',
        data(){
            return{
                reportLists:[],
                searchForm: {
                    start_time:'',
                    end_time:''
                },
                searchBtnStatus:false,
                orderInfoDialogVisible:false,
                currentRow:{}
            }
        },
        mounted(){
            this.searchForm.start_time = this.getCurrentMonthFirstDay();
            this.searchFormDatas();
        },
        methods:{
            getCurrentMonthFirstDay(){//获取当前月份第一天
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                month = month < 10 ? "0"+month : month;
                return year + "-" + month + "-"+ '01' + " "+ "00:00:00";
            },
            async searchFormDatas(){//表单搜索
                if(this.searchBtnStatus){
                    return false;
                }
                this.searchBtnStatus = true;
                try {
                    let that = this;
                    const res = await order_counts(this.searchForm);
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
                    this.reportLists = res.success;
                    this.searchBtnStatus = false;
                } catch(e) {
                    this.searchBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async incomeExcel(){//导出excel
                window.location.href='/crm-order_logExport.html?start_time='+this.searchForm.start_time+'&end_time='+this.searchForm.end_time;
            },
            cellClickHandle(row, column, cell, event){//单元格点击
                if(column.property === 'final_amount'){//订单总金额
                    this.orderInfoDialogVisible = true;
                    this.currentRow = row;
                }
            }
        }
    }
</script>
<style scoped>
    .report_container{
        height: 100%;
        background: #fff;
    }
    .report_container .search_form{
        padding: 20px 30px 0;
    }
    .report_container .el-table{
        text-align: right;
    }
    .title{
        font-size: 16px;
        padding-left: 30px;
        color: #1a1a1a;
        font-weight: normal;
        text-align: left;
        line-height: 30px;
    }
    .market-wrapper{
        margin-bottom: 20px;
    }
    .el-date-editor.el-input,.el-button{
        width: 100%;
    }
    .report_container .orderInfoDialog .el-table{
        text-align: center;
    }
    .report_container .el-table th{
        text-align: center !important;
    }
</style>