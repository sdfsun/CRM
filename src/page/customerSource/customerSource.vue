<template>
    <section class="customerSource_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertCustomSource'>新建来源记录</el-button>
        <el-table
            :data="sourceLists"
            stripe
            border
            style="width: 100%;text-align: center;flex:1;overflow: auto;"
            header-row-class-name='header_row_style'>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                        :data="props.row.menus"
                        stripe
                        border
                        style="width: 100%;text-align: center;flex:1;overflow: auto;border-bottom: 1px solid #ebeef5;"
                        header-row-class-name='header_row_style'>
                        <el-table-column
                            type="index"
                            :index="1"
                            label='序号'
                            min-width='120'>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="来源名称"
                            min-width='120'>
                            <template slot-scope='scope'>
                            <span v-if='scope.row.editFlag'>
                                <el-input  v-model="scope.row.name"></el-input>
                            </span>
                                <span v-else>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="source_order"
                            label="排序"
                            min-width='120'>
                            <template slot-scope='scope'>
                            <span v-if='scope.row.editFlag'>
                                <el-input  v-model="scope.row.source_order"></el-input>
                            </span>
                                <span v-else>{{scope.row.source_order}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="parent_id"
                            label="父级菜单"
                            min-width='120'>
                            <template slot-scope='scope'>
                                <el-select v-model="scope.row.parent_id" placeholder="请选择父节点" clearable v-if='scope.row.editFlag'>
                                    <el-option
                                        v-for="item in sourceLists"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <span v-else>{{props.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="is_open"
                            label="是否开启"
                            min-width='120'>
                            <template slot-scope='scope'>
                                <el-switch
                                    v-model="scope.row.is_open"
                                    active-color="#409EFF">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            min-width="140">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="handleEdit(props.$index,scope.$index,'child')"
                                    type="text"
                                    size="medium">
                                    编辑
                                </el-button>
                                <el-button
                                    @click.native.prevent="handleSave(scope.row)"
                                    type="text"
                                    size="medium">
                                    保存
                                </el-button>
                                <el-button
                                    @click.native.prevent="handleDelete(props.$index,scope.$index,'child')"
                                    type="text"
                                    size="medium"
                                    v-if="!scope.row.id">
                                    删除
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
                min-width='120px'>
            </el-table-column>
            <el-table-column
                prop="name"
                label="来源名称"
                min-width="120px">
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.name"></el-input>
                    </span>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="source_order"
                    label="排序"
                    min-width='120'>
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.source_order"></el-input>
                    </span>
                <span v-else>{{scope.row.source_order}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="is_open"
                label="是否开启"
                min-width="120px">
                <template slot-scope='scope'>
                    <el-switch
                        v-model="scope.row.is_open"
                        active-color="#409EFF">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="140">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleEdit(scope.$index)"
                    type="text"
                    size="medium">
                        编辑
                    </el-button>
                    <el-button
                    @click.native.prevent="handleSave(scope.row)"
                    type="text"
                    size="medium">
                        保存
                    </el-button>
                    <el-button
                        @click.native.prevent="handleDelete(scope.$index)"
                        type="text"
                        size="medium"
                        v-if="!scope.row.id">
                        删除
                    </el-button>
                    <el-button
                        @click.native.prevent="insertAuthority(scope.$index,scope.row.id)"
                        type="text"
                        size="medium">
                        添加子菜单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import {mapMutations} from 'vuex';
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
            setSourceDatas(suc,res){
                const tempDatas = res.slice(0);
                setStore("customSource",tempDatas);
                this.SETCUSTOMSOURCE(tempDatas);
                if(suc){
                    suc.forEach( function(el, index) {
                        el.is_open = el.is_open === 'true'?true:false;
                        el.editFlag = false;
                        if(el.menus && el.menus.length>0){
                            el.menus.forEach(function (item) {
                                item.is_open = item.is_open === 'true'?true:false;
                                item.editFlag = false;
                            });
                        }else{
                            el.menus = [];
                        }
                    });
                    this.sourceLists = suc;
                }else{
                    this.sourceLists = [];
                }
            },
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
                    this.setSourceDatas(res.success,res.dataSources);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertAuthority(index,parent_id) {//新增子级
                try {
                    this.sourceLists[index].menus.push({editFlag:true,is_open:true,parent_id:parent_id});
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertCustomSource(){//新增父级记录
                this.sourceLists.push({editFlag:true,is_open:true,parent_id:'0'});
            },
            handleEdit(pindex,cindex,type){//设置单元格可编辑
                try {
                    if(type){//子菜单
                        this.sourceLists[pindex].menus[cindex].editFlag = true;
                        this.$set(this.sourceLists[pindex].menus,cindex,this.sourceLists[pindex].menus[cindex]);
                    }else{//父菜单
                        this.sourceLists[pindex].editFlag = true;
                        this.$set(this.sourceLists,pindex,this.sourceLists[pindex]);
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async handleSave(formData){//保存
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
                    if(formData.parent_id === ''){
                        this.$message({
                            message: '父级菜单不能为空',
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
                    this.$message({
                        message: res.success,
                        type: 'success'
                    });
                    this.setSourceDatas(res.data,res.dataSources);
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handleDelete(pindex,cindex,type){//删除未保存的数据
                try {
                    if(type){//子菜单
                        this.sourceLists[pindex].menus.splice(cindex,1);
                    }else{//父菜单
                        this.sourceLists.splice(pindex,1);
                    }
                }catch (e) {
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