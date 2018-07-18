<template>
    <section class="customerSource_container">
        <el-form ref="search_form" :model="searchForm" class='search_form'>
            <el-row :gutter="10">
                <el-col :span='4'>
                    <el-form-item prop='name'>
                        <el-input placeholder="请输入奖品名称" v-model="searchForm.name" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                    <el-form-item prop='mobile'>
                        <el-input placeholder="请输入手机号" v-model="searchForm.mobile" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop='start_time'>
                        <el-date-picker
                            v-model="searchForm.start_time"
                            type="datetime"
                            placeholder="起始时间"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop='end_time'>
                        <el-date-picker
                            v-model="searchForm.end_time"
                            type="datetime"
                            placeholder="结束时间"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='3'>
                    <el-button type="primary"  @click='init'>查询</el-button>
                </el-col>
                <el-col :span='3'>
                    <el-button type="primary"  @click='incomeExcel'>导出</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table
            ref='customListsTable'
            :data="receiveLists"
            stripe
            border
            header-row-class-name='header_row_style'>
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='100'
            >
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="领取人手机号">
            </el-table-column>
            <el-table-column
                prop='name'
                label="奖品名称">
            </el-table-column>
            <el-table-column
                prop="nums"
                label="领取数量">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间">
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import {prize_log} from '@/service/getData';

    export default{
        name:'receive',
        data(){
            return{
                receiveLists:[],
                searchForm: {
                    name: '',
                    mobile:'',
                    start_time:'',
                    end_time:''
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                try {
                    let that = this;
                    let res = await prize_log(this.searchForm);
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
                        this.receiveLists = res.success;
                    }else{
                        this.receiveLists = [];
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            incomeExcel(){//导出excel
                window.location.href='/crm-prize_logExport.html?start_time='+this.searchForm.start_time+'&end_time='+this.searchForm.end_time+'&name='+this.searchForm.name+'&mobile='+this.searchForm.mobile;
            }
        }
    }
</script>
<style scoped>
    .customerSource_container{
        padding: 20px 30px;
    }
    .el-date-editor.el-input,.el-button{
        width: 100%;
    }
</style>