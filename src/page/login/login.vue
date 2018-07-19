<template>
    <div class="login_container">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0" class="login_form">
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
    import { mapMutations } from 'vuex';
    import { ajax_login } from '@/service/getData';
    import { setStore } from '@/utils/';

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
            ...mapMutations([
                'SETCUSTOMSOURCE',
                'SETCUSTOMSTATUS',
                'SETMEMBERROLES',
                'SETMEMBERROLEID',
                'SETACTIVITYS',
                'SETDESIGNERS',
                'SETQRCODE',
                'SETMENUS'
            ]),
            async login(formName){
                if(this.loginBtnStatus){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loginBtnStatus = true;
                        ajax_login(this.loginForm.login_account,this.loginForm.login_password).then(res=>{
                            this.loginBtnStatus = false;
                            if(res.error){
                                this.$message({
                                    showClose:true,
                                    message: res.error,
                                    type: 'error'
                                });
                                return false;
                            }
                            this.$message({
                                showClose:true,
                                message:res.success,
                                type:'success'
                            });
                            if(res.data){
                                if(res.data.member){
                                    //设置当前登录账户相关信息
                                    setStore("memberRoleId",res.data.member);
                                    this.SETMEMBERROLEID(res.data.member);
                                }
                                //设置客户来源
                                if(res.data.source){
                                    setStore("customSource",res.data.source);
                                    this.SETCUSTOMSOURCE(res.data.source);
                                }
                                if(res.data.customer_state){
                                    setStore("customStatus",res.data.customer_state);
                                    this.SETCUSTOMSTATUS(res.data.customer_state);
                                }
                                //设置用户等级
                                if(res.data.member_role){
                                    setStore("memberRoles",res.data.member_role);
                                    this.SETMEMBERROLES(res.data.member_role);
                                }
                                //设置活动列表
                                if(res.data.activity){
                                    setStore("activitys",res.data.activity);
                                    this.SETACTIVITYS(res.data.activity);
                                }
                                //设置设计师列表
                                if(res.data.designer){
                                    setStore("designers",res.data.designer);
                                    this.SETDESIGNERS(res.data.designer);
                                }
                                //是否需要微信绑定
                                if(res.data.weixin){
                                    this.SETQRCODE(res.data.weixin);
                                }
                                //设置权限列表
                                if(res.data.menus){
                                    setStore("menus",res.data.menus);
                                    this.SETMENUS(res.data.menus);

                                    //设置跳转路径
                                    let menus = res.data.menus[0];
                                    if(!menus || menus.length == 0){
                                        this.$message({
                                            showClose:true,
                                            message: '当前账户角色没有登录权限，请先联系管理员分配权限再登录',
                                            type: 'error'
                                        });
                                        return false;
                                    }else{
                                        let goPath = menus.menus[0].path;
                                        setTimeout(function(){
                                            that.$router.push(goPath);
                                        },3000);
                                    }
                                }
                            }
                        }).catch(error=>{
                            this.loginBtnStatus = false;
                            this.$message({
                                showClose:true,
                                message: error.message,
                                type: 'error'
                            });
                        });
                    }
                });
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
        margin-bottom: 40px;
    }
    .el-form-item{
        margin-bottom: 16px;
    }
    @media screen and (max-width: 1366px){
        .login_container{
            background: url('../../assets/img/login_bg_1366.jpg') center top no-repeat #EDEFF3;
            position: relative;
            background-size: auto 416px;
        }
        .login_form{
            width: 380px;
            padding: 40px 64px;
            top:274px;
        }
        .login_form .logo{
            margin-bottom: 32px;
        }
        .remember_pasd{
            margin-bottom: 30px;
        }
    }
</style>