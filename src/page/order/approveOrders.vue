<template>
    <div class="historyOrdersDialog historyOrders-container">
        <el-form ref="searchForm" :model="searchForm" class='searchForm'>
            <el-row :gutter="10">
                <el-col :span='4'>
                    <el-form-item prop='transaction_id'>
                        <el-input placeholder="请输入订单号" v-model="searchForm.transaction_id" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                    <el-form-item prop='gonghao'>
                        <el-input placeholder="请输入接待人名称" v-model="searchForm.gonghao" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                    <el-form-item prop='mobile'>
                        <el-input placeholder="请输入客户联系方式" v-model="searchForm.mobile" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
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
                <el-col :span="4">
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
                <el-col :span='2'>
                    <el-button type="primary"  @click='searchFormDatas'>查询</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="header-left header-label">
            <span class="txt txt-1">接待人</span>
            <span class="txt txt-2">创建时间</span>
            <span class="txt txt-1">收货人</span>
            <span class="txt txt-3">收货人手机</span>
            <span class="txt txt-4">收货人地区</span>
            <span class="txt txt-5">可用余额</span>
            <span class="txt txt-5">已支付</span>
            <span class="txt txt-5">欠款</span>
            <span class="txt txt-5">订单状态</span>
            <span class="txt txt-5">是否定制</span>
        </div>
        <el-collapse accordion class="orderListsContent" v-model="historyActiveIndex" ref="orderListsContent">
            <el-collapse-item :name="index" v-for="(item,index) in historyOrderDatas" :key="index">
                <template slot="title">
                    <div class="header-left">
                        <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                        <span class="txt txt-1">{{item.saleName}}</span>
                        <span class="txt txt-2">{{item.createtime}}</span>
                        <span class="txt txt-1">{{item.cumtomFormData.acceptOrdMan}}</span>
                        <span class="txt txt-3">{{item.cumtomFormData.acceptOrdPhone}}</span>
                        <span class="txt txt-4">{{item.cumtomFormData.area}}</span>
                        <span class="txt txt-5">{{item.cumtomFormData.sum_money}}</span>
                        <span class="txt txt-5">{{item.finPay}}</span>
                        <span class="txt txt-5" style="color: #F25406;">{{item.uFinPay}}</span>
                        <span class="txt txt-5" v-if="item.cumtomFormData.information_id">{{item.status === 'active' ? '未推送' : item.status === 'finish' ? '已推送' : '作废'}}</span>
                        <span class="txt txt-5" v-else>{{item.status === 'active' ? '未支付' : item.status === 'finish' ? '已支付' : '作废'}}</span>
                        <span class="txt txt-5">{{item.is_custom === 'true' ? '是' : '否'}}</span>
                    </div>
                    <div class="header-right">
                        <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                    </div>
                </template>
                <el-tabs type="border-card" class='el_tabs_footer' >
                    <el-tab-pane label="商品清单">
                        <el-table
                            :data="item.goods"
                            stripe
                            highlight-current-row
                            class='checkoutTableInfo'
                            header-row-class-name='header_row_style'>
                            <el-table-column
                                type="index"
                                :index="1"
                                label='序号'
                                width='80'>
                            </el-table-column>
                            <el-table-column
                                prop="space"
                                label="空间"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop="bn"
                                label="产品型号"
                                min-width='80px'>
                            </el-table-column>
                            <el-table-column
                                prop="product_name"
                                label="产品名称"
                                min-width='120px'
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="is_custom"
                                label="是否定制"
                                min-width='80px'>
                                <template slot-scope="scope">
                                    <span>{{scope.row.is_stand == '1' ? '是' : '否'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop='orderDRemark'
                                label="定制需求"
                                min-width='120px'
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop='send_time'
                                label="交期"
                                min-width='110px'>
                            </el-table-column>
                            <el-table-column
                                prop='canal'
                                label="配送方式"
                                min-width='80px'>
                                <template slot-scope="scope">
                                    <span>{{scope.row.canal == 'wuliu' ? '物流' : scope.row.canal == 'kuaidi' ? '快递' : '自提'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop='fileStr'
                                label="附件"
                                min-width='80px'>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.fileStr !== ''" style="color: #1876EF;cursor: pointer;" @click="uploadFileHandle(scope.row.fileStr)">查看附件</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop='price'
                                label="单价"
                                min-width='110px'>
                            </el-table-column>
                            <el-table-column
                                prop='num'
                                label="数量"
                                min-width='100px'>
                            </el-table-column>
                            <el-table-column
                                prop='sum'
                                label="小计"
                                min-width='120px'>
                            </el-table-column>
                        </el-table>
                        <div class="footer-btns">
                            <el-button type="primary" @click="orderArrearsHandle(item.orderid)" class='submit_btn' v-if="memberRoleId.is_arrears === 'true'">同意</el-button>
                            <template v-if="memberRoleId.member_role_id == 'review'">
                                <el-button type="primary" @click="pushOrderHandle(item.orderid)" class='submit_btn'>推送订单</el-button>
                                <el-button type="primary" @click="rejectOrderHandle(item.orderid)" class='submit_btn'>驳回订单</el-button>
                            </template>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="订单信息">
                        <ul class="orderInfo">
                            <li>
                                <p class="txt"><span class="t0">创建人工号：</span><span class="t1">{{item.usercode}}</span></p>
                                <p class="txt"><span class="t0">下单时间：</span><span class="t1">{{item.createtime}}</span></p>
                                <p class="txt" v-if="item.status === 'active'"><span class="t0">CRM订单号：</span><span class="t1">{{item.orderid}}</span></p>
                                <p class="txt" v-if="item.order_id"><span class="t0">销售单号：</span><span class="t1">{{item.order_id}}</span></p>
                                <p class="txt" v-if="item.tailor_id"><span class="t0">自提单号：</span><span class="t1">{{item.tailor_id}}</span></p>
                                <p class="txt"><span class="t0">仓库交货时间：</span><span class="t1">{{item.cumtomFormData.sendProDate}}</span></p>
                                <p class="txt" v-if="item.status == 'finish'"><span class="t0">配送方式：</span><span class="t1">{{item.method}}</span></p>
                                <p class="txt"><span class="t0">付款方式：</span>
                                    <span class="t1">{{item.payment == 'wxf2fpay' ? '微信支付' : item.payment == 'alif2fpay' ? '支付宝支付' :
                                        item.payment == 'pos' ? 'pos机支付' : item.payment == 'cash' ? '现金支付' : '对公转账'}}</span>
                                </p>
                            </li>
                            <li>
                                <p class="txt"><span class="t0">姓名：</span><span class="t1">{{item.cumtomFormData.acceptOrdMan}}</span></p>
                                <p class="txt"><span class="t0">联系方式：</span><span class="t1">{{item.cumtomFormData.acceptOrdPhone}}</span></p>
                                <p class="txt"><span class="t0">收货地区：</span><span class="t1">{{item.cumtomFormData.area}}</span></p>
                                <p class="txt"><span class="t0">详细地址：</span><span class="t1">{{item.cumtomFormData.addr}}</span></p>
                                <p class="txt"><span class="t0">特殊需求：</span><span class="t1">{{item.cumtomFormData.custReRemark}}</span></p>
                                <p class="txt"><span class="t0">订单备注：</span><span class="t1">{{item.cumtomFormData.orderRemarks}}</span></p>
                            </li>
                            <li class="item3">
                                <p class="txt"><span class="t0">商品总金额：</span><span class="t1">￥{{item.cost_item ? item.cost_item : 0}}</span></p>
                                <p class="txt"><span class="t0">运费：</span><span class="t1">￥{{item.freight ? item.freight : 0}}</span></p>
                                <p class="txt"><span class="t0">优惠金额：</span><span class="t1">￥{{item.discount ? item.discount : 0}}</span></p>
                                <p class="txt"><span class="t0">收款抵扣金额：</span><span class="t1">￥{{item.disCountPay-item.discount}}</span></p>
                                <p class="txt"><span class="t0">入SAP的总优惠金额：</span><span class="t1">￥{{item.disCountPay ? item.disCountPay : 0}}</span></p>
                                <p class="txt"><span class="t0">订单支付金额：</span><span class="t1">￥{{item.payMoney ? item.payMoney : 0}}</span></p>
                                <p class="txt"><span class="t0">入SAP的最终货款：</span><span class="t1">￥{{item.contractPay ? item.contractPay : 0}}</span></p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="订单进度">
                        <div class="orderInfo orderProgress">
                            <template v-for="progress in item.progress">
                                <p class="txt" v-if="progress.ship_status == '0'">
                                    <span class="t0">{{progress.operate_time}}</span>
                                    <span class="t1">{{progress.content}}</span>
                                </p>
                                <p class="txt" v-else>
                                    订单
                                    <el-tooltip placement="top">
                                        <div slot="content">
                                            <template v-for="pro in progress.content.t5">
                                                {{pro}}
                                                <br />
                                            </template>
                                        </div>
                                        <el-button class="t2">{{progress.content.t0}}</el-button>
                                    </el-tooltip>
                                    {{progress.content.t1}}，
                                    物流公司：<a :href="progress.content.t3" target="_blank"><span class="t2">{{progress.content.t2}}</span>（可点击进入物流公司网站跟踪配送），</a>
                                    物流单号：<a href="javascript:void(0);" class="t2" @click="showProgressInfo(progress.content.t4)">{{progress.content.t4}}</a>
                                </p>
                            </template>
                            <!--查看具体的流程节点信息-->
                            <p class="progressNodeInfos">具体的流程节点信息：</p>
                            <el-table
                                    :data="item.progress"
                                    stripe
                                    highlight-current-row
                                    class='checkoutTableInfo'
                                    header-row-class-name='header_row_style'>
                                <el-table-column
                                        type="index"
                                        :index="1"
                                        label='序号'
                                        width='80'>
                                </el-table-column>
                                <el-table-column
                                        prop='behavior'
                                        label="状态说明"
                                        min-width='120px'
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop='operateUser'
                                        label="处理人"
                                        min-width='120px'>
                                </el-table-column>
                                <el-table-column
                                        prop='receive_time'
                                        label="接收时间"
                                        min-width='140px'>
                                </el-table-column>
                                <el-table-column
                                        prop='operate_time'
                                        label="完成时间"
                                        min-width='140px'>
                                </el-table-column>
                                <el-table-column
                                        prop='duration'
                                        label="耗时"
                                        min-width='100px'>
                                </el-table-column>
                                <el-table-column
                                        prop='content'
                                        label="备注"
                                        min-width='120px'
                                        show-overflow-tooltip>
                                </el-table-column>
                            </el-table>
                         </div>
                    </el-tab-pane>
                </el-tabs>
            </el-collapse-item>
        </el-collapse>
        <!--分页-->
        <div class="pagination-footer" v-show="pagination.totalNum > 0">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pagination.pageSize"
                :total="pagination.totalNum"
                @current-change="currentPageChangeHandle">
            </el-pagination>
        </div>
        <!--物流信息-->
        <el-dialog title="物流信息" :visible.sync="progressDialogVisible" >
            <el-steps direction="vertical" :active="1" >
                <template v-for="item in logicDatas">
                    <el-step :title='item.time' :description="item.context"></el-step>
                </template>
            </el-steps>
        </el-dialog>
        <!--图片弹框-->
        <el-dialog title="上传附件" :visible.sync="uploadDialogVisible" class='checkoutUploadDialog readOnlyDialog'>
            <div class="upload-container">
                <p class="title">图片/文件：</p>
                <el-upload
                        ref='upload'
                        action="/crm-upload_image.html"
                        list-type="picture-card"
                        name='mypic[]'
                        disabled
                        :file-list="uploadImageLists"
                        :multiple='true'
                        :on-preview="handlePictureCardPreview">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex' trigger="click">
                    <el-carousel-item v-for="(item,index) in uploadImageLists" :key="index" :name='item.url'>
                        <img :src="item.url" class="image_carousel_item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
        </el-dialog>
        <!--填写推送驳回原因-->
        <el-dialog title="推送驳回" :visible.sync="rejectFormDialogVisible" class="rejectPushOrderDialog" @close="resetRejectFormDialog">
            <el-form ref="rejectForm" :model="rejectForm" labelWidth="80px" :rules="rejectFormRules">
                <el-form-item prop='reason' label="驳回原因">
                    <el-input  placeholder="请输入驳回原因" clearable v-model="rejectForm.reason"></el-input>
                </el-form-item>
                <div class="btns">
                    <el-button type="primary" @click='submitRejectForm' class="submit_btn">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {order_detail,order_arrears,order_logistic,push_order,order_reject} from '@/service/getData';
    import {getUploadIcon} from '@/utils/index';
    import {mapMutations,mapState} from 'vuex';
    export  default {
        name:'approveOrders',
        data(){
            return{
                historyOrderDatas:[],
                searchForm:{
                    gonghao:'',
                    start_time:'',
                    end_time:'',
                    mobile:'',
                    transaction_id:'',//订单号
                    approveOrders:'true'//可审批的
                },
                logicDatas:[],
                historyActiveIndex:'',
                pagination:{
                    page:1,//当前页数
                    pageSize:0,//每页显示的条数
                    totalNum:0//总条数
                },
                progressDialogVisible:false,//物流信息进度弹框
                uploadDialogVisible:false,
                uploadImageLists:[],
                image_id:[],
                initialIndex:0,
                dialogVisible:false,
                rejectFormDialogVisible:false,//推送驳回弹框
                rejectForm:{
                    transaction_id:'',
                    reason:""
                },
                rejectFormRules:{
                    reason: [
                        { required: true, message: '请输入驳回原因', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            const height = this.$refs['orderListsContent'].$el.offsetHeight-80;
            const size = parseInt(height/49);
            this.pagination.pageSize = size;
            this.searchFormDatas();
        },
        computed:{
            ...mapState([
                'memberRoleId'
            ])
        },
        methods:{
            ...mapMutations([
               'EXTRACTORDERSETDATA'
            ]),
            elementRemoveClass(){//元素移除类
                let collapseEles = document.querySelectorAll('.el-collapse .is-active');
                let collapseWraps = document.querySelectorAll('.el-collapse .el-collapse-item__wrap');
                if(collapseEles.length>0){
                    collapseEles.forEach((item)=>{
                        if(item.className.indexOf("el-tabs__item") == -1){
                            item.classList.remove('is-active');
                        }
                    });
                }
                if(collapseWraps.length>0){
                    collapseWraps.forEach((item)=>{
                        item.style.display = 'none';
                    });
                }
            },
            async searchFormDatas(){//搜索历史订单数据
                try {
                    const that = this;
                    const res = await order_detail(this.pagination.page,this.pagination.pageSize,this.searchForm);
                    if(res.error){
                        this.$message({
                            showClose:true,
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
                    this.historyActiveIndex = '';
                    this.historyOrderDatas = res.success;
                    this.pagination.totalNum = res.counts;
                    this.$nextTick(()=>{
                        this.elementRemoveClass();
                    });
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            currentPageChangeHandle(val){
                this.pagination.page = val;
                this.searchFormDatas();
            },
            async showProgressInfo(logistic_no){//查询订单物流进度
                try {
                    if(!logistic_no){
                        this.$message({
                            showClose:true,
                            message: '物流单号有误',
                            type: 'error'
                        });
                        return false;
                    }
                    const res = await order_logistic(logistic_no);
                    if(res.error){
                        this.$message({
                            showClose:true,
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
                    this.logicDatas = res.success;
                    this.progressDialogVisible = true;
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handlePictureCardPreview(file) {//图片预览
                try {
                    let flag = false,fileUrl='';//是否为文件
                    if(file.response && file.response.success && file.response.success.length>0){
                        fileUrl = file.response.success[0].url;
                        if(getUploadIcon(fileUrl)){
                            flag = true;
                        }
                    }else if(file.status == 'success'){
                        fileUrl = file.url;
                        if(getUploadIcon(fileUrl)){
                            flag = true;
                        }
                    }
                    if(flag){//非图片
                        window.open(fileUrl);
                    }else{
                        let tempLists = this.uploadImageLists;
                        const index = tempLists.findIndex(function(item, index, arr) {
                            return item.url == file.url
                        });
                        this.initialIndex = index;
                        this.dialogVisible = true;
                        this.$nextTick(()=>{
                            this.$refs['carouselItems'].setActiveItem(file.url);
                        });
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            uploadFileHandle(item){//查看附件
                try {
                    if(item){
                        const tempImageArray = item.split(';');
                        let imageLists = [];
                        tempImageArray.forEach( function(item, index) {
                            let retUrl = getUploadIcon(item);
                            if(retUrl){
                                imageLists.push({url:retUrl});
                            }else{
                                imageLists.push({url:item});
                            }
                        });
                        this.uploadImageLists = imageLists.slice();
                        this.image_id = tempImageArray.slice();
                        this.uploadDialogVisible = true;
                    }

                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            orderArrearsHandle(transaction_id){//欠款订单同意审批
                const that = this;
                this.$confirm('确定审批该订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(!transaction_id){
                        that.$message({
                            showClose:true,
                            message: '请先选择需要审批的订单',
                            type: 'error'
                        });
                        return false;
                    }
                    order_arrears(transaction_id).then(res=>{
                        if(res.error){
                            that.$message({
                                showClose:true,
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
                        that.$message({
                            showClose:true,
                            message: res.success,
                            type: 'success'
                        });
                        setTimeout(function () {
                            that.searchFormDatas();
                        },3000);
                    });
                }).catch((e) => {
                    if(e == 'cancel'){
                        return false;
                    }
                    that.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                });
            },
            async pushOrderHandle(transaction_id){//推送订单
                const that = this;
                if(!transaction_id){
                    this.$message({
                        showClose:true,
                        message: '订单数据有误，请刷新重试',
                        type: 'error'
                    });
                    return false;
                }
                this.$confirm('即将推送订单信息到OSAP/E3系统，请您确认是否继续操作？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    push_order(transaction_id).then(res=>{
                        if(res.error){
                            this.$message({
                                showClose:true,
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
                        that.$message({
                            showClose:true,
                            message: res.success,
                            type: 'success'
                        });
                        setTimeout(function () {
                            that.searchFormDatas();
                        },3000);
                    }).catch(err=>{
                        this.$message({
                            showClose:true,
                            message: err.message,
                            type: 'error'
                        });
                    });
                }).catch((e) => {
                    if(e == 'cancel'){
                        return false;
                    }
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                });
            },
            rejectOrderHandle(transaction_id){//订单驳回
                const that = this;
                if(!transaction_id){
                    this.$message({
                        showClose:true,
                        message: '订单数据有误，请刷新重试',
                        type: 'error'
                    });
                    return false;
                }
                that.rejectForm.transaction_id = transaction_id;
                that.rejectFormDialogVisible = true;
                // this.$confirm('确定驳回该订单吗？', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     that.rejectForm.transaction_id = transaction_id;
                //     that.rejectFormDialogVisible = true;
                // }).catch((e) => {
                //     if(e == 'cancel'){
                //         return false;
                //     }
                //     this.$message({
                //         showClose:true,
                //         message: e.message,
                //         type: 'error'
                //     });
                // });
            },
            submitRejectForm(){//保存推送驳回原因
                const that = this;
                this.$refs['rejectForm'].validate((valid) => {
                    if (valid) {
                        order_reject(this.rejectForm).then(res=>{
                            if(res.error){
                                that.$message({
                                    showClose:true,
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
                            that.$message({
                                showClose:true,
                                message:res.success,
                                type:'success'
                            });
                            that.rejectFormDialogVisible = false;
                            setTimeout(function () {
                                that.searchFormDatas();
                            },3000);
                        }).catch(error=>{
                            this.$message({
                                showClose:true,
                                message: error.message,
                                type: 'error'
                            });
                        });
                    }
                });
            },
            resetRejectFormDialog(){
                this.$refs['rejectForm'].resetFields();
            }
        }
    }
</script>
<style scoped>
    .historyOrders-container{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .orderListsContent{
        flex: 1;
        overflow-y: auto;
        white-space: nowrap;
        border-bottom: none;
    }
    .searchForm{
        padding: 20px 20px 0;
    }
    .el-date-editor.el-input,.el-button{
        width: 100%;
    }
    .el-table{
        height: 100%;
        text-align: center;
    }
    .orderInfo{
        overflow: hidden;
        font-size: 12px;
        line-height: 22px;
        color: #919191;
        padding: 11px 15px;
        border-top: 1px solid #e0e0e0;
    }
    .orderInfo li{
        float: left;
        list-style-type: none;
        width: 38%;
        margin-right: 2%;
    }
    .orderInfo .item3{
        width: 20%;
        margin-right: 0;
    }
    .orderInfo .txt{
        display: flex;
    }
    .orderInfo .t0{
        width: 84px;
        text-align: right;
    }
    .orderInfo .item3 .t0{
        width: 120px;
    }
    .orderInfo .t1{
        color: #4D4D4D;
        flex: 1;
    }
    .orderProgress .t0{
        width: auto;
        text-align: center;
        margin-right: 13px;
    }
    .orderProgress a{
        text-decoration: none;
        color: #4D4D4D;
    }
    .orderProgress .t2{
        color: #1876EF;
    }
    .orderProgress .el-tooltip{
        width: auto;
        border: none;
        line-height: 22px;
        padding: 0;
    }
    .pagination-footer{
        height: 80px;
        padding-top: 24px;
        box-sizing: border-box;
        text-align: center;
        position: relative;
    }
    .checkoutUploadDialog .upload-container{
        position: relative;
        padding-left: 100px;
    }
    .checkoutUploadDialog .upload-container .title{
        font-size: 12px;
        color: #666666;
        position: absolute;
        left: 30px;
    }
    .header-label{
        height: 36px;
        line-height: 36px;
        background: #f4f4f4;
        padding: 0 10px 0 51px;
    }
    .btns{
        text-align: center;
    }
    .submit_btn{
        width: 120px;
        border-radius: 6px;
    }
    .header-right .txt{
        float: inherit !important;
    }
    .header-left{
        display: flex;
    }
    .el-radio + .el-radio {
        margin-left: 15px;
    }
    .orderListsContent .footer-btns{
        line-height: 50px;
        text-align: center;
    }
    .progressNodeInfos{
        color: #000;
        font-size: 14px;
        line-height: 32px;
        margin-top: 10px;
    }
</style>