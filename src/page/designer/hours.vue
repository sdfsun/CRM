<template>
    <div class="page_hours" :data='memberRoleId.member_role_id' v-if='memberRoleId && memberRoleId.member_role_id'>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的日程" name="first" v-if='memberRoleId.member_role_id !== "shopowner"'>
                <div class="hours_box">
                    <input type="hidden" id="datepicker"/>
                    <div class="h_footer">
                        <el-button type="primary" class="h_request" @click="postPaidan">请求派单</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="所有日程" name="second">

                <el-row :gutter="20">
                    <el-col :span="14">
                        <input type="hidden" id="datepicker1"/>
                    </el-col>
                    <el-col :span="10">
                        <div class="h_left">
                            <div class="h_hd">日程列表</div>
                            <div class="h_ct">
                                <el-table
                                  :data="tableData"
                                  style="width: 100%">
                                    <el-table-column
                                        prop="login_account"
                                        label="工号"
                                        min-width="60"></el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="姓名"></el-table-column>
                                    <el-table-column
                                        prop="mobile"
                                        label="电话"
                                        min-width="106"></el-table-column>
                                    <el-table-column
                                        prop="visit_type"
                                        label="时间"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {mapState} from 'vuex';
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
            tableData:[],
            singleDate:[]
        }
    },
    created(){
        document.body.style.background = "#f7f7f7"
    },
    mounted: function () {
        this.$nextTick(function () {
            if(this.memberRoleId && this.memberRoleId.member_role_id === "shopowner"){
                this.activeName = 'second';
            }
            this.init();
        });
    },
    computed:{
        ...mapState([
            'memberRoleId'
        ])
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
                    if(res.nologin === 1){//未登录
                        setTimeout(()=>{
                            this.$router.push('/');
                        },3000);
                    }
                }else{
                    this.startTime = res.success.date;
                    for(var i=0;i<res.success.checkdate.length;i++){
                        this.sendDate.push({'type_am':res.success.checkdate[i].type_am,'type_pm':res.success.checkdate[i].type_pm,'work_date':res.success.checkdate[i].work_date});
                    };
                    this.endTimeFun();
                    this.initday();
                }
            } catch(e) {
                this.$message({
                    showClose: true,
                    message: e.message,
                    type: 'error'
                });
            }
        },
        endTimeFun(){
            var timestamp = new Date(this.startTime).getTime();
            var endTamp = new Date(timestamp + 3600*24*2*1000);
            var y = endTamp.getFullYear();
            var m = endTamp.getMonth() + 1;
            var d = endTamp.getDate();
            this.endTime = y + '-' + m + '-' + d
        },
        async postPaidan(event,num){
            let result = await postVisitSave({'visit':this.singleDate});
            if(result.success){
                this.$message({
                    message: '恭喜你，' + result.success,
                    type: 'success'
                });
                if(num){
                    event.target.className = 'active';
                    event.target.parentNode.parentNode.className = 'is-active';
                }else{
                    event.target.className = '';
                    
                    // event.target.parentNode.parentNode.className = '';
                }
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
            if(this.memberRoleId.member_role_id !== "shopowner"){
                var picker = new Pikaday(
                {
                    field: document.getElementById('datepicker'),
                    firstDay: 1,
                    bound:false,
                    initDate:that.sendDate,
                    openSelect:false,
                    openAmPm:true,
                    minDate: new Date(that.startTime),
                    maxDate: new Date(that.endTime),
                    onSelect:function(){
                    }
                })
            }


            document.body.onclick = function(event){
                let isPush3 = true,isPush4 = true;
                that.singleDate = [];
                if (that.hasClass(event.target.parentNode, 'd_msg')) {
                    if (that.hasClass(event.target, 'active')) {
                        // event.target.className = '';
                        if(event.target.innerHTML=='AM'){
                            for(let i=0;i<that.sendDate.length;i++){
                                if(that.sendDate[i].work_date == event.target.getAttribute('data')){
                                    that.$set(that.sendDate[i],'type_am','');
                                    that.$nextTick(function(){
                                        if(!that.sendDate[i].type_pm){
                                            that.sendDate.splice(i, 1);
                                            // event.target.parentNode.parentNode.className = '';
                                            isPush3 = true;
                                            that.singleDate.push({'type_am':'','type_pm':'','work_date':event.target.getAttribute('data')});
                                        }else{
                                            that.singleDate.push({'type_am':'','type_pm':'2','work_date':event.target.getAttribute('data')});
                                        }
                                        that.postPaidan(event,0);
                                    });
                                }
                            }
                        }
                        if(event.target.innerHTML=='PM'){
                            for(let j=0;j<that.sendDate.length;j++){
                                if(that.sendDate[j].work_date == event.target.getAttribute('data')){
                                    that.$set(that.sendDate[j],'type_pm','');

                                    that.$nextTick(function(){
                                        if(!that.sendDate[j].type_am){
                                            that.sendDate.splice(j, 1);
                                            // event.target.parentNode.parentNode.className = '';
                                            isPush4 = true;
                                            that.singleDate.push({'type_am':'','type_pm':'','work_date':event.target.getAttribute('data')});
                                        }else{
                                            that.singleDate.push({'type_am':'1','type_pm':'','work_date':event.target.getAttribute('data')});
                                        }
                                        that.postPaidan(event,0);
                                    });
                                }
                            }
                        };

                        
                    }else{
                        // event.target.className = 'active';
                        if(event.target.innerHTML=='AM'){
                            for(let n=0;n<that.sendDate.length;n++){
                                if(that.sendDate[n].work_date == event.target.getAttribute('data')){
                                    that.sendDate[n].type_am = '1';
                                    isPush3 = false;
                                    that.singleDate.push(that.sendDate[n]);
                                }
                            }
                            if(isPush3){
                                that.sendDate.push({'type_am':'1','type_pm':'','work_date':event.target.getAttribute('data')});
                                // event.target.parentNode.parentNode.className = 'is-active';

                                that.singleDate.push({'type_am':'1','type_pm':'','work_date':event.target.getAttribute('data')});
                            }

                            that.postPaidan(event,1);
                        }

                        if(event.target.innerHTML=='PM'){
                            for(let m=0;m<that.sendDate.length;m++){
                                if(that.sendDate[m].work_date == event.target.getAttribute('data')){
                                    that.sendDate[m].type_pm = '2';
                                    isPush4 = false;
                                    that.singleDate.push(that.sendDate[m]);
                                }
                            }
                            if(isPush4){
                                that.sendDate.push({'type_am':'','type_pm':'2','work_date':event.target.getAttribute('data')});
                                // event.target.parentNode.parentNode.className = 'is-active';

                                that.singleDate.push({'type_am':'','type_pm':'2','work_date':event.target.getAttribute('data')});
                            }

                            that.postPaidan(event,1);
                        }
                    }
                }
            }

            // 所有日程
            var picker1 = new Pikaday(
            {
                field: document.getElementById('datepicker1'),
                firstDay: 1,
                bound:false,
                initDate:[],
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
.h_footer{width:90%;margin:0 auto;text-align:right;display:none;}

.h_left{background:#fff;min-height:666px;margin-top:40px;}
.h_hd{height:60px;line-height:60px;background:#5A98E8;font-size:20px;color:#fff;text-align:center;}
.h_ct{padding:60px 10px 30px;text-align:center;}

@media screen and (max-width: 1500px) {
    .h_left{min-height:466px;margin-top:30px;}
}
</style>