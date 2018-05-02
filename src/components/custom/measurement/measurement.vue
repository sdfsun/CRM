<template>
    <div class="measurement_container">
        <el-table
            :data="measurementRecords"
            stripe
            highlight-current-row
            style="width: 100%;text-align: center;flex:1;"
            header-row-class-name='header_row_style'
            @current-change="handleCurrentChange"
            @cell-click='cellClickHandle'>
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
                prop="measure_name"
                label="测量人"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="measure_time"
                label="测量起始时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="end_time"
                label="测量结束时间"
                min-width='160'>
            </el-table-column>
            <el-table-column
                prop="duration"
                label="测量时长"
                min-width='160'>
            </el-table-column>
            <el-table-column
                label="量尺图片"
                min-width='118px'>
                <template slot-scope="scope" v-if='scope.row.image_id && scope.row.image_id.length>0'>
                    <img :src="scope.row.image_id[0]" width="100%" height="87" />
                    <i class="el-icon-zoom-in image_item_icon"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="information"
                label="量尺信息"
                min-width='200px'
                >
            </el-table-column>
            <el-table-column
                prop="feedback"
                label="信息回馈"
                min-width='200px'
                :show-overflow-tooltip='true'>
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' @click='addMeasurementRecord'>新建测量记录</el-button>
            <el-button type="primary"  class='add_custom' @click='editMeasurementRecord'>编辑</el-button>
        </div>
        <el-dialog title="测量记录" :visible.sync="measurementDialogVisible" class='customRelationInfoDialog' @close='resetMeasurementEdit'>
            <measurementEdit :informationItem='infomation' :editInfos='editActiveRow' ref='measurementEdit'  v-on:closeCustomMeasurementInfoDialog='updateMeasurementRecord'></measurementEdit>
        </el-dialog>
        <el-dialog title="量尺图片" :visible.sync="measurementImageDialogVisible">
            <el-carousel height="400px" :autoplay='false'>
                <el-carousel-item v-for="(item,index) in images" :key="index">
                    <img :src="item" class="image_carousel_item">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import measurementEdit from '@/components/custom/measurement/measurementEdit';

    export default{
        name:'measurement',
        props:['measurementRecords','infomation'],
        data(){
            return{
                measurementDialogVisible:false,
                measurementImageDialogVisible:false,
                images:[],
                editActiveRow:{},//当前需要编辑的行
                currentrow:null
            }
        },
        methods:{
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                this.currentrow = currentrow;
            },
            addMeasurementRecord(){//新增测量记录
                this.editActiveRow = {};
                this.editActiveRow.status = this.infomation.status;
                this.measurementDialogVisible = true;
            },
            editMeasurementRecord(){//编辑测量记录
                if(!this.currentrow){
                    this.$message({
                        message:'请先选中需要编辑的测量记录！',
                        type:'error'
                    });
                    return false;
                }
                this.editActiveRow = Object.assign({},this.currentrow);
                this.editActiveRow.status = this.infomation.status;
                if(this.editActiveRow.image_id && this.editActiveRow.image_id.length>0){
                    this.editActiveRow.image_id = this.currentrow.image_id.slice();
                    let imageLists = [];
                    this.editActiveRow.image_id.forEach( function(item, index) {
                        imageLists.push({url:item});
                    });
                    // Object.assign(this.editActiveRow,{imageLists:imageLists});
                    this.editActiveRow.imageLists = imageLists.slice();
                }else{
                    this.editActiveRow.image_id = [];
                }
                this.measurementDialogVisible = true;
            },
            updateMeasurementRecord(callbackData){
                this.measurementDialogVisible = false;
                if(callbackData.data){//信息保存后回调
                    this.$emit('updateCustomRelationRecords',{data:callbackData.data,type:callbackData.type,num:2});
                }
            },
            resetMeasurementEdit(){//重置表单数据
                this.editActiveRow = {};
                // this.images =[];
                this.$refs['measurementEdit'].$refs['measurementForm'].resetFields();
            },
            cellClickHandle(row, column, cell, event){
                if(column.label === '量尺图片'){
                    if(row.image_id){
                        this.measurementImageDialogVisible = true;
                        this.images = Object.assign({}, row.image_id);
                    }
                }
            }
        },
        components:{
            measurementEdit
        }
    }
</script>
<style scoped>
    .measurement_container{
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