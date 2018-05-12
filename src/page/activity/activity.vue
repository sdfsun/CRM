<template>
    <section class="customerSource_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertCustomSource'>新建活动</el-button>
        <el-table
            :data="activityLists"
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
                prop="title"
                label="活动主题"
                min-width='130px'
                >
            </el-table-column>
            <el-table-column
                prop='content'
                label="活动内容"
                min-width='180px'
                >
            </el-table-column>
            <el-table-column
                prop="start_time"
                label="开始时间"
                min-width='160px'>
            </el-table-column>
            <el-table-column
                prop="end_time"
                label="结束时间"
                min-width='160px'>
            </el-table-column>
            <el-table-column
                prop="disabled_name"
                label="是否激活">
            </el-table-column>
            <el-table-column
                prop="org_name"
                label="所属门店"
                min-width='150px'>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
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
        <el-dialog title="活动" :visible.sync="activityDialogVisible" @close='resetActivityEdit'>
            <activityEdit  v-on:closeActivityInfoDialog='updateActivityRecord' :editInfos='currentrow' ref='activityEdit'></activityEdit>
        </el-dialog>
    </section>
</template>
<script>
    import {mapMutations,mapState} from 'vuex';
    import {activitys} from '@/service/getData';
    import activityEdit from '@/components/activity/activityEdit';
    import { setStore ,formatDate ,getDuration} from '@/utils/';

    export default{
        name:'activity',
        data(){
            return{
                activityLists:[],
                currentrow:{},
                activityDialogVisible:false
            }
        },
        mounted(){
            this.init();
        },
        computed:{
            ...mapState([
                'memberRoleId'
            ])
        },
        methods:{
            ...mapMutations([
                'SETACTIVITYS'
            ]),
            async init(){
                try {
                    let that = this;
                    let res = await activitys();
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
                        this.activityLists = res.success;
                    }else{
                        this.activityLists = [];
                    }
                    let tempLists = [],curDate = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                    this.activityLists.forEach( function(el, index) {
                        if(that.memberRoleId.org_id === el.org_id && el.disabled === 'true'){
                            let tempDuration = getDuration(curDate,el.end_time);
                            if(tempDuration !== -1){
                                tempLists.push(el);
                            }
                        }
                    });
                    setStore("activitys",tempLists);
                    this.SETACTIVITYS(tempLists);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertCustomSource(){//新增记录
                this.currentrow = {};
                this.activityDialogVisible = true;
            },
            handleEdit(curRow){//编辑
                this.currentrow = Object.assign({},curRow);
                if(this.currentrow.image_id && this.currentrow.image_id.length>0){
                    this.currentrow.image_id = this.currentrow.image_id.slice();
                    let imageLists = [];
                    this.currentrow.image_id.forEach( function(item, index) {
                        imageLists.push({url:item});
                    });
                    this.currentrow.imageLists = imageLists.slice();
                }else{
                    this.currentrow.image_id = [];
                }
                this.activityDialogVisible = true;
            },
            resetActivityEdit(){//重置用户表单数据
                this.currentrow = {};
                this.$refs['activityEdit'].$refs['activityForm'].resetFields();
            },
            updateActivityRecord(callbackData){//更新用户记录
                this.activityDialogVisible = false;
                if(callbackData.data){
                    if(callbackData.type === 'add'){
                        this.activityLists.push(callbackData.data);
                    }else{//编辑
                        const index = this.activityLists.findIndex(function(item, index, arr) {
                            return item.id === callbackData.data.id;
                        });
                        this.$set(this.activityLists,index,callbackData.data);
                    }
                }
            }
        },
        components:{
            activityEdit
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