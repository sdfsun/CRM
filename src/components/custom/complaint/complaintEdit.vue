<template>
    <section class="complaintEdit_container">
        <el-form ref="complaintForm" :model="complaintForm" :rules='complaintFormRules' label-width="0" >
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='type'>
                        <el-select v-model="complaintForm.type" placeholder="类型" clearable>
                            <el-option label="售后" value="0"></el-option>
                            <el-option label="投诉" value="1"></el-option>
                            <el-option label="建议" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='name'>
                        <el-input  v-model="complaintForm.name" placeholder='接待人名称' readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item prop='outline'>
                        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="complaintForm.outline" placeholder='售后、投诉、建议概要' ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('complaintForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {complaint_save} from '@/service/getData';
    import { mapState } from 'vuex';

    export default{
        name:'complaintEdit',
        props:['informationItem','editInfos'],
        data(){
            return{
                complaintForm:{
                    information_id:this.informationItem.id,//客户id
                    name:this.$store.state.memberRoleId.name,//投诉人
                    type:'0',//投诉类型
                    outline:''//投诉概要
                },
                submitBtnStatus:false,//保存按钮是否可点击
                complaintFormRules:{//规则校验
                    name: [
                        {  required: true, message: '请填写接待人名称', trigger: 'blur' }
                    ],
                    type: [
                        {  required: true, message: '请选择投诉类型', trigger: 'change' }
                    ],
                    outline: [
                        { required: true, message: '请填写投诉概要', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.complaintForm = Object.assign({},this.editInfos);
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                this.complaintForm.information_id = this.informationItem.id;
                if(newVal.id){
                    this.complaintForm = Object.assign({},newVal);
                }else{
                    this.resetFormData();
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.complaintForm['id'];
                delete this.complaintForm['createtime'];
            },
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitBtnStatus = true;
                        complaint_save(this.complaintForm).then(res=>{
                            this.submitBtnStatus = false;
                            if(res.error){
                                this.$message({
                                    showClose:true,
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
                                showClose:true,
                                message:res.success,
                                type:'success'
                            });
                            that.closeTransactionInfoDialog("complaintForm",res.data);
                        }).catch(error=>{
                            this.$message({
                                showClose:true,
                                message: error.message,
                                type: 'error'
                            });
                            this.submitBtnStatus = false;
                        });
                    }
                });
            },
            closeTransactionInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomComplaintInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomComplaintInfoDialog',{data:result,type:'add'});
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
        margin-right: 0;
    }
    .image_item_upload{
        width: 148px;
        height: 148px;
    }
</style>