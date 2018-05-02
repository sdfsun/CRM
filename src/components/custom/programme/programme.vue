<template>
    <div class="programme_container">
        <el-table
            :data="programmeRecords"
            stripe
            highlight-current-row
            style="width: 100%;text-align: center;flex:1;"
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange">
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100px'
                >
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号"
                v-if='false'
                >
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间"
                >
            </el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间">
            </el-table-column>
            <el-table-column
                prop="disabled_name"
                label="是否定案">
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleSave(scope.row.id)"
                    type="text"
                    size="medium">
                        定案
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addprogrammeRecord'>新建方案记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editprogrammeRecord'>编辑</el-button>
        </div>
        <el-dialog title="方案记录" :visible.sync="programmeDialogVisible" class='customRelationInfoDialog programmeEditDialog' @close='resetProgrammeEdit'>
            <programmeEdit :informationItem='infomation' :editInfos='editActiveRow' ref='programmeEdit'  v-on:closeCustomProgrammeInfoDialog='updateProgrammeRecord'></programmeEdit>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import programmeEdit from '@/components/custom/programme/programmeEdit';
    import {programme_detail,confirm_scheme} from '@/service/getData';

    export default{
        name:'programme',
        props:['programmeRecords','infomation'],
        data(){
            return{
                programmeDialogVisible:false,
                programmeImageDialogVisible:false,
                image_url:'',
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addprogrammeRecord(){//新增方案记录
                this.editActiveRow = {};
                this.editActiveRow.status = this.infomation.status;
                this.programmeDialogVisible = true;
            },
            async editprogrammeRecord(){//编辑方案记录
                if(!this.currentrow){
                    this.$message({
                        message:'请先选中需要编辑的方案记录！',
                        type:'error'
                    });
                    return false;
                }
                try {
                    const res = await programme_detail(this.currentrow.id);
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
                    this.editActiveRow = Object.assign({},res.success);
                    this.editActiveRow.status = this.infomation.status;
                    // this.editActiveRow.relevant_data = res.success.relevant_data.slice();
                    // this.editActiveRow.scheme = res.success.scheme.slice();
                    //渲染效果明细的图片列表
                    this.editActiveRow.scheme.forEach( function(se, si) {
                        // se.image_url = se.image_url.slice();
                        if(se.image_url && se.image_url.length>0){
                            let seLists = [];
                            se.image_url.forEach( function(sUrl, sIndex) {
                                seLists.push({url:sUrl});
                            });
                            se.imageLists = seLists;
                        }
                    });
                    //渲染相关资料的图片列表
                    this.editActiveRow.relevant_data.forEach( function(re, ri) {
                        // re.image_url = re.image_url.slice();
                        if(re.image_url && re.image_url.length>0){
                            let reLists = [];
                            re.image_url.forEach( function(rUrl, rIndex) {
                                reLists.push({url:rUrl});
                            });
                            re.imageLists = reLists;
                        }
                    });
                    this.programmeDialogVisible = true;
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            updateProgrammeRecord(callbackData){
                this.programmeDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:4});
                }
            },
            resetProgrammeEdit(){//重置表单数据
                this.editActiveRow = {};
                // this.images =[];
                this.$refs['programmeEdit'].$refs['programmeForm'].resetFields();
            },
            async handleSave(id){//定案
                try {
                    const res = await confirm_scheme(id);
                    if(res.error){
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        return false;
                    }
                    this.$message({
                        message:res.success,
                        type:'success'
                    });
                    this.$emit('updateCustomProgrammeRecords',id);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        },
        components:{
            programmeEdit
        }
    }
</script>
<style scoped>
    .programme_container{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .btns{
        text-align: right;
        padding: 26px 40px 25px 0;
    }
    .image_item_icon{
        position: absolute;
        right: 15px;
        bottom: 24px;
        color: #fff;
    }
    .image_carousel_item{
        width: 100%;
    }
</style>