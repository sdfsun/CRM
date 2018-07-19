<template>
    <div class="communicationRecord">
        <el-table
            :data="communicateRecords"
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
                prop="name"
                label="接待人"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="mode"
                label="沟通方式"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="contact_time"
                label="沟通开始时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="end_time"
                label="沟通结束时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="duration"
                label="沟通时长"
                min-width='140'
                >
            </el-table-column>
            <el-table-column
                prop="bespeak_time"
                label="预约到店时间"
                min-width='160'
                >
            </el-table-column>
            <el-table-column
                prop="is_arrival_name"
                label="是否到店"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="scale_time"
                label="预约量尺时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="outline"
                label="沟通概要"
                min-width='200px'
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="current_state_name"
                label="客户状态"
                min-width='100px'>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addCommunicationRecord'>新增沟通记录</el-button>
            <el-button type="primary" @click='editCommunicationRecord'>编辑</el-button>
        </div>
        <el-dialog title="沟通记录" :visible.sync="communicationDialogVisible" class='customRelationInfoDialog communicationAndBasicDialog' @close='resetCommunicationEdit' :close-on-click-modal='false'>
            <el-tabs type="border-card" class='el_tabs_footer' v-model='activeName' @tab-click='communication_basic_et'>
                <el-tab-pane label="沟通记录" name='1'>
                    <communicationEdit :informationItem='infomation' v-on:closeCustomCommunicateInfoDialog='updateCommunicationRecord' :editInfos='editActiveRow' :communicateBasicFormDatas='communicateBasicFormData' ref='communicationEdit'></communicationEdit>
                </el-tab-pane>
                <el-tab-pane label="基本信息" name='2'>
                    <basicEdit :editInfos='communicateBasicFormData' :hideType='1' ref='communicateBasicForms'></basicEdit>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
    import communicationEdit from '@/components/custom/communicationRecord/communicationEdit';
    import basicEdit from '@/components/custom/basicInfo/basicEdit';
    import {assign} from '@/service/getData';

    export default{
        name:'communicationRecord',
        props:['communicateRecords','infomation'],
        data(){
            return{
                communicationDialogVisible:false,
                editActiveRow:{},//当前需要编辑的行
                currentrow:null,
                activeName:'1',
                formSuccessData:null,//基本信息数据
                communicateBasicFormData:null//基本信息数据
            }
        },
        methods:{
            communication_basic_et(){
                if(this.activeName === '1'){
                    let res = this.$refs['communicateBasicForms'].$refs['basicForms'].model;
                    this.communicateBasicFormData = res;
                }
            },
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addCommunicationRecord(){//新增沟通记录
                let that = this;
                this.communicateBasicFormData = Object.assign({},this.infomation);
                if(this.infomation && this.infomation.locking === 'true'){
                    this.$confirm(''+this.infomation.locking_name+'('+this.infomation.locking_usercode+')目前正在与该客户沟通中，您是否继续当前操作？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        setTimeout(function(){
                            that.editActiveRow = {};
                            that.communicationDialogVisible = true;
                        },200);
                    }).catch(() => {
                    });
                }else{
                    this.editActiveRow = {};
                    this.communicationDialogVisible = true;
                }
            },
            updateCommunicationRecord(callbackData){
                this.communicationDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.formSuccessData = callbackData.data.information;
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:1});
                }
            },
            editCommunicationRecord(){//编辑沟通记录
                if(!this.currentrow){
                    this.$message({
                        showClose:true,
                        message:'请先选中需要编辑的沟通记录！',
                        type:'error'
                    });
                    return false;
                }
                let that = this;
                this.communicateBasicFormData = Object.assign({},this.infomation);
                if(this.infomation && this.infomation.locking === 'true'){
                    this.$confirm(''+this.infomation.locking_name+'('+this.infomation.locking_usercode+')目前正在与该客户沟通中，您是否继续当前操作？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        setTimeout(function(){
                            that.editActiveRow = Object.assign({},this.currentrow);
                            that.communicationDialogVisible = true;
                        },200);
                    }).catch(() => {
                    });
                }else{
                    this.editActiveRow = Object.assign({},this.currentrow);
                    this.communicationDialogVisible = true;
                }
            },
            resetCommunicationEdit(){//重置表单数据
                this.activeName = '1';
                this.editActiveRow = {};
                this.$refs['communicationEdit'].$refs['communicateForm'].resetFields();
                if(this.formSuccessData){
                    this.communicateBasicFormData = Object.assign({},this.formSuccessData);
                }else{
                    this.communicateBasicFormData = Object.assign({},this.infomation);
                }
            }
        },
        components:{
            communicationEdit,
            basicEdit
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
        padding: 16px 40px 16px 0;
    }
    .assignDesignerDialog .btns{
        text-align: center;
    }
</style>