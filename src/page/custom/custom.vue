<template>
    <div class="custom">
        <section class="custom_header_form">
            <el-button type="primary" icon='el-icon-plus' class='add_custom'>新建客户信息</el-button>
            <el-form ref="form" :model="form" :inline="true"  class='search_form'>
                <el-form-item class='search_form_item'>
                    <el-input v-model="form.name" placeholder="搜索客户信息" class='search_input'></el-input>
                    <el-button type="primary" class='search_btn'>搜索</el-button>
                </el-form-item>
                <div class="form_select_right">
                    <el-form-item>
                        <el-select v-model="form.user_intention" placeholder="用户意向">
                            <el-option
                                v-for="item in user_intention"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.time" placeholder="时间">
                            <el-option
                                v-for="item in time"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" class='edit_btn'>编辑</el-button>
                </div>
            </el-form>
        </section>
        <el-table
            :data="customLists"
            stripe
            style="width: 100%;text-align: center;"
            header-row-class-name='header_row_style'>
             <el-table-column
                prop="customer_number"
                label="客户编号"
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="客户"
                >
            </el-table-column>
            <el-table-column
                prop="tel"
                label="电话"
                >
            </el-table-column>
            <el-table-column
                prop="qq"
                label="QQ">
            </el-table-column>
            <el-table-column
                prop="weixin"
                label="微信">
            </el-table-column>
            <el-table-column
                prop="area"
                label="客户地区">
            </el-table-column>
            <el-table-column
                prop="addr"
                label="客户地址">
            </el-table-column>
            <el-table-column
                prop="house_type"
                label="房屋类型">
            </el-table-column>
            <el-table-column
                prop="house_status"
                label="房屋状态">
            </el-table-column>
            <el-table-column
                prop="source"
                label="客户来源">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间">
            </el-table-column>
        </el-table>
        <el-tabs type="border-card" class='el_tabs_footer'>
            <el-tab-pane label="基本信息">
                <basicInfo></basicInfo>
            </el-tab-pane>
            <el-tab-pane label="沟通记录">
                <communicationRecord></communicationRecord>
            </el-tab-pane>
            <el-tab-pane label="上门测量">
                <measurement></measurement>
            </el-tab-pane>
            <el-tab-pane label="收款管理"></el-tab-pane>
            <el-tab-pane label="方案明细"></el-tab-pane>
            <el-tab-pane label="交易信息"></el-tab-pane>
            <el-tab-pane label="投诉建议"></el-tab-pane>
        </el-tabs>
    </div>
</template>''
<script>
    import basicInfo from '@/components/custom/basicInfo';
    import communicationRecord from '@/components/custom/communicationRecord';
    import measurement from '@/components/custom/measurement';
    import { getCustomLists } from '@/service/getData';
    export default{
        name:'custom',
        data(){
            return{
                id:0,//0对应客户列表，1对应待联系列表，2对应已联系列表，3对应待分配列表，4对应待测量列表，5对应待上传列表
                page:1,//列表分页
                form: {
                    name: '',
                    user_intention:'',
                    time:''
                },
                user_intention: [
                    {
                        value: '有意',
                        label: '有意'
                    },
                    {
                        value: '无意',
                        label: '无意'
                    },
                    {
                        value: '可再联系',
                        label: '可再联系'
                    }
                ],
                time: [
                    {
                        value: '近三天',
                        label: '近三天'
                    },
                    {
                        value: '近一周',
                        label: '近一周'
                    },
                    {
                        value: '近两周',
                        label: '近两周'
                    },
                    {
                        value: '近一个月',
                        label: '近一个月'
                    }
                ],
                customLists: []
            }
        },
        mounted(){
            this.id = Number(this.$route.params.id);
            this.init();
        },
        beforeRouteUpdate (to, from, next) {
            this.id = Number(to.params.id);
            this.init();
            next();
        },
        methods:{
            async init(){//获取客户信息列表
                try {
                    let newArr = new Array;
                    const res = await getCustomLists(this.id,this.page);
                    if(res.error){
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        return false;
                    }
                    this.customLists = res.success;
                } catch(e) {
                    this.$message({
                        showClose: true,
                        message: e,
                        type: 'error'
                    });
                }
            }
        },
        components:{
            basicInfo,
            communicationRecord,
            measurement
        }
    }
</script>
<style scoped>
    .custom{
        height: 100%;
        position: relative;
    }
    .custom_header_form{
        padding: 18px 22px 0 41px;
    }
    .add_custom{
        width: 200px;
        height: 48px;
        border-radius: 0;
        color: #fff;
        font-size: 20px;
    }
    .search_form{
        margin-top: 19px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .search_form_item{
        flex: 1;
    }
    .search_input{
        /*flex: 1;*/
        height: 48px;
        margin-right: 11px;
        max-width: 350px;
    }
    .search_btn,.edit_btn{
        color: #fff;
        width: 90px;
        height: 48px;
        font-size: 20px;
        border-radius: 0;
    }
    .edit_btn{
        width: 80px;
        height: 40px;
        font-size: 16px;
    }
    .el-select{
        width: 160px;
        border-radius: 0;
    }
    .el-select .el-input__inner{
        border-radius: 0;
    }
    /*底部切换栏*/
    .el_tabs_footer{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>