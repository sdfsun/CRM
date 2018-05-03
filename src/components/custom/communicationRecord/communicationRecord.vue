<template>
    <div class="communicationRecord">
        <el-table
            :data="communicateRecords"
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
                prop="is_bespeak_name"
                label="是否预约成功"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="reason"
                label="预约失败原因"
                min-width='200px'
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
                min-width='200px'>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" disabled icon='el-icon-plus' v-if='statusForm.status == "3"'>分配设计师</el-button>
            <el-button type="primary" icon='el-icon-plus' @click='getAssignDesignerLists' v-else>分配设计师</el-button>
            <el-button type="primary" icon='el-icon-plus' @click='addCommunicationRecord'>新增沟通记录</el-button>
            <el-button type="primary" @click='editCommunicationRecord'>编辑</el-button>
        </div>
        <el-dialog title="沟通记录" :visible.sync="communicationDialogVisible" class='customRelationInfoDialog' @close='resetCommunicationEdit'>
            <communicationEdit :informationItem='infomation' v-on:closeCustomCommunicateInfoDialog='updateCommunicationRecord' :editInfos='editActiveRow' ref='communicationEdit'></communicationEdit>
        </el-dialog>
        <el-dialog title="分配设计师" :visible.sync="assignDesignerFormDialogVisible" class='assignDesignerDialog' @close='resetAssignDesignerForm'>
            <el-form ref="assignDesignerForm" :model="assignDesignerForm" :rules='assignDesignerFormRules' label-width="80px">
                <!-- <el-form-item prop='information_id' class='hide-form-item'></el-form-item> -->
                <el-form-item prop='to_id' label='符合预约时间的设计师'>
                    <el-select v-model="assignDesignerForm.to_id" clearable placeholder="请选择设计师">
                        <el-option
                            v-for="item in assignDesignerLists"
                            :key="item.member_id"
                            :label="item.name"
                            :value="item.member_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmitAssignDesignerForm('assignDesignerForm')" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import communicationEdit from '@/components/custom/communicationRecord/communicationEdit';
    import {stylist,assign} from '@/service/getData';

    export default{
        name:'communicationRecord',
        props:['communicateRecords','infomation'],
        data(){
            return{
                communicationDialogVisible:false,
                editActiveRow:{},//当前需要编辑的行
                currentrow:null,
                assignDesignerBtnStatus:false,//列表
                assignDesignerSubmitBtnStatus:false,//发送微信通知
                assignDesignerFormDialogVisible:false,
                assignDesignerLists:[],//可分配设计师列表
                assignDesignerForm:{
                    // information_id:this.infomation.id,
                    to_id:''
                },
                assignDesignerFormRules:{
                    to_id: [
                        {  required: true, message: '请选择需要分配的设计师', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            statusForm:function(){
                let statusFormTemp = {status:'3'};
                if(this.communicateRecords && this.communicateRecords.length>0){
                    statusFormTemp.status = this.communicateRecords[0].scale;
                    if(this.communicateRecords[0].scale === "1"){
                        statusFormTemp.member_id = this.communicateRecords[0].member_id;
                        statusFormTemp.member_usercode = this.communicateRecords[0].member_usercode;
                        statusFormTemp.member_name = this.communicateRecords[0].member_name;
                    }
                }
                return statusFormTemp;
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
            },
            resetAssignDesignerForm(){//重置分配设计师表单
                this.assignDesignerFormDialogVisible = false;
                this.$refs['assignDesignerForm'].resetFields();
            },
            async getAssignDesignerLists(){//获取可分配设计师列表
                try {
                    let that = this;
                    if(this.assignDesignerBtnStatus){
                        return false;
                    }
                    this.assignDesignerBtnStatus = true;
                    const res = await stylist(this.infomation.id,this.statusForm.member_id);
                    this.assignDesignerBtnStatus = false;
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
                    this.assignDesignerLists = res.success;
                    this.assignDesignerFormDialogVisible = true;
                } catch(e) {
                    this.assignDesignerBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            onSubmitAssignDesignerForm(formName){//分配设计师 发送微信通知
                if(this.assignDesignerSubmitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid,obj) => {
                        if (valid) {
                            this.assignDesignerSubmitBtnStatus = true;
                            this.assignDesignerForm.information_id = this.infomation.id;
                            assign(this.assignDesignerForm).then(res=>{
                                this.assignDesignerSubmitBtnStatus = false;
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
                                this.$message({
                                    message:res.success,
                                    type:'success'
                                });
                                this.resetAssignDesignerForm();
                            }).catch(error=>{
                                this.assignDesignerSubmitBtnStatus = false;
                            });
                        }
                    });
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.assignDesignerSubmitBtnStatus = false;
                }
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
        padding: 16px 40px 16px 0;
    }
    .assignDesignerDialog .btns{
        text-align: center;
    }
</style>