<template>
    <div class="communicationRecord">
        <el-table
            :data="communicateRecords"
            stripe
            highlight-current-row
            style="width: 100%;text-align: center;flex:1;overflow: auto;"
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange">
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                >
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                prop="mode"
                label="沟通方式"
                >
            </el-table-column>
            <el-table-column
                prop="contact_time"
                label="沟通开始时间"
                width='160'>
            </el-table-column>
            <el-table-column
                prop="end_time"
                label="沟通结束时间"
                width='160'>
            </el-table-column>
            <el-table-column
                prop="duration"
                label="沟通时长"
                width='100'
                >
            </el-table-column>
            <el-table-column
                prop="bespeak_time"
                label="预约到店时间"
                width='160'
                >
            </el-table-column>
            <el-table-column
                prop="is_arrival_name"
                label="是否到店"
                >
            </el-table-column>
            <el-table-column
                prop="is_bespeak_name"
                label="是否预约成功"
                >
            </el-table-column>
            <el-table-column
                prop="reason"
                label="预约失败原因"
                >
            </el-table-column>
            <el-table-column
                prop="scale_time"
                label="预约量尺时间"
                width='160'>
            </el-table-column>
            <el-table-column
                prop="outline"
                label="沟通概要">
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus'>分配设计师</el-button>
            <el-button type="primary" icon='el-icon-plus' @click='addCommunicationRecord'>新增沟通记录</el-button>
            <el-button type="primary" @click='editCommunicationRecord'>编辑</el-button>
        </div>
        <el-dialog title="沟通记录" :visible.sync="communicationDialogVisible" class='customRelationInfoDialog' @close='resetCommunicationEdit'>
            <communicationEdit :informationItem='infomation' v-on:closeCustomCommunicateInfoDialog='updateCommunicationRecord' :editInfos='editActiveRow' ref='communicationEdit'></communicationEdit>
        </el-dialog>
    </div>
</template>
<script>
    import communicationEdit from '@/components/custom/communicationRecord/communicationEdit';

    export default{
        name:'communicationRecord',
        props:['communicateRecords','infomation'],
        data(){
            return{
                communicationDialogVisible:false,
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addCommunicationRecord(){//新增沟通记录
                this.editActiveRow = {};
                this.editActiveRow.status = this.infomation.status;
                this.communicationDialogVisible = true;
            },
            updateCommunicationRecord(callbackData){
                this.communicationDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:1});
                }
            },
            editCommunicationRecord(){//编辑沟通记录
                if(!this.currentrow){
                    this.$message({
                        message:'请先选中需要编辑的沟通记录！',
                        type:'error'
                    });
                    return false;
                }
                this.editActiveRow = Object.assign({},this.currentrow);
                this.editActiveRow.status = this.infomation.status;
                this.communicationDialogVisible = true;
            },
            resetCommunicationEdit(){//重置表单数据
                this.editActiveRow = {};
                this.$refs['communicationEdit'].$refs['communicateForm'].resetFields();
            }
        },
        components:{
            communicationEdit
        }
    }
</script>
<style scoped>
    .communicationRecord{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .btns{
        text-align: right;
        padding: 26px 40px 25px 0;
    }
</style>