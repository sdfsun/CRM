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
                prop="org_id"
                label="所属门店">
            </el-table-column>
            <el-table-column
                prop="member_role_id"
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
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="添加用户" :visible.sync="userDialogVisible" @close='resetUserEdit'>
            <userEdit  v-on:closeUserInfoDialog='updateUserRecord' :editInfos='currentrow' ref='userEdit'></userEdit>
        </el-dialog>
    </section>
</template>
<script>
    import Vue from 'vue';
    import {mapActions} from 'vuex';
    import {member,member_save} from '@/service/getData';
    import userEdit from '@/components/user/userEdit';

    export default{
        name:'user',
        data(){
            return{
                roleLists:[],
                currentrow:{},
                submitBtnStatus:false,
                userDialogVisible:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapActions([
                'addCustomSource',
                'updateCustomSource'
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
                        res.success.forEach( function(el, index) {
                            el.disabled = el.disabled === 'true'?true:false;
                            el.editFlag = false;
                        });
                        this.roleLists = res.success;
                    }else{
                        this.roleLists = [];
                    }
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
            updateUserRecord(){//更新用户记录
                this.userDialogVisible = false;
                if(callbackData.data){
                    if(callbackData.type === 'add'){
                        this.roleLists.push(callbackData.data);
                    }else{//编辑
                        const index = this.roleLists.findIndex(function(item, index, arr) {
                            return item.member_id === callbackData.data.member_id;
                        });
                        Vue.set(this.roleLists,index,callbackData.data);
                    }
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
</style>