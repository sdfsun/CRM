<template>
    <section class="report_container">
        <el-form ref="search_form" :model="searchForm" class='search_form'>
            <el-row :gutter="10">
                <el-col :span='5'>
                    <el-form-item prop='content'>
                        <el-select v-model="searchForm.type" placeholder="请选择对比字段" @change='contrastHandle'>
                            <el-option label="所有渠道" value="all"></el-option>
                            <el-option label="客户来源" value="source"></el-option>
                            <el-option label="导购" value="service"></el-option>
                            <el-option label="设计师" value="designer"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='5'>
                    <el-form-item class='search_form_item' prop='member_id'>
                        <el-input placeholder="请输入所属地区" v-model="searchForm.area" class="input-with-select" clearable></el-input>
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
                <el-col :span='2' style='text-align: right;'>
                    <el-button type="primary"  @click='searchFormDatas'>查询</el-button>
                </el-col>
                <el-col :span='2' style='text-align: right;'>
                    <el-button type="primary"  @click='incomeExcel'>导出</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table
            ref='reportListsTable'
            :data="reportLists"
            highlight-current-row
            show-summary
            class='tableInfo'
            header-row-class-name='header_row_style'>
            <el-table-column
                prop="name"
                :label="cell_0_label"
                min-width='56px'
                class-name='cell_0_label'
                fixed='left'
                >
            </el-table-column>
            <el-table-column
                prop="cost"
                label="花费金额"
                min-width='76px'
                class-name='cell_1'
                >
            </el-table-column>
            <el-table-column
                prop="nums"
                label="留资数"
                min-width='52px'
                class-name='cell_1'
                >
            </el-table-column>
            <el-table-column
                prop='cost_avg'
                label="留资成本"
                min-width='76px'
                class-name='cell_1'
                >
            </el-table-column>
            <el-table-column
                prop="new_visit"
                label="导购回访数"
                min-width='56px'
                class-name='cell_1'>
            </el-table-column>
            <el-table-column label='预约成功' class-name='cell_2 cell_all'>
                <el-table-column
                    prop="bespeak_num"
                    label="到店数"
                    min-width='52px'
                    class-name='cell_2'
                    >
                </el-table-column>
                <el-table-column
                    prop="scale_num"
                    label="量尺数"
                    min-width='52px'
                    class-name='cell_2'
                    >
                </el-table-column>
                <el-table-column
                    prop='make_num'
                    label="成功数(包括量尺和到店)"
                    min-width='78px'
                    class-name='cell_2'>
                </el-table-column>
                <el-table-column
                    prop='make_change'
                    label="转化率"
                    min-width='50px'
                    class-name='cell_2'>
                </el-table-column>
                <el-table-column
                    prop='make_cost'
                    label="成本"
                    min-width='76px'
                    class-name='cell_2'>
                </el-table-column>
            </el-table-column>
            <el-table-column label='测量成功' class-name='cell_3 cell_all'>
                <el-table-column
                    prop="scale_succ"
                    label="量尺数"
                    min-width='52px'
                    class-name='cell_3'>
                </el-table-column>
                <el-table-column
                    prop="scale_change"
                    label="量尺率"
                    min-width='50px'
                    class-name='cell_3'>
                </el-table-column>
                <el-table-column
                    prop="bespeak_succ"
                    label="到店数(直接预约到店)"
                    min-width='74px'
                    class-name='cell_3'>
                </el-table-column>
                <el-table-column
                    prop="bespeak_change"
                    label="到店率(直接预约到店)"
                    min-width='74px'
                    class-name='cell_3'>
                </el-table-column>
                <el-table-column
                    prop="bespeak_total"
                    label="到店数(量尺到店)"
                    min-width='62px'
                    class-name='cell_3'>
                </el-table-column>
                <el-table-column
                    prop="total_change"
                    label="到店率(量尺后)"
                    min-width='58px'
                    class-name='cell_3 cell_15_label'>
                </el-table-column>
            </el-table-column>
            <el-table-column label='交定成功' class-name='cell_4 cell_all'>
                <el-table-column
                    prop="deposit"
                    label="定金金额"
                    min-width='70px'
                    class-name='cell_4'>
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="余款金额"
                    min-width='68px'
                    class-name='cell_4'>
                </el-table-column>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
    import {incomeSearch} from '@/service/getData';
    export default{
        name:'report',
        data(){
            return{
                cell_0_label:'所有渠道',
                reportLists:[],
                searchForm: {
                    type: 'all',
                    area:'',
                    start_time:'',
                    end_time:''
                },
                searchBtnStatus:false
            }
        },
        methods:{
            async searchFormDatas(){//表单搜索
                if(this.searchBtnStatus){
                    return false;
                }
                this.searchBtnStatus = true;
                try {
                    let that = this;
                    const res = await incomeSearch(this.searchForm);
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
                    this.reportLists = res;
                    this.searchBtnStatus = false;
                } catch(e) {
                    this.searchBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async incomeExcel(){//导出excel
                
                window.location.href='/crm-income_excel.html?type='+this.searchForm.type+'&area='+this.searchForm.area+'&start_time='+this.searchForm.start_time+'&end_time='+this.searchForm.end_time;
            },
            contrastHandle(val){
                switch (val) {
                    case 'all':
                        this.cell_0_label = '所有渠道';
                        break;
                    case 'source':
                        this.cell_0_label = '客户来源';
                        break;
                    case 'service':
                        this.cell_0_label = '导购';
                        break;
                    case 'designer':
                        this.cell_0_label = '设计师';
                        break;
                    default:
                        // statements_def
                        break;
                }
            }
        }
    }
</script>
<style scoped>
    .report_container .search_form{
        padding: 20px 60px 0;
    }
    .report_container .el-table{
        text-align: right;
    }
    .el-button{
        width: 100%;
        padding-left: 0;
        padding-right: 0;
    }
</style>