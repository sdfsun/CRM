<template>
    <section class="complaintEdit_container">
        <el-form ref="complaintForm" :model="complaintForm" :rules='complaintFormRules' label-width="0" >
            <el-form-item prop='id' class='hide-form-item'></el-form-item>
            <el-form-item prop='createtime' class='hide-form-item'></el-form-item>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='type'>
                        <el-select v-model="complaintForm.type" placeholder="类型">
                            <el-option label="投诉" value="1"></el-option>
                            <el-option label="建议" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='name'>
                        <el-input  v-model="complaintForm.name" placeholder='接待人名称'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item prop='status'>
                        <el-select v-model="complaintForm.status" placeholder="请选择客户状态">
                            <el-option
                                v-for="item in customStatus"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item prop='outline'>
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="complaintForm.outline" placeholder='投诉建议概要...' ></el-input>
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
                    id:"",
                    createtime:"",
                    name:'',//投诉人
                    type:'1',//投诉类型
                    outline:'',//投诉概要
                    status:this.informationItem.status//状态
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
                    ],
                    status: [
                        {  required: true, message: '请选择状态', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            ...mapState([
                'customStatus'
            ])
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.complaintForm = Object.assign({},this.editInfos);
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.id){
                    this.complaintForm = Object.assign({},newVal);
                }
            }
        },
        methods:{
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            complaint_save(this.complaintForm).then(res=>{
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
                                that.closeTransactionInfoDialog("complaintForm",res.data);
                            }).catch(error=>{
                                // this.$message({
                                //     message: error,
                                //     type: 'error'
                                // });
                                this.submitBtnStatus = false;
                            });
                        }
                    })
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitBtnStatus = false;
                }
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