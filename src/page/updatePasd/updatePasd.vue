<template>
    <div class="updatePasd_container">
        <el-form ref="updatePasdForm" :model="updatePasdForm" :rules='updatePasdFormRules' label-width="80px" class='updatePasd_form'>
            <el-form-item prop='member_id' class='hide-form-item'>
                <el-input  v-model="updatePasdForm.member_id" placeholder='请输入密码'></el-input>
            </el-form-item>
            <el-form-item prop='login_password' label='密码'>
                <el-input type='password' v-model="updatePasdForm.login_password" placeholder='请输入密码' @keyup.enter.native="onSubmitForm('updatePasdForm')"></el-input>
            </el-form-item>
            <div class="btns">
                <el-button type="primary" @click="onSubmitForm('updatePasdForm')" class='submit_btn'>保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import {password,unset_member} from '@/service/getData';
    export default{
        name:'updatePasd',
        data(){
            let tempMemberId = '';
            if(this.$store.state.memberRoleId && this.$store.state.memberRoleId.member_id){
                tempMemberId = this.$store.state.memberRoleId.member_id
            }
            return{
                submitPasdBtnStatus:false,
                updatePasdForm:{
                    member_id:tempMemberId,
                    login_password:''
                },
                updatePasdFormRules:{
                    login_password: [
                        {  required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            async logout(){//退出用户
                try {
                    const res  = await unset_member({showLoad: '3'});
                    if(res.success){
                        this.$router.push('/');
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            onSubmitForm(formName){
                if(this.submitPasdBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitPasdBtnStatus = true;
                        password(this.updatePasdForm).then(res=>{
                            this.submitPasdBtnStatus = false;
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
                                message:res.success+",请重新登录",
                                type:'success'
                            });
                            setTimeout(()=>{
                                that.logout();
                            },3000);
                        }).catch(error=>{
                            this.submitPasdBtnStatus = false;
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
    .updatePasd_container{
        padding: 30px;
    }
    .updatePasd_form{
        width: 600px;
        /*margin: 0 auto;*/
    }
    .btns{
        text-align: center;
    }
</style>