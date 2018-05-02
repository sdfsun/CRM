<template>
    <div class="page_hours">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的日程" name="first">
                <div class="hours_box">
                    <input type="hidden" id="datepicker"/>
                    <div class="h_footer">
                        <el-button type="primary" class="h_request" @click="postPaidan">请求派单</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="所有日程" name="second">
                <div class="all_box">
                    <input type="hidden" id="datepicker1"/>
                </div>
                <div class="h_left">
                    <div class="h_hd">日程列表</div>
                    <div class="h_ct">
                        <el-table
                          :data="tableData"
                          style="width: 100%">
                            <el-table-column
                                prop="login_account"
                                label="工号"></el-table-column>
                            <el-table-column
                                prop="name"
                                label="姓名"></el-table-column>
                            <el-table-column
                                prop="mobile"
                                label="电话"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { getVisitInit,postVisitSave,getAllPlan } from '@/service/getData';
import {Pikaday} from '@/utils/date';
export default {
    data() {
        return {
            activeName: 'first',
            options: [{
                value: '选项1',
                label: '上门测量'
            }, {
                value: '选项2',
                label: '设计沟通'
            }],
            startTime:'',
            endTime:'',
            sendDate:[],
            tableData:[]
        }
    },
    created(){
        document.body.style.background = "#f7f7f7"
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init()
        })
    },
    methods: {
        handleClick(tab, event) {
            // if(tab.index == 1){
            //     this.allDatePlane(this.startTime.replace(/\-/g,''));
            // }
        },
        async init(){
            try {
                let res = await getVisitInit();
                if(res.error){
                    this.$message({
                        message: res.error,
                        type: 'error'
                    });
                }else{
                    this.startTime = res.success.date;
                    for(var i=0;i<res.success.checkdate.length;i++){
                        this.sendDate.push(res.success.checkdate[i].work_date);
                    };
                    this.endTimeFun();
                    this.initday();
                }
            } catch(e) {
                this.$message({
                    showClose: true,
                    message: e,
                    type: 'error'
                });
            }
        },
        endTimeFun(){
            var timestamp = new Date(this.startTime).getTime();
            var endTamp = new Date(timestamp + 3600*24*3*1000);
            var y = endTamp.getFullYear();
            var m = endTamp.getMonth() + 1;
            var d = endTamp.getDate();
            this.endTime = y + '-' + m + '-' + d
        },
        async postPaidan(){
            let result = await postVisitSave({'work_date':this.sendDate});
            if(result.success){
                this.$message({
                    message: '恭喜你，' + result.success,
                    type: 'success'
                });
            }else{
                this.$message({
                    message: result.error,
                    type: 'error'
                });
            }
        },
        async allDatePlane(date){
            let result = await getAllPlan({'work_data':date});
            this.tableData = result.success;
            if(result.error){
                this.$message({
                    message: result.error,
                    type: 'error'
                });
            }
        },
        hasClass(el, cn){
            return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
        },
        initday(){
            var that = this;
            var picker = new Pikaday(
            {
                field: document.getElementById('datepicker'),
                firstDay: 1,
                bound:false,
                initDate:that.sendDate,
                openSelect:false,
                minDate: new Date(that.startTime),
                maxDate: new Date(that.endTime),
                onSelect:function(){
                    if (that.hasClass(event.target.parentNode, 'is-active')) {
                        event.target.parentNode.className = '';
                        that.sendDate.remove(picker.toString().replace(/\-/g,''));
                    }else{
                        event.target.parentNode.className = 'is-active';
                        that.sendDate.push(picker.toString().replace(/\-/g,''))
                    }
                }
            })

            // 所有日程
            var picker1 = new Pikaday(
            {
                field: document.getElementById('datepicker1'),
                firstDay: 1,
                bound:false,
                initDate:[that.startTime.replace(/\-/g,'')],
                openSelect:true,
                minDate: new Date(that.startTime),
                maxDate: new Date(that.endTime),
                onSelect:function(){
                    that.allDatePlane(picker1.toString().replace(/\-/g,''));
                }
            })
        }
    }
};
</script>
<style scoped>
.hours_box{height:100%;min-height:300px;}
.el-cascader{width:100%;margin-top:40px}
.h_footer{width:90%;margin:0 auto;text-align:right;}

.all_box{height:100%;padding-right:500px;min-height:300px;}
.h_left{position:fixed;top:130px;right:40px;width:460px;background:#fff;min-height:300px;}
.h_hd{height:50px;line-height:50px;background:#5A98E8;font-size:22px;color:#fff;text-align:center;}
.h_ct{padding:60px 30px 30px;text-align:center;}
</style>