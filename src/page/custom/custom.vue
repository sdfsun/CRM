<template>
    <div class="custom_container" :class='status'>
        <section class="custom_header_form">
            <el-row :gutter="10" style='margin:0;'>
                <el-col :span='5' style='padding-left: 0;'>
                    <el-button type="primary" icon='el-icon-plus' class='add_custom' @click='insertCustomBasicInfo' v-if='memberRoleId.member_role_id !== "designer" && memberRoleId.member_role_id !== "director"'>新建客户信息</el-button>
                    <el-button type="primary" @click='logExportExcel'>导出</el-button>
                </el-col>
                <el-col :span='19' style='text-align: right;padding-right: 0;'>
                    <template v-if='state_count.length>0'>
                        <el-badge :value="item.num" class="badge-item" v-for="item in state_count" :key='item.id'>
                            <el-button size="small" @click="searchFormDatas(item.id,'badge')" :class="{active:id == 'reception' ? item.id == searchForm.special : id == item.id}">{{item.name}}</el-button>
                        </el-badge>
                    </template>
                    <el-button type="primary" v-if='memberRoleId.is_special == "true" && id == "0"' @click="deleteInformationHandle">删除</el-button>
                    <p class="totalNum-wrapper">总数：<span>{{totalNum}}</span></p>
                </el-col>
            </el-row>
            <el-form ref="search_form" :model="searchForm" class='search_form'>
                <el-row :gutter="10" type="flex">
                    <el-col :span='6'>
                        <el-form-item prop='content'>
                            <el-input placeholder="搜索内容" v-model="searchForm.content" class="input-with-select" clearable @keyup.13.native='searchFormDatas'>
                                <el-button slot="append" icon="el-icon-search" @click='searchFormDatas'></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='4'>
                        <el-form-item prop='usercode'>
                            <el-input placeholder="导购名称" v-model="searchForm.usercode" class="input-with-select" clearable @keyup.13.native='searchFormDatas'>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='5' v-if='id === "0" || id === "reception"'>
                        <el-form-item class='search_form_item' prop='status'>
                            <el-cascader
                                placeholder='客户状态'
                                :options="customStatus"
                                v-model="searchForm.status"
                                :props="statusDefaultProps"
                                @change="searchFormDatas('status')"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span='4' v-if='memberRoleId.member_role_id !== "designer"'>
                        <el-form-item class='search_form_item' prop='member_id'>
                            <el-select v-model="searchForm.member_id" clearable placeholder="设计师" @change='searchFormDatas'>
                                <el-option
                                    v-for="item in designers"
                                    :key="item.member_id"
                                    :label="item.name"
                                    :value="item.member_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class='search_form_item' prop='time'>
                            <el-date-picker
                                    v-model="searchForm.time"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format='yyyy-MM-dd'
                                    @change='searchFormDatas'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" v-show='eTimesHandle'>
                        <el-form-item class='search_form_item' prop='e_times'>
                            <el-select v-model="searchForm.e_times" clearable placeholder="预计回访时间" @change='searchFormDatas("times")'>
                                <el-option
                                    v-for="item in esTimesOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='2'>
                        <el-button type="primary" class='edit_btn' @click='editCustomBasicInfo'>编辑</el-button>
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
            @row-click="handleCurrentChange"
            @sort-change='sortChangeHandle'>
            <el-table-column
                prop="id"
                label="id"
                v-if='idStatus'
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="客户"
                min-width='80px'
                >
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机"
                min-width='100px'
                >
            </el-table-column>
            <el-table-column
                prop='star_level'
                label="星级"
                min-width='82px'
                sortable='custom'
                >
                <template slot-scope='scope'>
                    <el-rate v-model="scope.row.star_level" disabled></el-rate>
                </template>
            </el-table-column>
            <el-table-column
                prop="area"
                label="客户地区"
                min-width='140px'>
            </el-table-column>
            <el-table-column
                prop="addr"
                label="客户地址"
                min-width='140px'>
            </el-table-column>
            <el-table-column
                prop='status_name'
                label="客户状态"
                min-width='120px'>
            </el-table-column>
            <template v-if='id === "2" || id === "reception"'>
                <el-table-column
                    prop='apart_day'
                    label="留资天数"
                    min-width='68px'>
                </el-table-column>
                <el-table-column
                    prop='frequency'
                    label="沟通次数"
                    min-width='68px'>
                </el-table-column>
            </template>
            <el-table-column
                prop='member_name'
                label="归属设计师"
                min-width='90px'>
            </el-table-column>
            <el-table-column
                prop='source_name'
                label="客户来源"
                min-width='80px'
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop='createtime'
                label="创建日期"
                min-width='135px'>
            </el-table-column>
            <el-table-column
                prop='outline'
                label="沟通概要"
                min-width='80px'
                show-overflow-tooltip
                v-if='id === "reception"'>
            </el-table-column>
        </el-table>
        <el-tabs type="border-card" class='el_tabs_footer' v-model="activeName" @tab-click='up_down_tabs'>
            <el-tab-pane label="基本信息" name='1' style='overflow:auto;'>
                <basicInfo :basicInfoRecord='customInfoArray[0]' v-on:updateCustomBasicInfo='updateCustomBasicInfomation'></basicInfo>
            </el-tab-pane>
            <el-tab-pane label="沟通记录" name='2'>
                <communicationRecord :communicateRecords='customInfoArray[1]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></communicationRecord>
            </el-tab-pane>
            <el-tab-pane label="上门测量" name='3'>
                <measurement :measurementRecords='customInfoArray[2]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></measurement>
            </el-tab-pane>
            <el-tab-pane label="收款记录" name='4'>
                <receivables :receivablesRecords='customInfoArray[3]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></receivables>
            </el-tab-pane>
            <el-tab-pane label="方案明细" name='5'>
                <programme :programmeRecords='customInfoArray[4]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem' v-on:updateCustomProgrammeRecords='updateCustomProgrammeRecordItem'></programme>
            </el-tab-pane>
            <el-tab-pane label="订单记录" name='6'>
                <transaction :transactionRecords='customInfoArray[5]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></transaction>
            </el-tab-pane>
            <el-tab-pane label="售后记录" name='7'>
                <complaint :complaintRecords='customInfoArray[6]' :infomation='currentRow' v-on:updateCustomRelationRecords='updateCustomRelationRecordItem'></complaint>
            </el-tab-pane>
            <el-tab-pane name='8'>
                <span slot="label"><i class="crmiconfont icon-shangla_"></i></span>
            </el-tab-pane>
        </el-tabs>
        <!-- 新增或编辑客户基本信息弹框 -->
        <el-dialog title="基本信息" :visible.sync="basicInfoDialogVisible" class='basicInfoDialog' @close='resetCustomBasicInfoEdit' style='margin-top: -60px;' :close-on-click-modal='false'>
            <basicEdit v-on:closeCustomBasicInfoDialog='updateCustomBasicInfo' :editInfos='activeRow' ref='basicEdit'></basicEdit>
        </el-dialog>
        <!-- 二维码弹框 -->
        <el-dialog title="微信绑定" :visible.sync="qrcodeDialogVisible" style='text-align:center;'  @close='resetQrcodeDialog'>
            <img :src='qrcode_url' style="width: 235px;height:235px;" />
        </el-dialog>
    </div>
