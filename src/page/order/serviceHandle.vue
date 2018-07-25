<template>
    <div class="serviceHandle-container">
        <el-form ref="searchForm" labelWidth="100px" class="serviceHandle-form">
            <el-form-item prop='afterSaleOrderId' label="申请退换货：">
                <el-input placeholder="退货订单号" v-model="afterSaleOrderId" clearable @keyup.13.native='afterSaleChangeHandle'>
                    <el-button slot="append" @click='afterSaleChangeHandle'>申请退货</el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop='refundOrderId' label="申请退款：">
                <el-input placeholder="退款订单号" v-model="refundOrderId" clearable @keyup.13.native='refundChangeHandle'>
                    <el-button slot="append" @click='refundChangeHandle'>申请退款</el-button>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "serviceHandle",
        data(){
            return{
                afterSaleOrderId:'',//退换货订单号
                refundOrderId:'',//退款订单号
            }
        },
        methods:{
            afterSaleChangeHandle(){//申请退货
                if(!this.afterSaleOrderId){
                    this.$message({
                        showClose:true,
                        message: '退换货订单号不能为空',
                        type: 'error'
                    });
                    return false;
                }
                window.open("/aftersales-add-"+this.afterSaleOrderId+".html");
            },
            refundChangeHandle(){//申请退款
                if(!this.refundOrderId){
                    this.$message({
                        showClose:true,
                        message: '退款订单号不能为空',
                        type: 'error'
                    });
                    return false;
                }
                window.open("/refund-add-"+this.afterSaleOrderId+".html");
            }
        }
    }
</script>

<style scoped>
    .serviceHandle-container{
        height: 100%;
        overflow: hidden;
        padding-top: 100px;
        box-sizing: border-box;
    }
    .serviceHandle-form{
        width: 500px;
        margin: 0 auto;
    }
    .el-form-item{
        margin-bottom: 50px;
    }
</style>