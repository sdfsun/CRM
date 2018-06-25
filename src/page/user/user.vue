<template>
    <section class="customerSource_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertCustomSource'>新建用户记录</el-button>
        <el-table
            ref='customListsTable'
            :data="roleLists"
            stripe
            border
            style="width: 100%;text-align: center;flex:1;overflow: auto;"
            header-row-class-name='header_row_style'>
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100'
                >
            </el-table-column>
            <el-table-column
                prop="member_id"
                label="member_id"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                prop="login_account"
                label="用户名"
                >
            </el-table-column>
            <el-table-column
                prop='name'
                label="姓名"
                >
            </el-table-column>
            <el-table-column
                prop="org_name"
                label="所属门店">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="用户等级">
            </el-table-column>
            <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleEdit(scope.row)"
                    type="text"
                    size="medium">
                        编辑
                    </el-button>
                    <el-button
                    @click.native.prevent="handleUpdatePassword(scope.row.member_id)"
                    type="text"
                    size="medium">
                        修改密码
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加用户" :visible.sync="userDialogVisible" @close='resetUserEdit' :close-on-click-modal='false'>
            <userEdit  v-on:closeUserInfoDialog='updateUserRecord' :editInfos='currentrow' ref='userEdit'></userEdit>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="userUpdatePasdDialogVisible" @close='resetUserUpdatePasdEdit' class='updatePasd_dialog' :close-on-click-modal='false'>
            <el-form ref="updatePasdForm" :model="updatePasdForm" :rules='updatePasdFormRules' label-width="80px">
                <el-form-item prop='member_id' class='hide-form-item'></el-form-item>
                <el-form-item prop='login_password' label='密码'>
                    <el-input type='password' v-model="updatePasdForm.login_password" placeholder='请输入密码' @keyup.enter.native="onSubmitForm('updatePasdForm')"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmitForm('updatePasdForm')" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {mapMutations} from 'vuex';
    import {member,password} from '@/service/getData';
    import userEdit from '@/components/user/userEdit';
    import { setStore } from '@/utils/';

    export default{
        name:'user',
        data(){
            return{
                roleLists:[],
                currentrow:{},
                submitBtnStatus:false,
                userDialogVisible:false,
                submitPasdBtnStatus:false,
                userUpdatePasdDialogVisible:false,
                updatePasdForm:{
                    member_id:'',
                    login_password:''
                },
                updatePasdFormRules:{
                    login_password: [
                        {  required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapMutations([
                'SETDESIGNERS'
            ]),
            async init(){
                try {
                    let that = this;
                    let res = await member();
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
                    if(res.success){
                        this.roleLists = res.success;
                    }else{
                        this.roleLists = [];
                    }
                    let tempDesigners = [];
                    if(res.success && res.success.length>0){
                        res.success.forEach( function(el, index) {
                            if(el.org_id === '5' && el.lv_code === 'designer'){//设计师
                                tempDesigners.push(el);
                            }
                        });
                    }
                    setStore("designers",tempDesigners);
                    this.SETDESIGNERS(tempDesigners);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertCustomSource(){//新增记录
                this.currentrow = {};
                this.userDialogVisible = true;
            },
            handleEdit(curRow){//编辑
                this.currentrow = Object.assign({},curRow);
                this.userDialogVisible = true;
            },
            resetUserEdit(){//重置用户表单数据
                this.editActiveRow = {};
                this.$refs['userEdit'].$refs['userForm'].resetFields();
            },
            updateUserRecord(callbackData){//更新用户记录
                this.userDialogVisible = false;
                if(callbackData.data){
                    if(callbackData.type === 'add'){
                        this.roleLists.push(callbackData.data);
                    }else{//编辑
                        const index = this.roleLists.findIndex(function(item, index, arr) {
                            return item.member_id === callbackData.data.member_id;
                        });
                        this.$set(this.roleLists,index,callbackData.data);
                    }
                }
            },
            handleUpdatePassword(id){//修改密码
                this.updatePasdForm.member_id = id;
                this.userUpdatePasdDialogVisible = true;
            },
            resetUserUpdatePasdEdit(){//重置修改密码弹框
                this.userUpdatePasdDialogVisible = false;
                this.$refs['updatePasdForm'].resetFields();
            },
            onSubmitForm(formName){
                if(this.submitPasdBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitPasdBtnStatus = true;
                            password(this.updatePasdForm).then(res=>{
                                this.submitPasdBtnStatus = false;
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
                                that.resetUserUpdatePasdEdit();
                            }).catch(error=>{
                                this.submitPasdBtnStatus = false;
                            });
                        }
                    });
                }catch(e){
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitPasdBtnStatus = false;
                }
            }
        },
        components:{
            userEdit
        }
    }
</script>
<style scoped>
    .customerSource_container{
        padding: 20px 30px;
    }
    .add_source{
        margin-bottom: 20px;
    }
    .btns{
        text-align: center;
    }
</style>