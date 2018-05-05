<template>
    <section class="customerSource_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertCustomSource'>新建来源记录</el-button>
        <el-table
            :data="sourceLists"
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
                prop="id"
                label="id"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                label="来源名称"
                >
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.name"></el-input>
                    </span>
                    <span v-else>{{scope.row.name}}</span>
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
                prop="createtime"
                label="创建时间">
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
    import {mapActions,mapMutations} from 'vuex';
    import {source_index,source_save} from '@/service/getData';
    import { setStore } from '@/utils/';

    export default{
        name:'customerSource',
        data(){
            return{
                sourceLists:[],
                submitBtnStatus:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapMutations([
                'SETCUSTOMSOURCE'
            ]),
            ...mapActions([
                'updateCustomSource'
            ]),
            async init(){
                try {
                    let that = this;
                    let res = await source_index();
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
                        this.sourceLists = res.success;
                    }else{
                        this.sourceLists = [];
                    }
                    setStore("customSource",this.sourceLists);
                    this.SETCUSTOMSOURCE(this.sourceLists);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertCustomSource(){//新增记录
                this.sourceLists.push({editFlag:true,disabled:true});
            },
            handleEdit(index){//设置单元格可编辑
                this.sourceLists[index].editFlag = true;
                Vue.set(this.sourceLists,index,this.sourceLists[index]);
            },
            async handleSave(index,formData){//保存
                try {
                    if(this.submitBtnStatus){
                        return false;
                    }
                    if(formData.name === ''){
                        this.$message({
                            message: '来源名称不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    this.submitBtnStatus = true;
                    const res = await source_save(formData);
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
                        this.updateCustomSource(res.data);
                        let resData = res.data;
                        resData.editFlag = false;
                        resData.disabled = res.data.disabled === 'true'?true:false;
                        Vue.set(this.sourceLists,index,resData);
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