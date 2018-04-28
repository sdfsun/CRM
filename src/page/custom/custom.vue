<template>
    <div class="custom_container" :class='status'>
        <section class="custom_header_form">
            <el-button type="primary" icon='el-icon-plus' class='add_custom' @click='insertCustomBasicInfo({type:true})'>新建客户信息</el-button>
            <el-form ref="form" :model="searchForm" class='search_form'>
                <el-row :gutter="10" style='width:100%;'>
                    <el-col :span='13'>
                        <el-form-item>
                            <el-input placeholder="请输入内容" v-model="searchForm.content" class="input-with-select" clearable @keyup.13.native='searchFormDatas'>
                                <el-select v-model="searchForm.searchName" slot="prepend" placeholder="请选择类型">
                                    <el-option label="姓名" value="name"></el-option>
                                    <el-option label="客户编号" value="customer_number"></el-option>
                                    <el-option label="电话" value="tel"></el-option>
                                    <el-option label="手机" value="mobile"></el-option>
                                </el-select>
                                <el-button slot="append" icon="el-icon-search" @click='searchFormDatas'></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='11'>
                        <el-row :gutter="10">
                            <el-col :span='10'>
                                <el-form-item class='search_form_item'>
                                    <el-select v-model="searchForm.status" clearable placeholder="客户状态" @change='searchFormDatas'>
                                        <el-option
                                            v-for="item in customStatus"
                                            :key="item.val"
                                            :label="item.label"
                                            :value="item.val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-row :gutter="20" type='flex' align='middle'>
                                    <el-col :span='16'>
                                        <el-form-item class='search_form_item'>
                                            <el-select v-model="searchForm.time" clearable placeholder="时间" @change='searchFormDatas'>
                                                <el-option
                                                    v-for="item in time"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span='8'>
                                        <el-button type="primary" class='edit_btn' @click='editCustomBasicInfo'>编辑</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
        </section>
        <el-table
            ref='customListsTable'
            :data="customLists"
            stripe
            highlight-current-row
            class='customListsTableInfo'
            header-row-class-name='header_row_style'
            @row-click="handleCurrentChange">
            <el-table-column
                prop="id"
                label="id"
                v-if='idStatus'
                >
            </el-table-column>
            <el-table-column
                prop="customer_number"
                label="客户编号"
                min-width='100px'
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="客户"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="tel"
                label="电话"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机"
                min-width='120px'
                >
            </el-table-column>
            <el-table-column
                prop="qq"
                label="QQ"
                min-width='120px'>
            </el-table-column>
            <el-table-column
                prop="weixin"
                label="微信"
                min-width='120px'>
            </el-table-column>
            <el-table-column
                prop="area"
                label="客户地区"
                min-width='200px'>
            </el-table-column>
            <el-table-column
                prop="addr"
                label="客户地址"
                min-width='200px'>
            </el-table-column>
            <el-table-column
                prop="house_type"
                label="房屋类型"
                min-width='150px'>
            </el-table-column>
            <el-table-column
                prop="house_status"
                label="房屋状态"
                min-width='100px'>
            </el-table-column>
            <el-table-column
                prop='source_name'
                label="客户来源"
                min-width='120px'>
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间"
                min-width='160px'>
            </el-table-column>
        </el-table>
        <el-tabs type="border-card" class='el_tabs_footer' v-model="activeName" @tab-click='up_down_tabs'>
            <el-tab-pane label="基本信息" name='基本信息'>
                <basicInfo :basicInfoRecord='customInfoArray[0]'></basicInfo>
            </el-tab-pane>
            <el-tab-pane label="沟通记录" name='沟通记录'>
                <communicationRecord :communicateRecords='customInfoArray[1]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></communicationRecord>
            </el-tab-pane>
            <el-tab-pane label="上门测量" name='上门测量'>
                <measurement :measurementRecords='customInfoArray[2]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></measurement>
            </el-tab-pane>
            <el-tab-pane label="收款管理" name='收款管理'>
                <receivables :receivablesRecords='customInfoArray[3]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></receivables>
            </el-tab-pane>
            <el-tab-pane label="方案明细" name='方案明细'>
                <programme :programmeRecords='customInfoArray[4]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></programme>
            </el-tab-pane>
            <el-tab-pane label="交易信息" name='交易信息'>
                <transaction :transactionRecords='customInfoArray[5]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></transaction>
            </el-tab-pane>
            <el-tab-pane label="投诉建议" name='投诉建议'>
                <complaint :complaintRecords='customInfoArray[6]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></complaint>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-d-arrow-right"></i></span>
            </el-tab-pane>
        </el-tabs>
        <!-- 新增或编辑客户基本信息弹框 -->
        <el-dialog title="基本信息" :visible.sync="basicInfoDialogVisible" class='basicInfoDialog' @close='resetCustomBasicInfoEdit' style='margin-top: -60px;'>
            <basicEdit v-on:closeCustomBasicInfoDialog='updateCustomBasicInfo' :editInfos='activeRow' ref='basicEdit'></basicEdit>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import basicInfo from '@/components/custom/basicInfo/basicInfo';
    import basicEdit from '@/components/custom/basicInfo/basicEdit';
    import communicationRecord from '@/components/custom/communicationRecord/communicationRecord';
    import measurement from '@/components/custom/measurement/measurement';
    import receivables from '@/components/custom/receivables/receivables';
    import programme from '@/components/custom/programme/programme';
    import transaction from '@/components/custom/transaction/transaction';
    import complaint from '@/components/custom/complaint/complaint';
    import { getCustomLists,customer_detail,communicate,measures,receivableItems,programmes,transactions,complaints} from '@/service/getData';

    export default{
        name:'custom',
        data(){
            return{
                id:0,//0对应客户列表，1对应待联系列表，2对应已联系列表，3对应待分配列表，4对应待测量列表，5对应待上传列表
                page:1,//列表分页
                activeName:'',
                status:'down',
                idStatus:false,//控制id列隐藏
                searchForm: {
                    content: '',
                    status:'',
                    time:'',
                    searchName:''
                },
                customLists: [],//客户列表
                currentRow:{},//当前选中的行数
                activeRow:{},//当前选中的行数
                customInfoArray:new Array({},[],[],[],[],[],[]),//存储客户相关信息
                isGetDataArray:new Array(7).fill(""),//存储客户相关信息
                basicInfoDialogVisible:false,//客户基本信息弹框是否可见
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
                        value: '3',
                        label: '近三天'
                    },
                    {
                        value: '7',
                        label: '近一周'
                    },
                    {
                        value: '14',
                        label: '近两周'
                    },
                    {
                        value: '30',
                        label: '近一个月'
                    }
                ]
            }
        },
        computed:{
            ...mapState([
                'customSource',
                'customStatus'
            ])
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
                const that = this;
                try {
                    let newArr = new Array;
                    const res = await getCustomLists(this.id,this.page,this.searchForm);
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
                        this.customLists = res.success;
                    }else{
                        this.customLists = [];
                    }
                    this.currentRow = {};
                    this.activeName = '';
                    this.customInfoArray = [{},[],[],[],[],[],[]];//重置
                    this.isGetDataArray = new Array(7).fill("");//重置
                } catch(e) {
                    this.$message({
                        showClose: true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            searchFormDatas(){//搜索表单数据
                if(this.searchForm.content !== '' && this.searchForm.searchName === ''){
                    this.$message({
                        message: '请选择搜索类型',
                        type: 'error'
                    });
                    return false;
                }
                this.init();
            },
            up_down_tabs(){//展开或隐藏信息栏
                if(Object.keys(this.currentRow).length === 0){
                    this.$message({
                        message:'请先选中一行客户信息！',
                        type:'error'
                    });
                    this.activeName = '';
                    return false;
                }
                if(this.activeName === '7'){
                    if(this.status === 'down'){
                        this.status = 'up';
                        this.activeName = '基本信息';
                    }else {
                        this.activeName = '';
                        this.status = 'down';
                    }
                }else{
                    if(this.status === 'down'){
                        this.status = 'up';
                    }
                    let result = null;
                    const customer_id = this.currentRow.id;
                    switch (this.activeName) {
                        case '基本信息':
                            this.initElPaneData(0,customer_id);
                            break;
                        case '沟通记录':
                            this.initElPaneData(1,customer_id);
                            break;
                        case '上门测量':
                            this.initElPaneData(2,customer_id);
                            break;
                        case '收款管理':
                            this.initElPaneData(3,customer_id);
                            break;
                        case '方案明细':
                            this.initElPaneData(4,customer_id);
                            break;
                        case '交易信息':
                            this.initElPaneData(5,customer_id);
                            break;
                        case '投诉建议':
                            this.initElPaneData(6,customer_id);
                            break;
                        default:
                            // statements_def
                            break;
                    }
                }
            },
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                if(currentrow){//编辑基本信息回调的时候会触发这个函数，但是此时setCurrentRow为对象
                    this.currentRow = currentrow;
                    this.activeName = '基本信息';
                    this.customInfoArray = [{},[],[],[],[],[],[]];//重置
                    this.isGetDataArray = new Array(7).fill("");//重置
                    this.up_down_tabs();
                }
            },
            async initElPaneData(num,customer_id){//初始化信息栏数据
                try {
                    let result = null;
                    if(this.isGetDataArray[num] === ""){//判断是否为空对象
                        switch (num) {
                            case 0:
                                result = await customer_detail(customer_id);
                                break;
                            case 1:
                                result = await communicate(customer_id);
                                break;
                            case 2:
                                result = await measures(customer_id);
                                break;
                            case 3:
                                result = await receivableItems(customer_id);
                                break;
                            case 4:
                                result = await programmes(customer_id);
                                break;
                            case 5:
                                result = await transactions(customer_id);
                                break;
                            case 6:
                                result = await complaints(customer_id);
                                break;
                            default:
                                // statements_def
                                break;
                        }
                        this.isGetDataArray[num] = "1";
                        if(result.error){
                            this.$message({
                                message: result.error,
                                type: 'error'
                            });
                            if(result.nologin === 1){//未登录
                                setTimeout(()=>{
                                    this.$router.push('/');
                                },3000);
                            }
                            return false;
                        }
                        Vue.set(this.customInfoArray,num,result.success);
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertCustomBasicInfo(){
                this.basicInfoDialogVisible = true;
            },
            updateCustomBasicInfo(callbackData){//新增客户基本信息
                this.basicInfoDialogVisible = false;
                if(callbackData.data){//基本信息保存后回调
                    if(callbackData.type === 'add'){//新增
                        this.customLists.push(callbackData.data);
                    }else{//编辑
                        const index = this.customLists.findIndex(function(item, index, arr) {
                            return item.id === callbackData.data.id;
                        });
                        Vue.set(this.customLists,index,callbackData.data);
                        this.currentRow = callbackData.data;
                        this.activeName = '基本信息';
                        this.customInfoArray = [callbackData.data,[],[],[],[],[],[]];//重置
                        this.isGetDataArray = ["1","","","","","",""];//重置
                        this.$refs['customListsTable'].setCurrentRow(this.currentRow);
                    }
                }
            },
            editCustomBasicInfo(){//编辑客户基本信息
                if(Object.keys(this.currentRow).length === 0){
                    this.$message({
                        message:'请先选中需要编辑的交易记录！',
                        type:'error'
                    });
                    return false;
                }
                this.activeRow = Object.assign({},this.currentRow);
                if(this.activeRow.house_type !== '' && this.activeRow.house_status !== ''){//装修类型
                    this.activeRow.houseTypeOptions = [this.activeRow.house_type,this.activeRow.house_status];
                }
                if(this.activeRow.area != ''){//地区
                    let areaTempArr = this.activeRow.area.split(" ");
                    this.activeRow.area = areaTempArr.slice();
                }
                this.basicInfoDialogVisible = true;
            },
            resetCustomBasicInfoEdit(){//关闭基本信息弹框后重置表单数据
                this.activeRow = {};
                this.$refs['basicEdit'].$refs['basicForms'].resetFields();
            },
            updateCustomRelationRecordItem(callbackData){//新增或更新沟通、测量、方案、收款等记录
                if(callbackData.data){
                    if(callbackData.type === 'add'){
                        this.customInfoArray[callbackData.num].push(callbackData.data);
                    }else{//编辑
                        let key_name = 'id';
                        switch (callbackData.num) {
                            case 3:
                                key_name = 'receivables_id';
                                break;
                            default:
                                // statements_def
                                break;
                        }
                        const index = this.customInfoArray[callbackData.num].findIndex(function(item, index, arr) {
                            return item[key_name] === callbackData.data[key_name];
                        });
                        Vue.set(this.customInfoArray[callbackData.num],index,callbackData.data);
                        //重置基本信息中的status
                        Vue.set(this.currentRow,'status',callbackData.data.information_status);
                        Vue.set(this.customInfoArray[0],'status',callbackData.data.information_status);
                        Vue.set(this.customInfoArray[0],'status_name',this.customStatus[callbackData.data.information_status].label);
                    }
                }
            }
        },
        components:{
            basicInfo,
            basicEdit,
            communicationRecord,
            measurement,
            receivables,
            programme,
            transaction,
            complaint
        }
    }
</script>
<style scoped>
    .custom_container{
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .custom_header_form{
        padding: 18px 22px 0 41px;
    }
    .customListsTableInfo{
        width: 100%;
        text-align: center;
        display:flex;
        flex-direction: column;
    }
    .add_custom{
        width: 200px;
    }
    .search_form{
        margin: 19px 0;
    }
    .search_form .el-form-item{
        margin-bottom: 0;
    }
    .search_form .search_form_item .el-select{
        width: 100%;
    }
    .edit_btn{
        width: 90px;
    }
    .edit_btn{
        width: 80px;
        height: 40px;
        padding: 9px 0;
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
        overflow: hidden;
    }
    
</style>