</template>
<script>
    import {mapState,mapMutations} from 'vuex';
    import basicInfo from '@/components/custom/basicInfo/basicInfo';
    import basicEdit from '@/components/custom/basicInfo/basicEdit';
    import communicationRecord from '@/components/custom/communicationRecord/communicationRecord';
    import measurement from '@/components/custom/measurement/measurement';
    import receivables from '@/components/custom/receivables/receivables';
    import programme from '@/components/custom/programme/programme';
    import transaction from '@/components/custom/transaction/transaction';
    import complaint from '@/components/custom/complaint/complaint';
    import { getCustomLists,customer_detail,communicate,measures,receivableItems,programmes,order_detail,complaints,delete_information} from '@/service/getData';
    
    export default{
        name:'custom',
        data(){
            return{
                id:'0',//0对应客户列表，1对应待联系列表，2对应已联系列表，3对应待分配列表，4对应待测量列表，5对应待上传列表
                page:1,//列表分页
                activeName:'',
                status:'down',
                idStatus:false,//控制id列隐藏
                searchForm: {
                    content: '',
                    status:[],
                    time:'',
                    searchName:'',
                    member_id:'',
                    port:'',
                    s_times:'',
                    e_times:'',
                    usercode:'',//导购名称
                    special:''//针对我沟通过的客户特殊处理
                },
                customLists: [],//客户列表
                totalNum:0,//客户列表总数
                currentRow:{},//当前选中的行数
                activeRow:{},//当前选中的行数
                customInfoArray:new Array({},[],[],[],[],[],[]),//存储客户相关信息
                isGetDataArray:new Array(7).fill(""),//存储客户相关信息
                basicInfoDialogVisible:false,//客户基本信息弹框是否可见
                qrcodeDialogVisible:false,//微信绑定二维码弹框
                qrcode_url:'',
                sortForm:{
                    prop:'',
                    order:''
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
                esTimesOptions: [//预计回访时间
                    {
                        value: '3day',
                        label: '近3天'
                    },
                    {
                        value: '2week',
                        label: '近2周'
                    },
                    {
                        value: '1month',
                        label: '近1个月'
                    },
                    {
                        value: '3month',
                        label: '近3个月'
                    },
                    {
                        value: '6month',
                        label: '近6个月'
                    },
                    {
                        value: '1year',
                        label: '近1年'
                    }
                ],
                visibleBudge:['1','2','3','4','5','6','7'],//可见待联系 头部6个按钮的id
                state_count:[],//待联系 头部6个按钮数量
                statusDefaultProps:{
                    value:'id',
                    label:'name',
                    children:'menus'
                },
                pageForm:{
                    range:80,
                    HAS_DATA:true,
                    isOn:true,
                    elWraper:null
                },
                eTimesHandle:false//是否显示预计回访时间
            }
        },
        computed:{
            ...mapState([
                'designers',
                'customStatus',
                'memberRoleId',
                'qrcode'
            ])
        },
        mounted(){
            this.id = this.$route.params.id;
            this.init('mounted');
        },
        beforeRouteUpdate (to, from, next) {
            this.id = to.params.id;
            this.$refs['search_form'].resetFields();
            this.searchForm.searchName = '';
            this.searchForm.s_times = '';
            this.searchForm.special = '';
            this.page = 1;
            this.pageForm.HAS_DATA = true;
            this.pageForm.isOn = true;
            this.pageForm.elWraper.scrollTop = 0;
            this.status = 'down';
            this.init();
            next();
        },
        methods:{
            ...mapMutations([
                'SETQRCODE'
            ]),
            //表格排序
            sortChangeHandle(sort_data){
                this.searchForm.port = sort_data.order;
                this.page = 1;
                this.pageForm.HAS_DATA = true;
                this.pageForm.isOn = true;
                this.pageForm.elWraper.scrollTop = 0;
                this.init();
            },
            async init(type,formData){//获取客户信息列表
                const that = this;
                try {
                    let tempFormData = Object.assign({},this.searchForm);
                    if(type === 'page'){//分页
                        this.searchForm.showLoad = type;
                    }else{
                        delete this.searchForm['showLoad'];
                    }
                    if(type === 'status'){
                        tempFormData.status = formData.status;
                    }else{
                        tempFormData.status = '';
                    }
                    const res = await getCustomLists(this.id,this.page,tempFormData);
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
                    if(type === 'mounted'){
                        let stateCounts = [];
                        res.state_count.forEach(function(item){
                            stateCounts.push(item.id);
                        });
                        if(this.id === "1" || this.id === "reception" || stateCounts.join(",").indexOf(this.id) !== -1){
                            this.eTimesHandle = true;
                        }else {
                            this.eTimesHandle = false;
                        }
                        this.scrollCustomBasicLists();
                    }
                    this.totalNum = res.data ? res.data : 0;
                    this.state_count = res.state_count ? res.state_count : [];
                    if(res.success && res.success.length>0){
                        if(this.page === 1){
                            this.customLists = res.success;
                        }else{
                            this.customLists =  this.customLists.concat(res.success);
                        }
                    }else{
                        if(this.page === 1){
                            this.customLists = [];
                        }else{//最后一页了
                            this.page--;
                        }
                        this.pageForm.HAS_DATA = false;
                    }
                    that.pageForm.isOn = true;
                    if(type !== 'page'){//非分页
                        this.currentRow = {};
                        this.activeName = '';
                        this.customInfoArray = [{},[],[],[],[],[],[]];//重置
                        this.isGetDataArray = new Array(7).fill("");//重置
                    }
                    if(this.qrcode && this.qrcode.url){
                        this.$nextTick(function(){
                            if(this.qrcode && this.qrcode.tmpl_user === 'false'){//需要弹框
                                this.qrcode_url = "/qrcode/index.html?text="+this.qrcode.url;
                                this.qrcodeDialogVisible = true;
                            }
                        });
                    }
                } catch(e) {
                    this.$message({
                        showClose: true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            scrollCustomBasicLists(){//客户列表滚动加载
                try {
                    let that = this;
                    that.pageForm.elWraper = document.querySelector(".customListsTableInfo .el-table__body-wrapper");
                    that.pageForm.elWraper.addEventListener('scroll',function(){
                        let srollPos = that.pageForm.elWraper.scrollTop;    //滚动条距顶部距离(页面超出窗口的高度)
                        let totalheight = parseFloat(that.pageForm.elWraper.clientHeight) + parseFloat(srollPos);
                        if((that.pageForm.elWraper.scrollHeight-that.pageForm.range) <= totalheight && that.pageForm.HAS_DATA == true && srollPos>0) {
                            if(that.pageForm.isOn){
                                that.pageForm.isOn = false;
                                that.page++;
                                that.init('page');
                            }
                        }
                    });
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            resetQrcodeDialog(){
                this.SETQRCODE({});
            },
            searchFormDatas(type,badge){//搜索表单数据
                try {
                    const that = this;
                    let tempSearchForm = Object.assign({},this.searchForm);
                    this.page = 1;
                    this.pageForm.HAS_DATA = true;
                    this.pageForm.isOn = true;
                    if(type && type === 'times' && this.searchForm.e_times){//预计回访时间
                        const index = this.esTimesOptions.findIndex(function(item, index, arr) {
                            return item.value === that.searchForm.e_times;
                        });
                        if(index-1 >= 0){
                            that.searchForm.s_times = this.esTimesOptions[index-1].value;
                        }else{
                            that.searchForm.s_times = '';
                        }
                    }
                    if(badge && badge === 'badge'){//
                        if(this.id === 'reception'){//我沟通的客户
                            this.searchForm.special = type;
                        }else{
                            this.id = type;
                        }
                    }
                    const len = tempSearchForm.status.length;
                    tempSearchForm.status = tempSearchForm.status[len-1];
                    this.init('status',tempSearchForm);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            up_down_tabs(){//展开或隐藏信息栏
                try {
                    if(Object.keys(this.currentRow).length === 0){
                        this.$message({
                            message:'请先选中一行客户信息！',
                            type:'error'
                        });
                        this.activeName = '';
                        return false;
                    }
                    if(this.activeName === '8'){
                        if(this.status === 'down'){
                            this.status = 'up';
                            this.activeName = '1';
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
                            case '1':
                                this.initElPaneData(0,customer_id);
                                break;
                            case '2':
                                this.initElPaneData(1,customer_id);
                                break;
                            case '3':
                                this.initElPaneData(2,customer_id);
                                break;
                            case '4':
                                this.initElPaneData(3,customer_id);
                                break;
                            case '5':
                                this.initElPaneData(4,customer_id);
                                break;
                            case '6':
                                this.initElPaneData(5,customer_id);
                                break;
                            case '7':
                                this.initElPaneData(6,customer_id);
                                break;
                            default:
                                // statements_def
                                break;
                        }
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            customTableScroll(){//添加基本信息后滚动到指定位置
                let that = this;
                let tableWrapper = document.querySelector(".customListsTableInfo .el-table__body-wrapper");
                const index = this.customLists.findIndex(function(item, index, arr) {
                    return item.id === that.currentRow.id;
                });
                this.$refs['customListsTable'].bodyWrapper.scrollTop =index*36;
            },
            handleCurrentChange(currentrow){//当表格的当前行发生变化的时候会触发该事件
                if(currentrow){//编辑基本信息回调的时候会触发这个函数，但是此时setCurrentRow为对象
                    this.currentRow = Object.assign({},currentrow);
                    this.activeName = '1';
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
                                result = await order_detail(1,4,{'information_id':customer_id,'trans_status':'true'});
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
                        this.$set(this.customInfoArray,num,result.success);
                        if(num === 0){
                            this.currentRow = Object.assign({},result.success);
                            const index = this.customLists.findIndex(function(item, index, arr) {
                                return item.id === result.success.id;
                            });
                            this.$set(this.customLists,index,result.success);
                            this.$nextTick(function(){
                                this.$refs['customListsTable'].setCurrentRow(result.success);
                            });
                        }
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
                        this.$set(this.customLists,index,callbackData.data);
                    }
                    this.currentRow = callbackData.data;
                    this.activeName = '1';
                    this.customInfoArray = [callbackData.data,[],[],[],[],[],[]];//重置
                    this.isGetDataArray = ["1","","","","","",""];//重置
                    this.$nextTick(function(){
                        this.$refs['customListsTable'].setCurrentRow(this.currentRow);
                        if(callbackData.type === 'add'){
                            this.up_down_tabs();
                            this.customTableScroll();
                        }
                    });
                }
            },
            editCustomBasicInfo(){//编辑客户基本信息
                if(Object.keys(this.currentRow).length === 0){
                    this.$message({
                        message:'请先选中需要编辑的客户信息记录！',
                        type:'error'
                    });
                    return false;
                }
                this.activeRow = Object.assign({},this.currentRow);
                this.basicInfoDialogVisible = true;
            },
            resetCustomBasicInfoEdit(){//关闭基本信息弹框后重置表单数据
                this.activeRow = {};
                this.$refs['basicEdit'].$refs['basicForms'].resetFields();
            },
            updateReceivablesSumPrice(data){//更新收款记录的已收总价
                let that = this;
                this.customInfoArray[3].forEach( function(elm, il) {
                    that.$set(that.customInfoArray[3][il],'sum_price',data.sum_price);
                });
            },
            updateCustomRelationRecordItem(callbackData){//新增或更新沟通、测量、方案、收款等记录
                try {
                    let that = this,tempCallbackData = null;
                    if(callbackData.data){
                        if(callbackData.num === 1){//沟通记录
                            tempCallbackData = Object.assign({},callbackData.data.communicate);
                        }else if(callbackData.num === 2){//测量记录
                            tempCallbackData = Object.assign({},callbackData.data.measure);
                        }else{
                            tempCallbackData = Object.assign({},callbackData.data);
                        }
                        if(callbackData.num === 2 && callbackData.data.communicate) {//测量
                            this.customInfoArray[1].push(callbackData.data.communicate);
                        }
                        if(callbackData.type === 'add'){
                            this.customInfoArray[callbackData.num].push(tempCallbackData);
                        }else{//编辑
                            let key_name = 'id';
                            if(callbackData.num === 3){
                                key_name = 'receivables_id';
                            }

                            const index = this.customInfoArray[callbackData.num].findIndex(function(item, index, arr) {
                                return item[key_name] === tempCallbackData[key_name];
                            });
                            this.$set(this.customInfoArray[callbackData.num],index,tempCallbackData);
                        }
                        if(callbackData.num === 3){//收款
                            this.updateReceivablesSumPrice(tempCallbackData);
                        }                    
                        const index2 = this.customLists.findIndex(function(item, index, arr) {
                            return item.id === that.currentRow.id;
                        });
                        if(callbackData.num === 1){//沟通记录
                            if(callbackData.data.information){//保存基本信息
                                let tempCallbackFormData = Object.assign({},callbackData.data.information);
                                this.$set(this.customInfoArray,0,tempCallbackFormData);
                                this.$set(this.customLists,index2,tempCallbackFormData);
                                this.currentRow = tempCallbackFormData;
                                this.$refs['customListsTable'].setCurrentRow(tempCallbackFormData);
                            }
                        }
                        if(callbackData.num !== 4){//非方案
                            //重置基本信息中的status
                            let tempStatus = callbackData.num === 1?callbackData.data.information.status:tempCallbackData.information_status;
                            let tempStatusName = callbackData.num === 1?callbackData.data.information.status_name:tempCallbackData.status_name;
                            this.$set(this.currentRow,'status',tempStatus);
                            this.$set(this.customInfoArray[0],'status',tempStatus);
                            that.$set(that.customLists[index2],'status',tempStatus);
                            that.$set(that.customInfoArray[0],'status_name',tempStatusName);
                            that.$set(that.customLists[index2],'status_name',tempStatusName);
                        }
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            updateCustomProgrammeRecordItem(callbackData){//处理定案数据
                try {
                    let that = this;
                    const index = that.customInfoArray[4].findIndex(function(item, index, arr) {
                        return item.id === callbackData.id;
                    });
                    const index2 = this.customLists.findIndex(function(item, index, arr) {
                        return item.id === that.currentRow.id;
                    });
                    that.customInfoArray[4].forEach( function(item, il) {
                        if(callbackData.final === 'true'){//最终定案
                            if(il === index){
                                that.$set(item,'final_disabled','true');
                                that.$set(item,'final_disabled_name','是');
                            }else{
                                that.$set(item,'final_disabled','false');
                                that.$set(item,'final_disabled_name','否');
                            } 
                        }else{
                            if(il === index){
                                that.$set(item,'disabled','true');
                                that.$set(item,'disabled_name','是');
                            }else{
                                that.$set(item,'disabled','false');
                                that.$set(item,'disabled_name','否');
                            }
                        }
                    });
                    //重置基本信息中的status
                    this.$set(this.currentRow,'status',callbackData.data.information_status);
                    this.$set(this.customInfoArray[0],'status',callbackData.data.information_status);
                    that.$set(that.customLists[index2],'status',callbackData.data.information_status);
                    that.$set(that.customInfoArray[0],'status_name',callbackData.data.status_name);
                    that.$set(that.customLists[index2],'status_name',callbackData.data.status_name);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            updateCustomBasicInfomation(callbackData){//特殊指派 更改客户基本信息
                try{
                    const index = this.customLists.findIndex(function(item, index, arr) {
                        return item.id === callbackData.id;
                    });
                    //重置基本信息中的status
                    this.$set(this.currentRow,'status',callbackData.status);
                    this.$set(this.customInfoArray[0],'status',callbackData.status);
                    this.$set(this.customLists[index],'status',callbackData.status);
                    this.$set(this.customInfoArray[0],'status_name',callbackData.status_name);
                    this.$set(this.customLists[index],'status_name',callbackData.status_name);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async logExportExcel(){//导出excel
                window.location.href='/crm-logExport-'+this.id+'.html?content='+this.searchForm.content+'&status='+this.searchForm.status+'&time='+this.searchForm.time+'&searchName='+this.searchForm.searchName+'&member_id='+this.searchForm.member_id+'&port='+this.searchForm.port+'&s_times='+this.searchForm.s_times+'&e_times='+this.searchForm.e_times+'&usercode='+this.searchForm.usercode+'&special='+this.searchForm.special;
            },
            async deleteInfomation(information_id){
                try {
                    const that = this;
                    const res = await delete_information(information_id);
                    if(res.error){
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        if(res.nologin == 1){//未登录
                            setTimeout(()=>{
                                that.$router.push('/');
                            },3000);
                        }
                        return false;
                    }
                    const index = this.customLists.findIndex(function(item, index, arr) {
                        return item.id === information_id;
                    });
                    this.customLists.splice(index,1);
                    this.activeName = '';
                    this.status = 'down';
                    this.currentRow = {};
                    this.customInfoArray = [{},[],[],[],[],[],[]];//重置
                    this.isGetDataArray = new Array(7).fill("");//重置
                    this.$message({
                        message: res.success,
                        type: 'success'
                    });
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            deleteInformationHandle(){//删除客户基本信息
                const that = this;
                if(Object.keys(this.currentRow).length === 0){
                    this.$message({
                        message:'请先选中需要删除的客户！',
                        type:'error'
                    });
                    return false;
                }
                if(!this.currentRow.id){
                    this.$message({
                        message:'客户信息有误，请刷新页面重试！',
                        type:'error'
                    });
                    return false;
                }
                this.$confirm('确定删除该客户信息吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.deleteInfomation(this.currentRow.id);
                }).catch((e) => {
                    if(e == 'cancel'){
                        return false;
                    }
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                });
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
        padding: 20px 20px 0;
    }
    .totalNum{
        margin-left: 6px;
        width: 90px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 10px 0;
    }
    .customListsTableInfo{
        width: 100%;
        text-align: center;
        display:flex;
        flex-direction: column;
    }
    .add_custom{
        min-width: 120px;
        padding: 10px 14px;
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
        width: 100%;
        height: 36px;
        padding: 9px 0;
        min-width: 80px;
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
    /*顶部6个按钮*/
    .badge-item{
        margin-right: 18px;
    }
    .badge-item .el-button{
        padding: 0;
        width: 100px;
        height: 36px;
        line-height: 36px;
        background: #EAF3FE;
        border: none;
        font-size: 14px;
        color: #005AFF;
        border-radius: 18px;
    }
    .badge-item .el-button.active{
        background: #FFF6EE;
        color: #F25406;
    }
    .totalNum-wrapper{
        font-size: 14px;
        color: #4D4D4D;
        line-height: 36px;
        display: inline-block;
        padding-left: 20px;
    }
    .totalNum-wrapper span{
        font-size: 16px;
        color: #1876EF;
    }
</style>