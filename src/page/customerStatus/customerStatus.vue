<template>
    <section class="customerSource_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertCustomSource'>新建状态记录</el-button>
        <el-table
            :data="statusLists"
            stripe
            border
            header-row-class-name='header_row_style'>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                        :data="props.row.menus"
                        stripe
                        border
                        header-row-class-name='header_row_style'>
                        <el-table-column
                            type="index"
                            :index="1"
                            label='序号'
                            min-width='120'>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="状态名称"
                            min-width='120'>
                            <template slot-scope='scope'>
                            <span v-if='scope.row.editFlag'>
                                <el-input  v-model="scope.row.name"></el-input>
                            </span>
                                <span v-else>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="state_order"
                            label="排序"
                            min-width='120'>
                            <template slot-scope='scope'>
                            <span v-if='scope.row.editFlag'>
                                <el-input  v-model="scope.row.state_order"></el-input>
                            </span>
                                <span v-else>{{scope.row.state_order}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="parent_id"
                            label="父级菜单"
                            min-width='150'>
                            <template slot-scope='scope'>
                                <el-select v-model="scope.row.parent_id" placeholder="请选择父节点" clearable v-if='scope.row.editFlag'>
                                    <el-option
                                        v-for="item in statusLists"
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
                label="状态名称"
                min-width="120px">
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.name"></el-input>
                    </span>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="state_order"
                    label="排序"
                    min-width='120'>
                <template slot-scope='scope'>
                    <span v-if='scope.row.editFlag'>
                        <el-input  v-model="scope.row.state_order"></el-input>
                    </span>
                <span v-else>{{scope.row.state_order}}</span>
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
    import {state_index,state_save} from '@/service/getData';
    import { setStore } from '@/utils/';

    export default{
        name:'customerStatus',
        data(){
            return{
                statusLists:[],
                submitBtnStatus:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapMutations([
                'SETCUSTOMSTATUS'
            ]),
            setStatusDatas(suc){
                let tempDatas = JSON.parse(JSON.stringify(suc));
                setStore("customStatus",tempDatas);
                this.SETCUSTOMSTATUS(tempDatas);
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
                    this.statusLists = suc;
                }else{
                    this.statusLists = [];
                }
            },
            async init(){
                try {
                    let that = this;
                    let res = await state_index();
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
                    this.setStatusDatas(res.success);
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertAuthority(index,parent_id) {//新增子级
                this.statusLists[index].menus.push({editFlag:true,is_open:true,parent_id:parent_id})
            },
            insertCustomSource(){//新增父级记录
                this.statusLists.push({editFlag:true,is_open:true,parent_id:'0'});
            },
            handleEdit(pindex,cindex,type){//设置单元格可编辑
                try {
                    if(type){//子菜单
                        this.statusLists[pindex].menus[cindex].editFlag = true;
                        this.$set(this.statusLists[pindex].menus,cindex,this.statusLists[pindex].menus[cindex]);
                    }else{//父菜单
                        this.statusLists[pindex].editFlag = true;
                        this.$set(this.statusLists,pindex,this.statusLists[pindex]);
                    }
                }catch (e) {
                    this.$message({
                        showClose:true,
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
                            showClose:true,
                            message: '状态名称不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    if(formData.parent_id === ''){
                        this.$message({
                            showClose:true,
                            message: '父级菜单不能为空',
                            type: 'error'
                        });
                        return false;
                    }
                    this.submitBtnStatus = true;
                    const res = await state_save(formData);
                    this.submitBtnStatus = false;
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
                        message: res.success,
                        type: 'success'
                    });
                    this.setStatusDatas(res.data);
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handleDelete(pindex,cindex,type){//删除未保存的数据
                try {
                    if(type){//子菜单
                        this.statusLists[pindex].menus.splice(cindex,1);
                    }else{//父菜单
                        this.statusLists.splice(pindex,1);
                    }
                }catch (e) {
                    this.$message({
                        showClose:true,
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