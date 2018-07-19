<template>
    <section class="authority_container">
        <el-button type="primary" icon='el-icon-plus' class='add_btn' @click='insertAuthority(1)'>新建菜单</el-button>
        <el-table
            :data="authorityLists"
            stripe
            border
            header-row-class-name='header_row_style'>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                        :data="authorityLists[props.$index].menus"
                        stripe
                        border
                        header-row-class-name='header_row_style'>
                        <el-table-column
                            type="index"
                            :index="1"
                            label='序号'
                            min-width='50'>
                        </el-table-column>
                        <el-table-column
                            prop='menu_title'
                            label="菜单名称"
                            min-width='120'>
                        </el-table-column>
                        <el-table-column
                            prop='menu_url'
                            label="菜单路径">
                        </el-table-column>
                        <el-table-column
                            prop='menu_type'
                            label="菜单类型">
                        </el-table-column>
                        <el-table-column
                            label="是否开启"
                            min-width='70'>
                            <template slot-scope='scope'>
                                <span v-if='scope.row.disabled === "true"'>激活</span>
                                <span v-else>关闭</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="60">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="handleEdit(2,scope.row)"
                                type="text"
                                size="medium">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100'>
            </el-table-column>
            <el-table-column
                prop='menu_title'
                label="菜单名称">
            </el-table-column>
            <el-table-column
                prop='menu_type'
                label="菜单类型">
            </el-table-column>
            <el-table-column
                label="是否开启">
                <template slot-scope='scope'>
                    <span v-if='scope.row.disabled === "true"'>激活</span>
                    <span v-else>关闭</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleEdit(1,scope.row)"
                    type="text"
                    size="medium">
                        编辑
                    </el-button>
                    <el-button
                    @click.native.prevent="insertAuthority(2,scope.row.menu_title)"
                    type="text"
                    size="medium">
                        添加子菜单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加菜单 -->
        <el-dialog title="菜单管理" :visible.sync="menuDialogVisible" @close='resetMenuForm' class='updateMenu_dialog' :close-on-click-modal='false'>
            <el-form ref="updateMenuForm" :model="updateMenuForm" :rules='formItemRules' label-width="90px">
                <el-form-item prop='menu_title' label='菜单名称'>
                    <el-input  v-model="updateMenuForm.menu_title" placeholder='请输入菜单名称' clearable></el-input>
                </el-form-item>
                <el-form-item prop='menu_type' label='菜单类型'>
                    <el-input  v-model="updateMenuForm.menu_type" placeholder='请输入菜单类型' clearable></el-input>
                </el-form-item>
                <template  v-if='type !== 1'>
                    <el-form-item prop='menu_url' label='菜单路径'>
                        <el-input  v-model="updateMenuForm.menu_url" placeholder='请输入菜单路径' clearable></el-input>
                    </el-form-item>
                </template>
                <el-form-item prop='parent_id' label='父节点' v-if='type !== 1'>
                    <el-select v-model="updateMenuForm.parent_id" placeholder="请选择父节点" clearable>
                        <el-option
                            v-for="item in authorityLists"
                            :key="item.menu_id"
                            :label="item.menu_title"
                            :value="item.menu_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='menu_order' label='菜单排序'>
                    <el-input  v-model="updateMenuForm.menu_order" placeholder='数值越小越靠前' clearable></el-input>
                </el-form-item>
                <el-form-item prop='disabled' label='是否激活'>
                    <el-switch
                        v-model="updateMenuForm.disabled"
                        active-color="#409EFF">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmitForm" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {menus,add_menus} from '@/service/getData';

    export default{
        name:'authority',
        data(){
            return{
                type:1,//1为父级菜单 2为子菜单
                currentIndex:0,//当前新增或编辑的子菜单索引
                authorityLists:[],
                updateMenuForm:{
                    menu_title:'',//菜单名称
                    menu_type:'',//菜单类型
                    parent_id:'0',//父节点
                    menu_url:'',//子菜单url
                    menu_order:'0',//排序
                    disabled:true
                },
                formItemRules:{
                    menu_title: [
                        {  required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    menu_type: [
                        {  required: true, message: '请输入菜单类型', trigger: 'blur' }
                    ],
                    parent_id: [
                        {  required: true, message: '请选择父节点', trigger: 'change' }
                    ],
                    menu_url: [
                        {  required: true, message: '请输入子菜单路径', trigger: 'blur' }
                    ]
                },
                menuDialogVisible:false,
                submitBtnStatus:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){//menus
                try {
                    let that = this;
                    let res = await menus();
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
                    if(res.success){
                        this.authorityLists = res.success;
                    }else{
                        this.authorityLists = [];
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertAuthority(type,parent_title){//新增菜单
                this.type = type;
                this.updateMenuForm = Object.assign({},{disabled:true,menu_order:'0'});
                if(parent_title){
                    const item = this.authorityLists.find((item)=>item.menu_title === parent_title);
                    if(item){
                        this.updateMenuForm.parent_id = item.menu_id;  
                    }else{
                        this.$message({
                            showClose:true,
                            message: '数据有误',
                            type: 'error'
                        });
                    }
                }else{
                    this.updateMenuForm.parent_id = '0';
                }
                this.menuDialogVisible = true;
            },
            handleEdit(type,currentRow){//编辑父菜单
                this.type = type;
                this.updateMenuForm = Object.assign({},currentRow);
                this.updateMenuForm.disabled = this.updateMenuForm.disabled === 'true'?true:false;
                if(type === 1){//编辑父菜单
                    this.updateMenuForm.parent_id = '0';
                }else{//编辑子菜单
                    this.updateMenuForm.parent_id = currentRow.parent_id;
                }
                this.menuDialogVisible = true;
            },
            resetMenuForm(){
                this.$refs['updateMenuForm'].resetFields();//重置表单数据
                delete this.updateMenuForm['menu_id'];
                delete this.updateMenuForm['createtime'];
                delete this.updateMenuForm['update_time'];
            },
            onSubmitForm(){//提交表单
                let that = this;
                if(that.submitBtnStatus){
                    return false;
                }
                that.$refs['updateMenuForm'].validate((valid) => {
                    if (valid) {
                        that.submitBtnStatus = false;
                        delete that.updateMenuForm['menus'];
                        add_menus(that.updateMenuForm).then(res=>{
                            that.submitBtnStatus = false;
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
                            this.authorityLists = res.data;
                            this.menuDialogVisible = false;
                            that.resetMenuForm();
                        }).catch(error=>{
                            this.submitBtnStatus = false;
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
    .authority_container{
        padding: 20px 60px;
    }
    .add_btn{
        margin-bottom: 20px;
    }
    .btns{
        text-align: center;
    }
</style>