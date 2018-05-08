<template>
    <section class="userEdit_container">
        <el-form ref="userForm" :model="userForm" :rules='userFormRules' label-width="90px" >
            <el-form-item prop='login_account' label='用户名' v-if='!editInfos.member_id'>
                <el-input  v-model="userForm.login_account" placeholder='请输入用户名' clearable></el-input>
            </el-form-item>
            <el-form-item prop='login_password' label='密码' v-if='!editInfos.member_id'>
                <el-input type='password' v-model="userForm.login_password" placeholder='请输入密码' clearable></el-input>
            </el-form-item>
            <el-form-item prop='name' label='姓名'>
                <el-input  v-model="userForm.name" placeholder='请输入姓名' clearable></el-input>
            </el-form-item>
            <el-form-item prop='mobile' label='手机号码'>
                <el-input  type='number' maxlength='11' v-model="userForm.mobile" placeholder='请输入手机号码' clearable></el-input>
            </el-form-item>
            <el-form-item label="所属门店" prop='org_id'>
                <el-select v-model="userForm.org_id" placeholder="请选择所属门店">
                    <el-option
                        v-for="item in orgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户等级" prop='member_role_id'>
                <el-select v-model="userForm.member_role_id" placeholder="请选择用户等级">
                    <el-option
                        v-for="item in memberRoles"
                        :key="item.member_role_id"
                        :label="item.name"
                        :value="item.member_role_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户状态" prop='status'>
                <el-switch
                    v-model="userForm.status"
                    active-value="1"
                    inactive-value="2">
                </el-switch>
            </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('userForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {member_save} from '@/service/getData';
    import { mapState,mapActions } from 'vuex';

    export default{
        name:'userEdit',
        props:['editInfos'],
        data(){
            return{
                userForm:{
                    login_account:'',//用户名
                    login_password:'',//登录密码
                    name:'',//姓名
                    member_role_id:'',//用户等级
                    mobile:'',//手机号码
                    status:'1',//是否启用
                    org_id:'5',//所属门店
                },
                orgs:[
                    {
                        value: '5',
                        label: '松霖厦门精品店'
                    },
                    {
                        value: '4',
                        label: '松霖成都体验店'
                    },
                    {
                        value: '3',
                        label: '松霖西安体验店'
                    },
                    {
                        value: '2',
                        label: '松霖长沙体验店'
                    },
                    {
                        value: '1',
                        label: '松霖南京体验店'
                    }
                ],
                submitBtnStatus:false,//保存按钮是否可点击
                userFormRules:{//规则校验
                    login_account: [
                        {  required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    login_password: [
                        {  required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    mobile: [
                        {  required: true, message: '请输入手机号码', trigger: 'blur' }
                    ],
                    org_id: [
                        {  required: true, message: '请选择所属门店', trigger: 'change' }
                    ],
                    member_role_id: [
                        {  required: true, message: '请选择用户等级', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            ...mapState([
                'memberRoles'
            ])
        },
        mounted(){
            if(this.editInfos && this.editInfos.member_id){
                this.userForm = Object.assign({},this.editInfos);
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.member_id){
                    this.userForm = Object.assign({},newVal);
                }else{
                    this.resetFormData();
                }
            }
        },
        methods:{
            ...mapActions([
                'updateDesigners'
            ]),
            resetFormData(){
                delete this.userForm['member_id'];
                delete this.userForm['password_account'];
                delete this.userForm['createtime'];
            },
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid,obj) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            this.userForm.password_account = this.userForm.login_account;
                            member_save(this.userForm).then(res=>{
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
                                that.closeUserEditInfoDialog("userForm",res.data);
                                if(res.data && res.data.org_id === '5' && res.data.lv_code === 'designer'){//厦门店设计师
                                    this.updateDesigners(res.data);
                                }
                            }).catch(error=>{
                                this.submitBtnStatus = false;
                            });
                        }
                    });
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitBtnStatus = false;
                }
            },
            closeUserEditInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.member_id){//编辑
                    this.$emit('closeUserInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeUserInfoDialog',{data:result,type:'add'});
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
</style>