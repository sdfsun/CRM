<template>
    <div class="historyOrdersDialog historyOrders-container">
        <div class="searchForm">
            <el-row :gutter="10">
                <el-col :span='7'>
                    <!--<el-form-item prop='content'>-->
                        <!--<el-input placeholder="请输入内容" v-model="searchForm.content" class="input-with-select" clearable @keyup.13.native='searchFormDatas'>-->
                            <!--<el-button slot="append" icon="el-icon-search" @click='searchFormDatas'></el-button>-->
                        <!--</el-input>-->
                    <!--</el-form-item>-->
                </el-col>
            </el-row>
        </div>
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
            </el-collapse-item>
            <el-collapse-item name="2">
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
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    export  default {
        name:'historyOrders',
        data(){
            return{
                temp:[],
                searchForm:{

                }
            }
        }
    }
</script>