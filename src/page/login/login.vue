<template>
    <div class="login_container">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="login_form">
            <img src="@/assets/img/logo.png" class="logo">
            <el-form-item prop="login_account">
                <el-input v-model="loginForm.login_account" clearable auto-complete='off' placeholder='请输入账号'></el-input>
            </el-form-item>
            <el-form-item prop="login_password">
                <el-input type='password' v-model="loginForm.login_password" clearable auto-complete='off' placeholder='请输入密码' class='login_password_item' @keyup.13.native='login("loginForm")'></el-input>
            </el-form-item>
            <el-radio v-model="remember" label="1" class='remember_pasd'>记住密码</el-radio>
            <el-button type="primary" class='login_btn' @click='login("loginForm")'>登录</el-button>
        </el-form>
    </div>
</template>
<script>
    import {ajax_login} from '@/service/getData';
    export default{
        name:'login',
        data(){
            return{
                loginForm:{
                    login_account:'',
                    login_password:''
                },
                rules: {
                    login_account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    login_password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                remember:'1',
                loginBtnStatus:false//登录按钮是否可点击
            }
        },
        methods:{
            async login(formName){
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.loginBtnStatus = true;
                            ajax_login(this.loginForm.login_account,this.loginForm.login_password).then(res=>{
                                this.loginBtnStatus = false;
                                if(res.error){
                                    this.$message({
                                        message: res.error,
                                        type: 'error'
                                    });
                                    return false;
                                }
                                this.$message({
                                    message:res.success,
                                    type:'success'
                                });
                                setTimeout(function(){
                                    that.$router.push('/home');
                                },3000);
                            }).catch(error=>{
                                this.loginBtnStatus = false;
                            });
                        } else {
                            return false;
                        }
                    })
                } catch(e) {
                    this.loginBtnStatus = false;
                }
            }
        }
    }
</script>
<style scoped>
    .login_container{
        height: 100%;
        background: url('../../assets/img/login_bg.jpg') center top no-repeat #EDEFF3;
        position: relative;
        background-size: auto 580px;
    }
    .login_bg{
        width: 100%;
    }
    .login_form{
        width: 450px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top:398px;
        background:#fff;
        padding: 40px 75px;
        box-sizing: border-box;
        text-align: center;
        box-shadow:5px 3px 6px rgba(0,0,0,0.1);
        z-index: 10;
    }
    .login_form:after{
        /*content: '';
        position: absolute;
        width: 100%;
        height: 91px;
        background: url('../../assets/img/form_shadow.png') center center no-repeat ;
        left: 0;
        bottom: -40px;
        z-index: -1;*/
    }
    .login_form .logo{
        margin-bottom: 50px;
    }
    .el-input:before{
        content: '';
        background: url('../../assets/img/login_account.png');
        position: absolute;
        width: 19px;
        height: 22px;
        top:50%;
        transform: translateY(-50%);
        left: 15px;
    }
    .login_password_item:before{
        width: 18px;
        background: url('../../assets/img/login_password.png');
    }
    .login_btn{
        width: 100%;
    }
    .remember_pasd{
        text-align: left;
        display: block;
        margin: -5px 0 40px;
    }
    
</style>