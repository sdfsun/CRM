<template>
    <div class="programme_container">
        <el-table
            :data="programmeRecords"
            stripe
            highlight-current-row
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
                prop="final_disabled_name"
                label="是否最终定案">
            </el-table-column>
            <el-table-column
                label="操作"
                width="160">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="handleSave(scope.row.id,'false')"
                    type="text"
                    size="medium"
                    class="verdict-btn"
                    v-if="infomation.status && infomation.status[infomation.status.length-1]<17">
                        初次定案
                    </el-button>
                    <el-button
                    @click.native.prevent="handleSave(scope.row.id,'true')"
                    type="text"
                    size="medium"
                    class="verdict-btn">
                        最终定案
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addprogrammeRecord'>新建方案记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editprogrammeRecord("1")'>编辑</el-button>
            <el-button type="primary"  @click='editprogrammeRecord("2")'>查看</el-button>
        </div>
        <el-dialog title="方案记录" :visible.sync="programmeDialogVisible" class='customRelationInfoDialog programmeEditDialog' @close='resetProgrammeEdit' :close-on-click-modal='false'>
            <programmeEdit :informationItem='infomation' :editInfos='editActiveRow' ref='programmeEdit'  v-on:closeCustomProgrammeInfoDialog='updateProgrammeRecord'></programmeEdit>
        </el-dialog>
    </div>
</template>
<script>
    import programmeEdit from '@/components/custom/programme/programmeEdit';
    import {programme_detail,confirm_scheme} from '@/service/getData';
    import {getUploadIcon} from '@/utils/index';

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
                this.editActiveRow.type = "1";
                this.programmeDialogVisible = true;
            },
            async editprogrammeRecord(type){//编辑方案记录
                let that = this;
                if(!this.currentrow){
                    let msg = type==='2'?'查看':'编辑';
                    this.$message({
                        message:'请先选中需要'+msg+'的方案记录！',
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
                    //渲染效果明细的图片列表
                    this.editActiveRow.scheme.forEach( function(se, si) {
                        // se.image_url = se.image_url.slice();
                        if(se.image_url && se.image_url.length>0){
                            let seLists = [];
                            se.image_url.forEach( function(sUrl, sIndex) {
                                let retUrl = getUploadIcon(sUrl);
                                if(retUrl){
                                    seLists.push({url:retUrl,image_id:sUrl});
                                }else{
                                    seLists.push({url:sUrl,image_id:sUrl});
                                }
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
                                let retUrl = getUploadIcon(rUrl);
                                if(retUrl){
                                    reLists.push({url:retUrl,image_id:rUrl});
                                }else{
                                    reLists.push({url:rUrl,image_id:rUrl});
                                }
                            });
                            re.imageLists = reLists;
                        }
                    });
                    this.editActiveRow.type = type;
                    setTimeout(function(){
                        that.programmeDialogVisible = true;
                    },300);
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
            async handleSave(id,final){//定案
                try {
                    const res = await confirm_scheme(id,final);
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
                    this.$emit('updateCustomProgrammeRecords',{id:id,final:final,data:res.data});
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
        padding: 16px 40px 16px 0;
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
    .verdict-btn{
        padding: 0;
    }
</style>