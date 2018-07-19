<template>
    <div class="complaint_container">
        <el-table
            :data="complaintRecords"
            stripe
            highlight-current-row
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
                prop="type_name"
                label="类型"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="接待人"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="outline"
                label="概要"
                min-width='200'
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间"
                min-width='160px'>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addComplaintRecord'>新建售后记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editComplaintRecord'>编辑</el-button>
        </div>
        <el-dialog title="售后记录" :visible.sync="complaintDialogVisible" class='customRelationInfoDialog' @close='resetComplaintEdit' :close-on-click-modal='false'>
            <complaintEdit :informationItem='infomation' :editInfos='editActiveRow' ref='complaintEdit'  v-on:closeCustomComplaintInfoDialog='updateComplaintRecord'></complaintEdit>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import complaintEdit from '@/components/custom/complaint/complaintEdit';

    export default{
        name:'complaint',
        props:['complaintRecords','infomation'],
        data(){
            return{
                complaintDialogVisible:false,
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addComplaintRecord(){//新增投诉记录
                this.editActiveRow = {};
                this.complaintDialogVisible = true;
            },
            editComplaintRecord(){//编辑投诉记录
                if(!this.currentrow){
                    this.$message({
                        showClose:true,
                        message:'请先选中需要编辑的投诉记录！',
                        type:'error'
                    });
                    return false;
                }
                this.editActiveRow = Object.assign({},this.currentrow);
                this.complaintDialogVisible = true;
            },
            updateComplaintRecord(callbackData){
                this.complaintDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:6});
                }
            },
            resetComplaintEdit(){//重置表单数据
                this.editActiveRow = {};
                // this.images =[];
                this.$refs['complaintEdit'].$refs['complaintForm'].resetFields();
            }
        },
        components:{
            complaintEdit
        }
    }
</script>
<style scoped>
    .complaint_container{
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
</style>