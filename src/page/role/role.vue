<template>
    <section class="customerSource_container">
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
                >
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.name"></el-input>
                    </span>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="描述">
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.remark"></el-input>
                    </span>
                    <span v-else>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="等级代码">
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.lv_code"></el-input>
                    </span>
                    <span v-else>{{scope.row.lv_code}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="是否开启"
                >
                <template slot-scope='scope'>
                    <el-switch
                        v-model="scope.row.disabled"
                        active-color="#409EFF">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
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
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import Vue from 'vue';
    import {mapActions} from 'vuex';
    import {member_role,add_role} from '@/service/getData';

    export default{
        name:'role',
        data(){
            return{
                roleLists:[],
                submitBtnStatus:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
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
                    if(formData.name === ''){
                        this.$message({
                            message: '等级名称不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    if(formData.lv_code === ''){
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
                        this.updateMemberRoles(resData);
                        resData.editFlag = false;
                        resData.disabled = res.data.disabled === 'true'?true:false;
                        this.$set(this.roleLists,index,resData);
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
    .customerSource_container{
        padding: 20px 30px;
    }
    .add_source{
        margin-bottom: 20px;
    }
</style>