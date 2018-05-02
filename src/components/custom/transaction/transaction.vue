<template>
    <div class="transaction_container">
        <el-table
            :data="transactionRecords"
            stripe
            highlight-current-row
            style="width: 100%;text-align: center;flex:1;"
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange">
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100px'
                >
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="接待人"
                min-width='140px'
                >
            </el-table-column>
            <el-table-column
                prop="times"
                label="交易时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="money"
                label="交易金额"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="order_id"
                label="交易订单号"
                min-width='140px'
                >
            </el-table-column>
            <el-table-column
                prop="detail"
                label="交易清单"
                min-width='200px'
                >
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addTransactionRecord'>新建订单记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editTransactionRecord'>编辑</el-button>
        </div>
        <el-dialog title="订单记录" :visible.sync="transactionDialogVisible" class='customRelationInfoDialog' @close='resetTransactionEdit'>
            <transactionEdit :informationItem='infomation' :editInfos='editActiveRow' ref='transactionEdit'  v-on:closeCustomTransactionInfoDialog='updateTransactionRecord'></transactionEdit>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import transactionEdit from '@/components/custom/transaction/transactionEdit';

    export default{
        name:'transaction',
        props:['transactionRecords','infomation'],
        data(){
            return{
                transactionDialogVisible:false,
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addTransactionRecord(){//新增交易记录
                this.editActiveRow = {};
                this.editActiveRow.status = this.infomation.status;
                this.transactionDialogVisible = true;
            },
            editTransactionRecord(){//编辑交易记录
                if(!this.currentrow){
                    this.$message({
                        message:'请先选中需要编辑的交易记录！',
                        type:'error'
                    });
                    return false;
                }
                this.editActiveRow = Object.assign({},this.currentrow);
                this.editActiveRow.status = this.infomation.status;
                this.transactionDialogVisible = true;
            },
            updateTransactionRecord(callbackData){
                this.transactionDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:5});
                }
            },
            resetTransactionEdit(){//重置表单数据
                this.editActiveRow = {};
                // this.images =[];
                this.$refs['transactionEdit'].$refs['transactionForm'].resetFields();
            }
        },
        components:{
            transactionEdit
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
        padding: 26px 40px 25px 0;
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
</style>