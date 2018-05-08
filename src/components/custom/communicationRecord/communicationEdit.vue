<template>
    <section class="communicationEdit_container">
        <el-form ref="communicateForm" :model="communicateForm"  :rules="communicateFormRules" label-width="0">
            <el-row :gutter="8">
                <el-col :span="7">
                    <el-form-item prop='mode'>
                        <el-select v-model="communicateForm.mode" placeholder="沟通方式">
                            <el-option label="店里沟通" value="店里沟通"></el-option>
                            <el-option label="电话沟通" value="电话沟通"></el-option>
                            <el-option label="微信沟通" value="微信沟通"></el-option>
                            <el-option label="邮件沟通" value="邮件沟通"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='contact_time' ref='concactTimeItem'>
                        <el-date-picker
                            v-model="communicateForm.contact_time"
                            type="datetime"
                            placeholder="沟通起始时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <el-form-item>
                        至
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='end_time'>
                        <el-date-picker
                            v-model="communicateForm.end_time"
                            type="datetime"
                            placeholder="沟通结束时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='bespeak_time'>
                        <el-date-picker
                            v-model="communicateForm.bespeak_time"
                            type="datetime"
                            placeholder="预约到店时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='scale_time'>
                        <el-date-picker
                            v-model="communicateForm.scale_time"
                            type="datetime"
                            placeholder="预约量尺时间"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            @change='scaleTimeHandleChange'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='member_id'>
                        <el-select v-model="communicateForm.member_id" clearable placeholder="请选择设计师">
                            <el-option
                                v-for="item in assignDesignerLists"
                                :key="item.member_id"
                                :label="item.name"
                                :value="item.member_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='is_arrival'>
                        <el-select v-model="communicateForm.is_arrival" placeholder="是否已到店" clearable>
                            <el-option label="未知" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='name'>
                        <el-input readonly='true' v-model="communicateForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop='outline' class='form_item_style_width'>
                <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="communicateForm.outline" placeholder='沟通概要'></el-input>
            </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('communicateForm','1')" class='submit_btn'>保存记录</el-button>
            <el-button type="primary" @click="onSubmit('communicateForm','2')" class='submit_btn'>客户拒绝</el-button>
        </div>
    </section>
</template>
<script>
    import {stylist,communicate_save} from '@/service/getData';
    import {getDuration,formatDate} from '@/utils/index';
    import {mapState} from 'vuex';

    export default{
        name:'communicationEdit',
        props:['informationItem','editInfos','communicateBasicFormDatas'],
        data(){
            let checkMode = (rule,val,callback) => {
                if( val === null || val === ''){
                    callback(new Error('请选择沟通方式'));
                    return false;
                }
                if(val !== '' && val === '电话沟通' && !this.communicateForm.contact_time){
                    this.communicateForm.contact_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                    this.$refs['concactTimeItem'].clearValidate();
                    callback();
                    return false;
                }
                callback();
            };
            return{
                information_id:this.informationItem.id,//客户id
                communicateForm:{
                    name:this.$store.state.memberRoleId.name,//接待人
                    mode:'',//沟通方式
                    contact_time:'',//沟通开始时间
                    end_time:'',//沟通结束时间
                    duration:'',//沟通时长
                    bespeak_time:'',//预约到店时间
                    is_arrival:'',//是否到店
                    is_bespeak:'',//是否预约成功
                    scale_time:'',//预约量尺时间
                    member_id:'',//指派的设计师
                    outline:''//沟通概要
                },
                assignDesignerLists:[],//可指派设计师
                submitBtnStatus:false,//保存按钮是否可点击
                communicateFormRules:{//规则校验
                    mode: [
                        { validator: checkMode}
                    ],
                    contact_time: [
                        {  required: true, message: '请选择沟通开始时间', trigger: 'change' }
                    ],
                    end_time: [
                        {  required: true, message: '请选择沟通结束时间', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                // this.communicateForm = this.editInfos;
                this.communicateForm = Object.assign({}, this.editInfos);
                this.communicateForm.name = this.$store.state.memberRoleId.name;
                this.assignDesignerLists = this.editInfos.designer;
                this.communicateForm.member_id = this.editInfos.select;
            }else{
                this.resetFormData();
                this.assignDesignerLists = [];
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                // this.communicateForm = newVal;
                this.communicateForm.information_id = this.informationItem.id;
                if(newVal.id){
                    this.communicateForm = Object.assign({}, newVal);
                    this.communicateForm.name = this.$store.state.memberRoleId.name;
                    this.assignDesignerLists = newVal.designer;
                    this.communicateForm.member_id = newVal.select;
                }else{
                    this.resetFormData();
                    this.assignDesignerLists = [];
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.communicateForm['id'];
                delete this.communicateForm['createtime'];
                delete this.communicateForm['update_time'];
            },
            scaleTimeHandleChange(val){//预约量尺时间改变时触发
                if(val && val !== ''){
                    this.getAssignDesignerLists();
                }else{
                    this.communicateForm.member_id = '';
                    this.assignDesignerLists = [];
                }
            },
            async getAssignDesignerLists(){//获取可分配设计师列表
                try {
                    let that = this;
                    const res = await stylist(this.informationItem.id,this.communicateForm.scale_time);
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
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            onSubmit(formName,type){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            let tempDuration = getDuration(this.communicateForm.contact_time,this.communicateForm.end_time);
                            if(tempDuration < 0){
                                this.$message({
                                    message:'沟通结束时间不能小于沟通开始时间',
                                    type:'error'
                                });
                                this.submitBtnStatus = false;
                                return false;
                            }else{
                                this.communicateForm.duration  = tempDuration;
                            }
                            let tempFormData = {};
                            tempFormData.information_id = this.informationItem.id;
                            tempFormData.information_type = type;
                            tempFormData.information = this.communicateBasicFormDatas.id?this.communicateBasicFormDatas:this.informationItem;
                            tempFormData.communicate = this.communicateForm;
                            communicate_save(tempFormData).then(res=>{
                                this.submitBtnStatus = false;
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
                                that.closeCommunicateInfoDialog("communicateForm",res.data);
                            }).catch(error=>{
                                this.submitBtnStatus = false;
                                // this.$message({
                                //     message: error,
                                //     type: 'error'
                                // });
                            });
                        }
                    })
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            closeCommunicateInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomCommunicateInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomCommunicateInfoDialog',{data:result,type:'add'});
                }
            }
        }
    }
</script>
<style scoped>
    .btns{
        text-align: center;
        margin-top: 30px;
    }
    .btns .submit_btn{
        width: 120px;
    }
    .form_item_style_width{
        width: 100%;
    }
</style>