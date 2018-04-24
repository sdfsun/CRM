<template>
    <div class="receivables_container">
        <el-table
            :data="receivablesRecords"
            stripe
            highlight-current-row
            style="width: 100%;text-align: center;flex:1;overflow: auto;"
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange"
            @cell-click='cellClickHandle'>
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                >
            </el-table-column>
            <el-table-column
                prop="receivables_id"
                label="编号"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="收款人"
                >
            </el-table-column>
            <el-table-column
                prop="times"
                label="收款时间"
                width='160'>
            </el-table-column>
            <el-table-column
                prop="voucher"
                label="收款凭证号"
                width='160'>
            </el-table-column>
            <el-table-column
                prop="money"
                label="收款金额">
            </el-table-column>
            <el-table-column
                prop="discount"
                label="抵扣金额"
                >
            </el-table-column>
            <el-table-column
                prop="remarks"
                label="收款备注">
            </el-table-column>
            <el-table-column
                label="发票图片">
                <template slot-scope='scope' v-if='scope.row.image_id'>
                    <img :src="scope.row.l_image" width="100%" height="87" />
                </template>
            </el-table-column>
            <el-table-column
                prop="is_retainage_name"
                label="是否尾款">
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addreceivablesRecord'>新建收款记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editreceivablesRecord'>编辑</el-button>
        </div>
        <el-dialog title="收款记录" :visible.sync="receivablesDialogVisible" class='customRelationInfoDialog' @close='resetreceivablesEdit'>
            <receivablesEdit :informationItem='infomation' :editInfos='editActiveRow' ref='receivablesEdit'  v-on:closeCustomReceivablesInfoDialog='updatereceivablesRecord'></receivablesEdit>
        </el-dialog>
        <el-dialog title="发票图片" :visible.sync="receivablesImageDialogVisible">
            <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item>
                    <img :src="image_url" class="image_carousel_item">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import receivablesEdit from '@/components/custom/receivables/receivablesEdit';

    export default{
        name:'receivables',
        props:['receivablesRecords','infomation'],
        data(){
            return{
                receivablesDialogVisible:false,
                receivablesImageDialogVisible:false,
                image_url:'',
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addreceivablesRecord(){//新增收款记录
                this.editActiveRow = {};
                this.editActiveRow.status = this.infomation.status;
                this.receivablesDialogVisible = true;
            },
            editreceivablesRecord(){//编辑收款记录
                if(!this.currentrow){
                    this.$message({
                        message:'请先选中需要编辑的收款记录！',
                        type:'error'
                    });
                    return false;
                }
                this.editActiveRow = Object.assign({},this.currentrow);
                this.editActiveRow.status = this.infomation.status;
                if(this.editActiveRow.image_id !== ''){
                    Object.assign(this.editActiveRow,{imageLists:[{url:this.currentrow.l_image}]});
                }
                this.receivablesDialogVisible = true;
            },
            updatereceivablesRecord(callbackData){
                this.receivablesDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:3});
                }
            },
            resetreceivablesEdit(){//重置表单数据
                this.editActiveRow = {};
                // this.images =[];
                this.$refs['receivablesEdit'].$refs['receivablesForm'].resetFields();
            },
            cellClickHandle(row, column, cell, event){
                if(column.label === '发票图片'){
                    this.receivablesImageDialogVisible = true;
                    this.image_url = row.l_image;
                }
            }
        },
        components:{
            receivablesEdit
        }
    }
</script>
<style scoped>
    .receivables_container{
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