<template>
    <section class="role_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertRole'>新建角色记录</el-button>
        <el-table
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
                prop="member_role_id"
                label="member_role_id"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                label="等级名称"
                min-width='100'
                >
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.name"></el-input>
                    </span>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="描述"
                min-width='120'>
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.remark"></el-input>
                    </span>
                    <span v-else>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="等级代码"
                min-width='100'>
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.lv_code"></el-input>
                    </span>
                    <span v-else>{{scope.row.lv_code}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="是否开启"
                min-width='80'>
                <template slot-scope='scope'>
                    <el-switch
                        v-model="scope.row.disabled"
                        active-color="#409EFF">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleEdit(scope.$index)"
                    type="text"
                    size="medium">
                        编辑
                    </el-button>
                    <el-button
                    @click.native.prevent="handleSave(scope.$index,scope.row)"
                    type="text"
                    size="medium">
                        保存
                    </el-button>
                    <el-button
                    @click.native.prevent="setCurrentRoleMenu(scope.$index,scope.row)"
                    type="text"
                    size="medium">
                        分配权限
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分配权限 -->
        <el-dialog title="权限管理" :visible.sync="formDialogVisible" @close='resetFormDialog' :close-on-click-modal='false'>
            <el-tree
                :data="menusData"
                show-checkbox
                default-expand-all
                node-key="menu_type"
                ref="menuTree"
                highlight-current
                check-strictly
                :props='defaultProps'
                >
            </el-tree>
            <div class="btns">
                <el-button type="primary" class='submit_btn' @click='saveMenuHandle'>保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {mapActions,mapMutations} from 'vuex';
    import {member_role,add_role,role_access} from '@/service/getData';
    import { setStore } from '@/utils/';

    export default{
        name:'role',
        data(){
            return{
                roleLists:[],
                menusData:[],//权限列表
                currentRoleIndex:'',//当前分配权限的角色索引
                defaultProps: {
                    id:'menu_type',
                    label: 'menu_title'
                },
                submitBtnStatus:false,
                formDialogVisible:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapMutations([
                'SETMEMBERROLES'
            ]),
            ...mapActions([
                'updateMemberRoles'
            ]),
            async init(){
                try {
                    let that = this;
                    let res = await member_role();
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
                    if(res.success && res.success.member_role){
                        res.success.member_role.forEach( function(el, index) {
                            el.disabled = el.disabled === 'true'?true:false;
                            el.editFlag = false;
                        });
                        this.roleLists = res.success.member_role;
                    }else{
                        this.roleLists = [];
                    }
                    if(res.success && res.success.menus){
                        this.menusData = res.success.menus;
                    }
                    let tempLists = [];
                    this.roleLists.forEach( function(el2, index) {
                        if(el2.disabled){
                            tempLists.push(el2);
                        }
                    });
                    setStore("memberRoles",tempLists);
                    this.SETMEMBERROLES(tempLists);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertRole(){//新增记录
                this.roleLists.push({editFlag:true,disabled:true});
            },
            handleEdit(index){//设置单元格可编辑
                this.roleLists[index].editFlag = true;
                this.$set(this.roleLists,index,this.roleLists[index]);
            },
            async handleSave(index,formData){//保存
                try {
                    if(this.submitBtnStatus){
                        return false;
                    }
                    if(!formData.name || formData.name === ''){
                        this.$message({
                            message: '等级名称不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    if(!formData.lv_code || formData.lv_code === ''){
                        this.$message({
                            message: '等级代码不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    this.submitBtnStatus = true;
                    const res = await add_role(formData);
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
                    if(res.success){
                        this.$message({
                            message:res.success,
                            type:'success'
                        });
                        let resData = res.data;
                        resData.editFlag = false;
                        resData.disabled = res.data.disabled === 'true'?true:false;
                        this.$set(this.roleLists,index,resData);
                        if(resData && resData.disabled === 'true'){
                            this.updateMemberRoles(resData);
                        }
                    }
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            setCurrentRoleMenu(index,currentRow){//分配权限
                this.currentRoleIndex = index;
                let checkedKeys = currentRow.workground?currentRow.workground:[];
                this.formDialogVisible = true;
                this.$nextTick(function(){
                   this.$refs['menuTree'].setCheckedKeys(checkedKeys); 
                });
            },
            resetFormDialog(){

            },
            async saveMenuHandle(){
                try {
                    if(this.submitBtnStatus){
                        return false;
                    }
                    const that = this;
                    let formData = {};
                    formData.workground = this.$refs['menuTree'].getCheckedKeys();
                    formData.member_role_id = this.roleLists[this.currentRoleIndex].member_role_id;
                    this.submitBtnStatus = true;
                    const res = await role_access(formData);
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
                    if(res.success){
                        this.$message({
                            message:res.success,
                            type:'success'
                        });
                        this.$set(this.roleLists[this.currentRoleIndex],'workground',res.data);
                        setTimeout(function(){
                            that.formDialogVisible = false;
                        },500);
                    }
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .role_container{
        padding: 20px 30px;
    }
    .add_source{
        margin-bottom: 20px;
    }
    .btns{
        text-align: center;
    }
</style>