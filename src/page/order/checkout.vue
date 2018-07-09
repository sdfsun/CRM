<template>
    <div class="orderCheckout-container orderRelation-container">
        <!--结算页第一页-->
        <div class="section-1" v-if="checkoutSwitch == 0">
            <div class="search-form">
                <el-row>
                    <el-col :span="12">
                        <el-autocomplete
                            :maxlength='11'
                            class="search-input"
                            :disabled="cumtomFormData.information_id !== '' || searchCrmResults.length == 0 && member_id !== ''"
                            :trigger-on-focus="false"
                            :hide-loading="true"
                            :popper-class="searchCrmResults.length>0?'':'hidePopup'"
                            v-model="cumtomFormData.searchPhone"
                            :value="cumtomFormData.searchPhone"
                            :fetch-suggestions="searchCrmInfomation"
                            placeholder="请输入用户联系方式"
                            @keyup.13.native="searchCrmInfomation"
                            @select="handleSelect">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.name }}({{item.status_name}})</div>
                            </template>
                            <el-button slot="append" @click="logoutCustom" v-if="cumtomFormData.information_id !== '' || (searchCrmResults.length == 0 && member_id !== '')">退出</el-button>
                            <el-button slot="append" @click="searchCrmInfomation" v-else>搜索</el-button>
                        </el-autocomplete>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-button type="primary" class="getHistoryOrders" @click="getHistoryOrders('mounted')">历史订单</el-button>
                        <el-button type="primary" class="getHistoryOrders" @click="resetOrderHandle">重新下单</el-button>
                    </el-col>
                </el-row>
                <p class="tips">{{tips}}</p>
            </div>
            <div class="custom-info">
                <el-row :gutter="20" v-if="cumtomFormData.information_id">
                    <el-col :span="5">
                        <label class="txt-label">可用余额：</label>
                        <el-input  class="formItem" readonly :value="cumtomFormData.sum_money">
                            <i slot="suffix">元</i>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">可用抵扣金额：</label>
                        <el-input  class="formItem" readonly :value="cumtomFormData.last_discount">
                            <i slot="suffix">元</i>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">当前欠款金额：</label>
                        <el-input  class="formItem" readonly :value="cumtomFormData.uFinPay">
                            <i slot="suffix">元</i>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="5">
                        <label class="txt-label">姓名：</label>
                        <el-input  placeholder="请输入姓名" clearable class="formItem" v-model="cumtomFormData.acceptOrdMan"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">联系方式：</label>
                        <el-input  placeholder="请输入联系方式" maxlength='11' clearable class="formItem" v-model="cumtomFormData.acceptOrdPhone"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">地区：</label>
                        <el-cascader
                            v-model="cumtomFormData.area"
                            :options="areaOptions"
                            clearable
                            class="formItem"
                            @change="areaChangeHandle">
                        </el-cascader>
                    </el-col>
                    <el-col :span="7">
                        <label class="txt-label">详细地址：</label>
                        <el-input  placeholder="请输入详细地址" clearable class="formItem" v-model="cumtomFormData.addr"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="5" style="line-height: 36px;">
                        <label class="txt-label">是否有电梯：</label>
                        <el-radio-group v-model="cumtomFormData.liftSel">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">仓库完成时间：</label>
                        <el-date-picker
                            v-model="cumtomFormData.sendProDate"
                            type="date"
                            placeholder="交期时间"
                            value-format='yyyy-MM-dd'
                            clearable
                            style="flex: 1;"
                            @change="sendProDateChangeHandle">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">合同编号：</label>
                        <el-input  placeholder="请输入合同编号" clearable class="formItem" v-model="cumtomFormData.contractCode"></el-input>
                    </el-col>
                    <el-col :span="7">
                        <label class="txt-label">表头附件：</label>
                        <el-button type="primary" class="biaotoufujian" @click="uploadFileHandle('aaa')">
                            <template v-if="this.cumtomFormData.fileUrls">
                                <i class="crmiconfont icon-ic_folder_close" style="margin-right: 7px;"></i>添加
                            </template>
                            <template v-else>
                                上传附件
                            </template>
                        </el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="11">
                        <label class="txt-label">订单备注：</label>
                        <el-input  placeholder="请输入订单备注" clearable class="formItem" v-model="cumtomFormData.orderRemarks"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <label class="txt-label">客户特殊要求：</label>
                        <el-input  placeholder="请输入客户特殊要求" clearable class="formItem" v-model="cumtomFormData.custReRemark"></el-input>
                    </el-col>
                    <el-col :span="7">
                        <label class="txt-label">发票信息：</label>
                        <el-button type="primary" class="biaotoufujian" @click="setInvoiceHandle(true)">
                            设置
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    ref='checkoutTableInfo'
                    :data="cartGoods"
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
                    min-width='120px'
                    class-name="alignCenterColumn"
                    :show-overflow-tooltip='true'>
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.space"  @change="proAtributeChangeHandle(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bn"
                    label="产品型号"
                    min-width='110px'
                    :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column
                    prop="product_name"
                    label="产品名称"
                    min-width='180px'
                    class-name="alignCenterColumn"
                    :show-overflow-tooltip='true'>
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.product_name"  v-if="scope.row.is_stand == 1"></el-input>
                        <span v-else>{{scope.row.product_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_custom"
                    label="是否定制"
                    min-width='80px'>
                    <template slot-scope="scope">
                        <el-checkbox  v-if="scope.row.install_flag == 'true'" disabled></el-checkbox>
                        <template v-else>
                            <el-checkbox checked v-if="scope.row.is_custom == 'true' && scope.row.is_stand == 1 || scope.row.install_flag == 'true'" disabled></el-checkbox>
                            <el-checkbox v-model="scope.row.is_standSelected" @change="updateGoodDataHandle(scope.$index,scope.row)" v-else></el-checkbox>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='orderDRemark'
                    label="定制需求"
                    min-width='140px'
                    class-name="alignCenterColumn"
                    :show-overflow-tooltip='true'>
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.orderDRemark"  v-if="scope.row.install_flag == 'false'"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='send_time'
                    label="交期"
                    min-width='160px'>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.send_time"
                            type="date"
                            placeholder="交期时间"
                            value-format='yyyy-MM-dd'
                            @change="proAtributeChangeHandle(scope.row)">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='canal'
                    label="配送方式"
                    min-width='110px'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.install_flag == 'true'">{{scope.row.canal == "ziti" ? "自提" : scope.row.canal == "wuliu" ? "物流" : "快递"}}</span>
                        <template v-else>
                            <el-select v-model="scope.row.canal" placeholder="请选择" v-if="scope.row.channel == 'store'" @change="canalChangeHandle(scope.$index,scope.row)">
                                <el-option key="ziti" label="自提" value="ziti"></el-option>
                                <el-option :key="method" :label="method == 'kuaidi'?'快递':'物流'" :value="method"></el-option>
                            </el-select>
                            <el-select v-model="scope.row.canal" placeholder="请选择" v-else>
                                <el-option :key="scope.row.canal" :label="scope.row.canal == 'kuaidi'?'快递':'物流'" :value="scope.row.canal"></el-option>
                            </el-select>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='fileStr'
                    label="附件"
                    min-width='100px'>
                    <template slot-scope="scope">
                        <template v-if="scope.row.install_flag == 'false'">
                            <span style="color: #1876EF;cursor: pointer;" @click="uploadFileHandle(scope.$index)" v-if="scope.row.fileStr == ''">上传附件</span>
                            <span style="color: #1876EF;cursor: pointer;" @click="uploadFileHandle(scope.$index)" v-if="scope.row.fileStr !== ''"><i class="crmiconfont icon-ic_folder_close" style="margin-right: 7px;"></i>添加</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='price'
                    label="单价"
                    min-width='130px'
                    class-name="alignCenterColumn">
                    <template slot-scope='scope'>
                        <el-input v-model="scope.row.price" @change="priceChangeHandle(scope.$index,scope.row)" clearable v-if="scope.row.is_stand == 1"></el-input>
                        <span v-else>{{scope.row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='num'
                    label="数量"
                    min-width='100px'
                    class-name="inputNumColumn">
                    <template slot-scope='scope'>
                        <span v-if="scope.row.install_flag == 'true'">{{scope.row.num}}</span>
                        <template v-else>
                            <el-input-number v-model="scope.row.num" :min="1" :max="scope.row.org_store" v-if="scope.row.canal == 'ziti'" @change="numChangeHandle(scope.$index,scope.row)"></el-input-number>
                            <el-input-number v-model="scope.row.num" :min="1" :max="scope.row.store" @change="numChangeHandle(scope.$index,scope.row)" v-else></el-input-number>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='sum'
                    label="小计"
                    min-width='100px'>
                    <template slot-scope="scope">
                        <span>￥{{scope.row.sum}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="编辑"
                    min-width='100px'>
                    <template slot-scope="scope">
                        <a href="javascript:void(0);" class="operation-btn" @click="deleteGoodHandle(scope.$index,scope.row)"><i class="crmiconfont icon-shanchu"></i></a>
                        <a href="javascript:void(0);" v-if='scope.row.install_flag == "false"' class="operation-btn" :class="{disabled:scope.row.gifs_flag == 'true'}" @click="markGiftHandle(scope.$index,scope.row)"><i class="crmiconfont icon-zengpin" style="font-size: 18px;"></i></a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer-info">
                <div class="txt-left">
                    <div class="txt-item">
                        商品总价：<span class="t1">￥</span><span class="t2">{{totalMoney-freight}}</span>
                    </div>
                    <div class="txt-item">
                        运费：<span class="t1">￥</span><span class="t2">{{freight}}</span>
                    </div>
                    <div class="txt-item txt-item2">
                        优惠金额：<div class="t2"><span class="t1">￥</span><el-input  class="formItem" v-model="discountTemp" :value="discount" @change="discountChangeHandle"></el-input></div>
                    </div>
                    <div class="txt-item">
                        实付金额：<span class="t1">￥</span><span class="t2">{{payMoney}}</span>
                    </div>
                </div>
                <div class="t-right">
                    <el-button type="primary" @click="buyService" class='buyService_btn' v-show="buyInstallFlag == 'true'">购买安装服务</el-button>
                    <el-button type="primary" @click="submitOrder" class='submit_btn'>保存</el-button>
                </div>
            </div>
        </div>
        <!--结算页第二页-->
        <div class="section-2" v-else>
            <div class="section-2-wrapper">
                <div class="custom-info">
                    <p class="title">收货信息</p>
                    姓名：<span class="txt">{{checkoutDetailInfo.acceptOrdMan}}</span>
                    联系方式：<span class="txt">{{checkoutDetailInfo.acceptOrdPhone}}</span>
                    详细地址：<span class="txt">{{checkoutDetailInfo.sendProAddress}}</span>
                </div>
                <div class="goods-info">
                    <p class="title">商品清单</p>
                    <el-table
                        ref='checkoutDetailInfo'
                        :data="checkoutDetailInfo.transaction_items"
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
                            prop="saleCode"
                            label="产品型号"
                            min-width='100px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop="materialDesc"
                            label="产品名称"
                            min-width='160px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop="is_custom"
                            label="是否定制"
                            min-width='80px'>
                            <template slot-scope="scope">
                                <span style="color: #F25406;" v-if="scope.row.noStandargPro == 1">是</span>
                                <span v-else>否</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop='sendProDate'
                            label="交期"
                            min-width='110px'>
                        </el-table-column>
                        <el-table-column
                            prop='price'
                            label="商品单价"
                            min-width='100px'>
                        </el-table-column>
                        <el-table-column
                            prop='orderCount'
                            label="数量"
                            min-width='90px'>
                        </el-table-column>
                        <el-table-column
                            prop='orderDRemark'
                            label="定制需求"
                            min-width='140px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop='fileStr'
                            label="附件"
                            min-width='80px'>
                            <template slot-scope="scope">
                                <span v-if="scope.row.fileStr" @click="uploadFileHandle('lookFiles',scope.$index)" style="cursor:pointer;color: #1876EF;">查看</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="detail-info">
                    <p class="title">订单信息</p>
                    <p class="txt">创建人工号：<span class="t1">{{checkoutDetailInfo.usercode}}</span></p>
                    <p class="txt">订单编号：<span class="t1">{{checkoutDetailInfo.transaction_id}}</span></p>
                    <p class="txt">合同编码：<span class="t1">{{checkoutDetailInfo.contractCode}}</span></p>
                    <p class="txt">仓库交货时间：<span class="t1">{{checkoutDetailInfo.sendProDate}}</span></p>
                    <p class="txt">表头附件：
                        <span class="t2" @click="uploadFileHandle('lookFiles')" v-if="checkoutDetailInfo.fileUrls">查看附件</span>
                    </p>
                    <p class="txt">是否有电梯：<span class="t1">{{checkoutDetailInfo.liftSel=="true"?"是":"否"}}</span></p>
                    <ul class="invoice-infos" v-if="invoice.tax_company">
                        <li>
                            <p class="txt">发票类型：<span class="t1">{{invoice.tax_type == 'personal' ? '个人' : '公司'}}</span></p>
                        </li>
                        <li>
                            <p class="txt">发票抬头：<span class="t1">{{invoice.tax_company}}</span></p>
                        </li>
                        <li>
                            <p class="txt">发票内容：<span class="t1">{{invoice.tax_content}}</span></p>
                        </li>
                        <li v-if="invoice.tax_type == 'company'">
                            <p class="txt">纳税人识别号：<span class="t1">{{invoice.tax_no}}</span></p>
                        </li>
                        <li>
                            <p class="txt">电子发票文件：<span class="t2" v-if="invoice.invoice_file" @click="uploadFileHandle('lookFiles','invoice')">查看</span></p>
                        </li>
                        <li>
                            <p class="txt">是否开增值税发票：<span class="t1">{{invoice.vat_invoice == 'true' ? '是' : '否'}}</span></p>
                        </li>
                        <li>
                            <p class="txt">发票备注：<span class="t1">{{invoice.invoice_mark}}</span></p>
                        </li>
                    </ul>
                    <p class="txt">客户特殊要求：<span class="t1">{{checkoutDetailInfo.custReRemark}}</span></p>
                    <p class="txt">订单备注：<span class="t1">{{checkoutDetailInfo.orderRemarks}}</span></p>
                    <p class="txt">
                        收款折扣金额：<span class="t3">￥{{checkoutDetailInfo.discount}}</span>
                        订单支付金额：<span class="t3">￥{{checkoutDetailInfo.final_amount}}</span>
                        入SAP总优惠金额：<span class="t3">￥{{checkoutDetailInfo.disCountPay}}</span>
                        入SAP的最终货款：<span class="t3">￥{{checkoutDetailInfo.contractPay}}</span>
                    </p>
                </div>
            </div>
            <div class="footer-info">
                <div class="txt-left">
                    <div class="txt-item">
                        商品总价：<span class="t2">￥{{checkoutDetailInfo.cost_item}}</span>
                    </div>
                    <div class="txt-item">
                        运费：<span class="t2">￥{{checkoutDetailInfo.cost_freight}}</span>
                    </div>
                    <div class="txt-item">
                        优惠金额：<span class="t2">￥{{checkoutDetailInfo.pmt_order}}</span>
                    </div>
                    <div class="txt-item">
                        实付金额：<span class="t2">￥{{checkoutDetailInfo.final_amount}}</span>
                    </div>
                </div>
                <div class="t-right">
                    <el-button type="primary" @click="goBackCheckoutHandle" class='submit_btn'>返回</el-button>
                    <el-button type="primary" @click="pushOrderHandle" class='submit_btn' :disabled="checkoutDetailInfo.uFinPay > 0 ? true : false" v-if="checkoutDetailInfo.information_id">推送订单</el-button>
                    <el-button type="primary" @click="payOrderHandle('3')" class='submit_btn' v-else>支付</el-button>
                    <el-button type="primary" @click="resetOrderHandle" class='submit_btn' v-if="checkoutDetailInfo.uFinPay > 0">重新下单</el-button>
                </div>
            </div>
        </div>
        <!--上传图片弹框-->
        <el-dialog title="上传附件" :visible.sync="uploadDialogVisible" class='checkoutUploadDialog' :class='{readOnlyDialog:uploadReadonlyFlag}' :close-on-click-modal='false'>
            <div class="upload-container">
                <p class="title">图片/文件：</p>
                <el-upload
                        ref='upload'
                        action="/crm-upload_image.html"
                        list-type="picture-card"
                        name='mypic[]'
                        :disabled = 'uploadReadonlyFlag'
                        :file-list="uploadImageLists"
                        :multiple='true'
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload"
                        :on-remove="handleRemove"
                        :on-success='handleSuccess'>
                        <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex'>
                    <el-carousel-item v-for="(item,index) in uploadImageLists" :key="index" :name='item.url'>
                        <img :src="item.url" class="image_carousel_item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <div class="btns" v-show="!uploadReadonlyFlag">
                <el-button type="primary" @click="saveUploadImages" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
        <!--历史订单-->
        <el-dialog title="历史订单" :visible.sync="historyOrdersDialogVisible" class='historyOrdersDialog' :close-on-click-modal='false' @close="resetHistoryDialog">
            <div class="header-left header-label">
                <span class="txt txt-0">订单号</span>
                <span class="txt txt-1">接待人</span>
                <span class="txt txt-2">创建时间</span>
                <span class="txt txt-1">收货人</span>
                <span class="txt txt-3">收货人手机</span>
                <span class="txt txt-4">收货人地区</span>
                <span class="txt txt-5">可用余额</span>
                <span class="txt txt-5">已支付</span>
                <span class="txt txt-5">未支付</span>
            </div>
            <el-collapse accordion v-model="historyActiveIndex" @change="historyOrdersChangeHandle">
                <el-collapse-item :name="index" v-for="(item,index) in historyOrders" :key="index">
                    <template slot="title">
                        <div class="header-left">
                            <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                            <span class="txt txt-0">{{item.orderid}}</span>
                            <span class="txt txt-1">{{item.saleName}}</span>
                            <span class="txt txt-2">{{item.createtime}}</span>
                            <span class="txt txt-1">{{item.cumtomFormData.acceptOrdMan}}</span>
                            <span class="txt txt-3">{{item.cumtomFormData.acceptOrdPhone}}</span>
                            <span class="txt txt-4">{{item.cumtomFormData.area}}</span>
                            <span class="txt txt-5">{{item.cumtomFormData.sum_money}}</span>
                            <span class="txt txt-5">{{item.finPay}}</span>
                            <span class="txt txt-5" style="color: #F25406;">{{item.uFinPay}}</span>
                        </div>
                        <div class="header-right">
                            <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                        </div>
                    </template>
                    <el-table
                        :data="item.goods"
                        stripe
                        highlight-current-row
                        class='historyOrdersTableInfo'
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
                            min-width='80px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop="bn"
                            label="产品型号"
                            min-width='80px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop="product_name"
                            label="产品名称"
                            min-width='120px'
                            :show-overflow-tooltip='true'>
                        </el-table-column>
                        <el-table-column
                            prop="is_custom"
                            label="是否定制"
                            min-width='80px'>
                            <template slot-scope="scope">
                                <span>{{scope.row.is_custom == 'true' ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop='orderDRemark'
                            label="定制需求"
                            min-width='130px'
                            :show-overflow-tooltip='true'>
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
                </el-collapse-item>
            </el-collapse>
            <div class="history-btns">
                <el-button type="primary" @click="extractOrder" class='submit_btn' v-if="!extractOrderFlag" :disabled="historyOrders[historyActiveIndex] ? historyOrders[historyActiveIndex].status !== 'active' ? true : false : false">提取订单</el-button>
                <template v-else>
                    <el-button type="primary"  class='submit_btn' @click="extractOrder('confirm')">确定</el-button>
                    <p class="extractOrderTips">是否确认提取历史订单替换当前订单？</p>
                </template>
            </div>
        </el-dialog>
        <!--购买安装服务-->
        <el-dialog title="购买安装服务" :visible.sync="serviceDialogVisible"  class='serviceListsDialog' :close-on-click-modal='false'>
            <ul>
                <li v-for="(item,index) in serviceLists" :class="{active:item.selected}" @click="chooseService(index)">
                    <img :src="item.image_default_id" alt="" class="s-img">
                    <span class="s-title">{{item.product_name}}</span>
                    <span class="s-num">{{item.num}}</span>
                    <span class="s-price">{{item.price}}</span>
                    <i class="crmiconfont icon--xuankuang"></i>
                </li>
            </ul>
            <div class="service-btns">
                <div class="service-txt">
                    <p class="s-tips">安装费不足80元，按80元结算</p>
                    <p>总金额：<span class="s-t1">￥</span><span class="s-t2">{{serviceListsMoney}}</span></p>
                </div>
                <el-button type="primary" class='submit_btn' @click="confirmBuyService">确定</el-button>
            </div>
        </el-dialog>
        <!--发票-->
        <el-dialog title="订单发票" :visible.sync="invoiceDialogVisible"  class='invoiceDialog' :close-on-click-modal='false' @close="resetInvoiceDialog">
            <el-form ref="invoiceForm" label-width="110px" :rules="invoiceFormRules" :model="invoiceForm">
                <el-form-item label="发票抬头：" prop='tax_company'>
                    <el-input v-model="invoiceForm.tax_company" placeholder='请输入发票抬头' clearable></el-input>
                </el-form-item>
                <el-form-item label="发票内容：" prop='tax_content'>
                    <el-input type="textarea" :autosize="{ minRows: 4}" v-model="invoiceForm.tax_content" placeholder='请输入发票内容' clearable></el-input>
                </el-form-item>
                <el-form-item label="发票类型：" prop='tax_type'>
                    <el-select v-model="invoiceForm.tax_type" placeholder="发票类型">
                        <el-option
                            v-for="item in invoiceTypes"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="纳税人识别号：" prop='tax_no' v-if="invoiceForm.tax_type == 'company'">
                    <el-input v-model="invoiceForm.tax_no" placeholder='请输入纳税人识别号' clearable></el-input>
                </el-form-item>
                <el-form-item label="电子发票文件：">
                    <el-button type="primary" class='chooseFile-btn' @click="uploadFileHandle('invoice')">选择文件</el-button>
                </el-form-item>
                <el-form-item label='是否开增值税发票：' prop='vat_invoice'>
                    <el-radio-group v-model="invoiceForm.vat_invoice">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="纸质发票备注：" prop='invoice_mark'>
                    <el-input type="textarea" :autosize="{ minRows: 4}" v-model="invoiceForm.invoice_mark" placeholder='请输入发票备注' clearable></el-input>
                </el-form-item>
            </el-form>
            <div class="invoice-btns">
                <el-button type="primary" class='submit_btn' @click="setInvoiceHandle(false)">保存</el-button>
            </div>
        </el-dialog>
        <!--支付弹框-->
        <el-dialog title="" :visible.sync="payOrderDialogVisible"  class='invoiceDialog payOrderDialog' :close-on-click-modal='false' :before-close="closePayOrderDialog">
            <p class="money">该订单需支付：<span class="t1">￥</span><span class="t2">{{checkoutDetailInfo.final_amount}}</span></p>
            <template v-if='!payOrderForm.showQrcodeVisible'>
                <ul>
                    <li v-for="(item,index) in payMethod" :class="[payOrderForm.curMethod==index?'active':'','method'+index]"  @click="choosePayMethod(item.value,index)">
                        <i class="crmiconfont" :class="item.icon"></i>
                        {{item.label}}
                        <i class="iconfont el-icon-check"></i>
                    </li>
                </ul>
                <div class="payOrder-btns">
                    <el-button type="primary" class='submit_btn' @click="orderDeadHandle">订单作废</el-button>
                    <el-button type="primary" class='submit_btn' @click="payOrderHandle('1')">确定</el-button>
                </div>
            </template>
            <!-- 二维码 -->
            <div class="qrCode_container" v-else>
                <p class="method_name">{{payOrderForm.title}}</p>
                <iframe :src="payOrderForm.url" :class="{iframeEl:payOrderForm.payment=='alif2fpay'}"></iframe>
                <p class="payOrderTips">{{payOrderForm.message}}</p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { region } from '@/service/region';
    import {mapState,mapActions,mapMutations} from 'vuex';
    import {getUploadIcon} from '@/utils/index';
    import {post_login,pre_order,service,push_order,order_detail,ajax_pay,query_new,pay_new,order_dead} from '@/service/getData';
    const priceRegx = /(^[1-9]\d*(\.\d*)?$)|(^0(\.\d*)?$)/;//校验金额
    const phoneRegx = /^1[3456789]\d{9}$/;//校验手机

    export default {
        name:'checkout',
        data(){
            return{
                tips:'*请先输入客户联系方式判断是否为CRM用户，再行下单',
                areaOptions:region,
                uploadDialogVisible:false,
                uploadReadonlyFlag:false,
                uploadImageLists:[],
                image_id:[],
                initialIndex:0,
                dialogVisible:false,
                goodIndex:null,//购物车产品索引 用于上传图片
                discountTemp:this.$store.state.order.discount,
                searchCrmResults:[],//存储多个crm账户
                historyOrdersDialogVisible:false,//历史订单弹框是否可见
                historyActiveIndex:'',//历史订单当前选中的订单索引
                extractOrderFlag:false,//是否确认提取历史订单
                serviceDialogVisible:false,//是否显示安装服务弹框
                serviceLists:[],//安装服务列表
                serviceListsMoney:0,//安装服务价格
                invoiceDialogVisible:false,
                invoiceForm:{
                    tax_company:'',//发票抬头
                    tax_content:'',//发票内容
                    tax_type:'personal',//发票类型
                    tax_no:'',//纳税人识别号
                    invoice_file:'',//电子发票文件
                    vat_invoice:'false',//是否开增值税发票
                    invoice_mark:''//发票备注
                },
                invoiceFormRules:{
                    tax_company: [
                        { required: true, message: '请输入发票抬头', trigger: 'blur' }
                    ],
                    tax_content: [
                        { required: true, message: '请输入发票内容', trigger: 'blur' }
                    ],
                    tax_no: [
                        { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
                    ]
                },
                invoiceTypes:[
                    {
                        val:'personal',
                        label:'个人发票'
                    },
                    {
                        val:'company',
                        label:'公司发票'
                    }
                ],
                searchCb:null,
                payMethod:[
                    {
                        icon:'icon-weixin_',
                        label:'微信支付',
                        value:'wxf2fpay'
                    },
                    {
                        icon:'icon-zhifubao',
                        label:'支付宝支付',
                        value:'alif2fpay'
                    },
                    {
                        icon:'icon-posjizhifu',
                        label:'POS机支付',
                        value:'pos'
                    },
                    {
                        icon:'icon-xianjinzhifu',
                        label:'现金支付',
                        value:'cash'
                    },
                    {
                        icon:'icon-duigongzhuanzhang',
                        label:'对公转账',
                        value:'transfer'
                    }
                ],
                payOrderDialogVisible:false,//支付弹框
                qrcodeTime:null,//支付定时器
                payOrderForm:{
                    showQrcodeVisible:false,//是否显示二维码
                    payment:'wxf2fpay',//当前选中的支付方式
                    curMethod:0,//当前选中的支付方式索引
                    title:'',
                    message:''
                },
                historyOrders:[],//历史订单
                pageForm:{
                    page:1,
                    range:80,
                    HAS_DATA:true,
                    isOn:true,
                    elWraper:null
                }
            }
        },
        computed:{
            ...mapState({
                cartGoods:state => state.order.goods,
                method:state => state.order.method,
                totalMoney:state => state.order.totalMoney,
                payMoney:state => state.order.payMoney,
                discount:state => state.order.discount,
                freight:state => state.order.freight,
                checkoutSwitch:state => state.order.checkoutSwitch,
                checkoutDetailInfo:state => state.order.checkoutDetailInfo,
                buyInstallFlag:state => state.order.buyInstallFlag,
                invoice:state => state.order.invoice,
                member_id:state => state.order.member_id
            }),
            cumtomFormData:{
                get:function () {
                    return this.$store.state.order.cumtomFormData;
                },
                set:function (val) {
                    this.$store.state.order.cumtomFormData = val;
                }
            }
        },
        methods:{
            ...mapMutations([
                'UPDATEGOODDATA',
                'DELETEGOOD',
                'UPDATEORDERMONEY',
                'UPDATECUSTOMINFO',
                'UPDATECHECKOUTDETAILINFO',
                'SETMEMBERID',
                'UPDATEDISCOUNT',
                'UPDATECHECKOUTSWITCH',
                'RESETCHECKOUTDATA',
                'UPDATEINVOICEDATA',
                'EXTRACTORDERSETDATA'
            ]),
            ...mapActions([
                'updateGood',
                'setOrderMethod',
                'setOrderTotalMoney',
                'setBuyInstallFlag',
                'updateServiceGood',
                'addService'
            ]),
            async searchCrmInfomation(queryString, cb){//判断是否为crm客户
                try {
                    if(cb && !this.searchCb){
                        this.searchCb = cb;
                    }
                    if(typeof queryString !== 'string'){//回车事件 或 点击事件
                        if(!this.cumtomFormData.searchPhone){
                            return false;
                        }
                        if(!phoneRegx.test(this.cumtomFormData.searchPhone)){
                            this.$message({
                                message: '请输入正确的手机格式',
                                type: 'error'
                            });
                            return false;
                        }
                        const res = await post_login(this.cumtomFormData.searchPhone);
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
                        if(res.success.information && res.success.information.length == 1){//一个账户
                            //赋值
                            this.UPDATECUSTOMINFO(res.success.information[0]);
                            if(res.success.information[0] && res.success.information[0].id){//CRM用户
                                this.tips = '该号码为CRM用户';
                            }else{
                                this.tips = '该号码为商城用户';
                            }
                            this.areaChangeHandle();
                        }else if(res.success.information.length >1){//多个crm账户
                            this.searchCrmResults = res.success.information;
                            this.searchCb(this.searchCrmResults);
                        }else{
                            this.tips = '该号码既不是CRM用户，也不是商城用户';
                            this.UPDATECUSTOMINFO({});
                            this.areaChangeHandle();
                        }
                        this.SETMEMBERID(res.success.member_id);
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handleSelect(item){//选择CRM账户
                try {
                    this.UPDATECUSTOMINFO(item);
                    this.tips = '该号码为CRM用户';
                    this.searchCrmResults = [];
                    this.areaChangeHandle();
                }catch(e){
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            proAtributeChangeHandle(item){//产品空间更改
                try {
                    if(item.install_pid){//查看是否有购买安装服务 并修改安装服务的配送方式
                        const goods = this.cartGoods;
                        const serviceIndex = goods.findIndex(function (el) {
                            return item.install_pid == el.product_id;
                        });
                        if(serviceIndex !== -1){
                            let sItem = goods[serviceIndex];
                            let relaPros = sItem.parent_id;
                            let tempItem,temp=false;
                            relaPros.forEach(function (e1, index) {
                                goods.forEach(function (e2, il) {
                                    if (e1 == e2.product_id) {
                                        if(!temp) {//删除产品时 重置安装服务的配送方式及空间
                                            if(!tempItem){
                                                tempItem = e2;
                                            }
                                            if(e2.canal == 'wuliu' || e2.canal == 'kuaidi'){
                                                tempItem = e2;
                                                temp = true;
                                            }
                                        }
                                    }
                                });
                            });
                            if(item.product_id == tempItem.product_id){//如果当前修改的产品是控制安装服务的产品 则更新对应的安装服务
                                sItem.space = tempItem.space;
                                sItem.send_time = tempItem.send_time;
                                this.UPDATEGOODDATA({index:serviceIndex,goodData:sItem});//更新安装服务
                            }
                        }
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            updateGoodDataHandle(index,item){//是否定制 如果自提产品，选择了定制，则默认修改配送方式为快递或物流
                try {
                    item.is_stand = item.is_standSelected ? 1 : 0;
                    if(item.is_stand == 1 && item.canal == 'ziti'){
                        item.canal = this.method;
                    }
                    this.UPDATEGOODDATA({index:index,goodData:item});
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            numChangeHandle(index,item){//购物车数量变更时触发函数
                try {
                    this.updateGood({'index':index,'res':item});
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            canalChangeHandle(index,item){//产品配送方式更改
                try {
                    const that = this;
                    //配送方式改变 同时修改产品数量
                    let num = item.num;
                    if(item.canal == 'ziti'){
                        num = num > item.org_store ? item.org_store : num;
                    }else{
                        num = num > item.store ? item.store : num;
                    }
                    const sum = Number(num*item.price);
                    item.num = num;
                    item.sum = sum;
                    this.UPDATEGOODDATA({index:index,goodData:item});
                    if(item.install_pid){//查看是否有购买安装服务 并修改安装服务的配送方式
                        this.updateServiceGood({proItem:item});
                    }
                    that.setOrderMethod();//重置产品配送方式
                    that.setOrderTotalMoney();//重新计算总金额  如果配送方式都为自提的话，那运费既为0
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            priceChangeHandle(index,item){//价格更改
                try {
                    if(!priceRegx.test(item.price)){
                        item.price = item.vprice;
                        return false;
                    }
                    item.vprice = item.price;
                    item.sum = Number(item.num*item.price);
                    this.UPDATEGOODDATA({index:index,goodData:item});
                    this.setOrderTotalMoney();//重置总价格
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            deleteGoodHandle(index,item){//删除产品
                const that = this;
                this.$confirm('确定删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.DELETEGOOD(index);
                    if(item.install_flag == 'false' && item.install_pid){//产品删除时 需要判断是否有对应的安装服务 并修改安装服务的数量
                        that.updateServiceGood({proItem:item});//更改安装服务数量或者删除安装服务
                    }
                    that.setOrderMethod();
                    that.setOrderTotalMoney();
                    that.setBuyInstallFlag();
                }).catch((e) => {
                    if(e == 'cancel'){
                        return false;
                    }
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                });
            },
            markGiftHandle(index,item){//标记赠品
                try {
                    item.gifs_flag = item.gifs_flag == 'true' ? 'false' : 'true';
                    if(item.gifs_flag == 'true'){//标记赠品
                        item.price = 0;
                    }else{//取消赠品
                        item.price = item.vprice;
                    }
                    item.sum = Number(item.num*item.price);
                    this.UPDATEGOODDATA({index:index,goodData:item});
                    this.setOrderTotalMoney();//重置总价格
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handleRemove(file, fileList) {//删除图片
                try {
                    if(file.response && file.response.success && file.response.success.length>0 || file.status == 'success'){
                        var tempImageIds = [];
                        fileList.forEach( function(item, index) {
                            if(item.response && item.response.success && item.response.success.length>0){
                                tempImageIds.push(item.response.success[0].url);
                            }else if(item.status == 'success'){
                                tempImageIds.push(item.url);
                            }
                        });
                        this.uploadImageLists = fileList;
                        this.image_id = tempImageIds.slice();
                    }
                } catch(e) {
                    this.$message({
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
                        this.$refs['carouselItems'].setActiveItem(file.url);
                    }
                } catch(e) {
                    // this.$message({
                    //     message: e.message,
                    //     type: 'error'
                    // });
                }
            },
            handleSuccess(response, file, fileList){//上传成功
                try {
                    if(response.success && response.success.length>0){
                        if(!this.image_id){
                            this.image_id = [];
                        }
                        this.image_id.push(response.success[0].url);
                    }
                    this.uploadImageLists = fileList;
                    let fileUrl = getUploadIcon(file.name);
                    if(fileUrl){
                        file.url = fileUrl;
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            beforeAvatarUpload(file) {//上传文件大小控制
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message({
                        message:'上传头像图片大小不能超过 2MB!',
                        type:'error'
                    });
                    return false;
                }
                return isLt2M;
            },
            uploadFileHandle(index,type){//购物车产品上传附件 或者 表头附件
                try {
                    let item = null;
                    if(index == 'aaa'){//表头附件
                        item = this.cumtomFormData.fileUrls;
                    }else if(index == 'invoice'){//结算页第二页电子发票文件
                        item = this.invoiceForm.invoice_file;
                    }else if(index == 'lookFiles'){//结算页第二页查看表头附件
                        if(type || type == 0){//结算页第二页产品清单附件
                            if(type == 'invoice'){//查看电子发票文件
                                item = this.invoice.invoice_file;
                            }else{
                                item = this.checkoutDetailInfo.transaction_items[type].fileStr;
                            }
                        }else{
                            item = this.checkoutDetailInfo.fileUrls;
                        }
                    }else{
                        item = this.cartGoods[index].fileStr;
                    }
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
                    }else{
                        this.uploadImageLists = [];
                        this.image_id = [];
                    }
                    this.goodIndex = index;
                    if(index == 'lookFiles'){//结算页第二页查看表头附件
                        this.uploadReadonlyFlag = true;//上传图片控件是否只读
                    }else{
                        this.uploadReadonlyFlag = false;//上传图片控件是否只读
                    }
                    this.uploadDialogVisible = true;
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            saveUploadImages(){//保存上传附件内容
                try {
                    let fileStr = '';
                    if(this.image_id && this.image_id.length>0){
                        fileStr = this.image_id.join(';');
                    }
                    if(this.goodIndex == 'aaa'){//表头附件
                        this.cumtomFormData.fileUrls = fileStr;
                    }else if(this.goodIndex == 'invoice'){//结算页第二页发票文件
                        this.invoiceForm.invoice_file = fileStr;
                    }else{//产品附件
                        let item = this.cartGoods[this.goodIndex];
                        item.fileStr = fileStr;
                        this.UPDATEGOODDATA({index:this.goodIndex,goodData:item});
                    }
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.uploadDialogVisible = false;
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            discountChangeHandle(val){//门店优惠金额更改
                try {
                    if(this.cartGoods && this.cartGoods.length <= 0){
                        this.discountTemp = 0;
                        return false;
                    }
                    if(!priceRegx.test(val)){
                        this.discountTemp = this.discount;
                        return false;
                    }
                    this.UPDATEDISCOUNT(val);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            sendProDateChangeHandle(val){//仓库完成时间更改
                try {
                    if(val){
                        let goods = this.cartGoods;
                        const flag = goods.some(function (item) {
                           return !item.send_time;
                        });
                        if(flag){
                            goods.forEach(function (item, index) {
                                if(!item.send_time){
                                    item.send_time = val;
                                }
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
            resetHistoryDialog(){//关闭历史订单弹框时重置数据
                try {
                    this.pageForm.page = 1;
                    this.pageForm.HAS_DATA = true;
                    this.pageForm.isOn = true;
                    this.pageForm.elWraper.scrollTop = 0;
                    this.extractOrderFlag =  false;
                    this.historyActiveIndex = '';
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async getHistoryOrders(type){//获取历史订单
                try {
                    const that = this;
                    const orderJson = this.$store.state.order;
                    let formData = {};
                    if(orderJson.member_id){//客户是否登录 获取商城id
                        formData.member_id = orderJson.member_id;
                    }else if(orderJson.cumtomFormData && orderJson.cumtomFormData.information_id){//获取crm客户id
                        formData.information_id = orderJson.cumtomFormData.information_id;
                    }else{//获取当前登录账户工号
                        formData.gonghao = this.$store.state.memberRoleId.usercode;
                    }
                    if(type == 'page'){
                        formData.showLoad = '3';
                    }
                    const res = await order_detail(this.pageForm.page,15,formData);
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
                    if(res.success && res.success.length>0){
                        if(this.pageForm.page == 1){
                            this.historyOrders = res.success;
                        }else{
                            this.historyOrders =  this.historyOrders.concat(res.success);
                        }
                        this.historyOrdersDialogVisible = true;
                        that.pageForm.isOn = true;
                        if(type == 'mounted'){
                            this.$nextTick(function () {
                                if(this.historyOrdersDialogVisible){
                                    that.scrollHistoryOrdersLists();
                                }
                            });
                        }
                    }else{
                        if(this.pageForm.page == 1){
                            this.historyOrders = [];
                        }else{//最后一页了
                            this.pageForm.page--;
                        }
                        this.pageForm.HAS_DATA = false;
                        if(type == 'mounted'){
                            this.$message({
                                message: '暂没有历史订单数据',
                                type: 'error'
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
            scrollHistoryOrdersLists(){//历史订单列表滚动加载
                try {
                    let that = this;
                    that.pageForm.elWraper = document.querySelector(".el-collapse");
                    that.pageForm.elWraper.addEventListener('scroll',function(){
                        let srollPos = that.pageForm.elWraper.scrollTop;    //滚动条距顶部距离(页面超出窗口的高度)
                        let totalheight = parseFloat(that.pageForm.elWraper.clientHeight) + parseFloat(srollPos);
                        if((that.pageForm.elWraper.scrollHeight-that.pageForm.range) <= totalheight && that.pageForm.HAS_DATA == true && srollPos>0) {
                            if(that.pageForm.isOn){
                                that.pageForm.isOn = false;
                                that.pageForm.page++;
                                that.getHistoryOrders('page');
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
            historyOrdersChangeHandle(val){//历史订单当前激活面板改变时触发
                this.extractOrderFlag =  false;
            },
            extractOrder(type){//历史订单提取
                try {
                    if(this.historyActiveIndex === ''){
                        this.$message({
                            message: '请先选择需要提取的订单',
                            type: 'error'
                        });
                        return false;
                    }
                    if(type === 'confirm'){//确认提取订单
                        this.EXTRACTORDERSETDATA(this.historyOrders[this.historyActiveIndex]);
                        this.discountTemp = this.discount;
                        this.historyOrdersDialogVisible = false;
                        this.$message({
                            message: '提取成功',
                            type: 'success'
                        });
                    }else{
                        this.extractOrderFlag =  true;
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            areaChangeHandle(){//客户地区改变 重新选择安装服务
                try {
                    let services = [];
                    this.cartGoods.forEach(function (item,index) {
                        if(item.install_flag == 'true'){
                            services.push(item);
                        }
                    });
                    if(services.length > 0){
                        this.$message({
                            message: '地区改变，请重新购买安装服务',
                            type: 'error'
                        });
                        this.addService([]);
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async buyService(){//购买安装服务
                try {
                    const that = this;
                    if(this.cartGoods && this.cartGoods.length>0) {
                        let installPros = [],area = '',formData = {};
                        this.cartGoods.forEach(function (item,index) {
                           if(item.install == 'true'){//有安装服务的产品
                               installPros.push({"product_id":item.product_id,"num":item.num});
                           }
                        });
                        if(installPros.length <= 0){
                            this.$message({
                                message: '没有可购买的安装服务',
                                type: 'error'
                            });
                            return false;
                        }
                        if(typeof this.cumtomFormData.area == 'object'){
                            area = this.cumtomFormData.area.join(" ");//收货地区
                        }else{
                            area = this.cumtomFormData.area;//收货地区
                        }
                        if(!area){
                            this.$message({
                                message: '请先选择收货人地区',
                                type: 'error'
                            });
                            return false;
                        }
                        formData.area = area;
                        formData.goods = installPros;
                        const res = await service(formData);
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
                        let serviceMoney = 0,serviceSelectedFlag = false;//价格
                        if(res.success.length>0){
                            res.success.forEach(function (item,index) {
                                that.cartGoods.forEach(function (el,il) {
                                    if(item.product_id == el.product_id){
                                        item.selected = true;
                                        serviceSelectedFlag = true;
                                        serviceMoney += Number(item.price*item.num);
                                    }
                                });
                            });
                            this.serviceLists = res.success;
                            if(serviceSelectedFlag){//有选中的安装服务
                                serviceMoney = serviceMoney > 0 ? serviceMoney < 80 ? 80 : serviceMoney : 0;
                            }
                            this.serviceListsMoney = serviceMoney;
                            this.serviceDialogVisible = true;
                        }else{
                            this.$message({
                                message: '该地区不支持安装服务',
                                type: 'error'
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
            chooseService(index){//选择安装服务
                try {
                    let item = this.serviceLists[index];
                    let flag = item.selected ? false : true;

                    this.$set(this.serviceLists[index],'selected',flag);
                    let serviceMoney = 0;//价格
                    this.$nextTick(function () {
                        this.serviceLists.forEach(function (item,index) {
                            if(item.selected){
                                serviceMoney += Number(item.price*item.num);
                            }
                        });
                        serviceMoney = serviceMoney > 0 ? serviceMoney < 80 ? 80 : serviceMoney : 0;
                        this.serviceListsMoney = serviceMoney;
                    })
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            confirmBuyService(){//确定购买安装服务
                try {
                    const that = this;
                    let services = [];
                    this.serviceLists.forEach(function (item,index) {
                        if(item.selected){
                            item.sum = Number(item.num*item.price);
                            let tempItem;
                            item.parent_id.forEach(function (e1) {
                                that.cartGoods.forEach(function (e2,i2) {
                                    if(e1 == e2.product_id){
                                        if(!tempItem){
                                            tempItem = e2;
                                        }
                                        if(e2.canal == 'wuliu' || e2.canal == 'kuaidi'){
                                            tempItem = e2;
                                            return false;
                                        }
                                    }
                                });
                            });
                            item.space = tempItem.space;//空间
                            item.canal = tempItem.canal;//配送方式
                            item.channel = tempItem.channel;//线上，线下
                            item.send_time = tempItem.send_time;//交期
                            services.push(Object.assign({},item));
                        }
                    });
                    this.addService(services);
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.serviceDialogVisible = false;
                }catch(e){
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            submitOrder(){//提交订单
                try {
                    const that = this;
                    if(this.cartGoods && this.cartGoods.length>0){
                        const orderJson = this.$store.state.order;
                        let formData = {};
                        if(this.invoice.tax_type){//需要发票
                            formData = Object.assign({},this.invoice);
                        }
                        formData.acceptOrdMan = orderJson.cumtomFormData.acceptOrdMan;//收货人
                        formData.acceptOrdPhone = orderJson.cumtomFormData.acceptOrdPhone;//收货手机号
                        if(typeof orderJson.cumtomFormData.area == 'object'){
                            formData.area = orderJson.cumtomFormData.area.join(" ");//收货地区
                        }else{
                            formData.area = orderJson.cumtomFormData.area;//收货地区
                        }
                        formData.addr = orderJson.cumtomFormData.addr;//收货地址
                        formData.sendProDate = orderJson.cumtomFormData.sendProDate;//仓库完成时间
                        formData.contractCode = orderJson.cumtomFormData.contractCode;//合同编码
                        formData.information_id = orderJson.cumtomFormData.information_id;//crm客户id
                        formData.custReRemark = orderJson.cumtomFormData.custReRemark;//客户特殊要求
                        formData.orderRemarks = orderJson.cumtomFormData.orderRemarks;//订单备注
                        formData.liftSel = orderJson.cumtomFormData.liftSel;//是否有电梯
                        formData.fileUrls = orderJson.cumtomFormData.fileUrls;//表头附件
                        formData.cost_item = orderJson.totalMoney;//商品总金额
                        formData.orderid = orderJson.orderid;//订单号
                        formData.pmt_order = orderJson.discount;//门店优惠
                        formData.info = orderJson.goods;//商品
                        formData.member_id = orderJson.member_id;//商城用户id
                        //校验数据
                        //校验定制单产品是否有上传附件
                        const goodItem = formData.info.find(function (item) {
                            return item.is_stand == 1 && item.fileStr == '';
                        });
                        if(goodItem){
                            this.$message({
                                message: goodItem.product_name+'定制商品必须上传相关的定制信息附件',
                                type: 'error'
                            });
                            return false;
                        }
                        //判断是否有定制单
                        const isStand = formData.info.some(function (item) {
                            return item.is_stand == 1;
                        });
                        //有定制单但是为非crm客户
                        if(isStand && !formData.information_id){
                            this.$message({
                                message: '定制单只能基于CRM客户信息下单',
                                type: 'error'
                            });
                            return false;
                        }
                        //有定制单但是未填写仓库完成时间
                        if(isStand && !formData.sendProDate){
                            this.$message({
                                message: '定制单要选择仓库生产完成日期',
                                type: 'error'
                            });
                            return false;
                        }
                        //收货相关信息
                        if(!formData.acceptOrdMan){
                            this.$message({
                                message: '收货人不能为空',
                                type: 'error'
                            });
                            return false;
                        }
                        if(!formData.acceptOrdPhone){
                            this.$message({
                                message: '收货人手机号不能为空',
                                type: 'error'
                            });
                            return false;
                        }
                        if(!phoneRegx.test(formData.acceptOrdPhone)){
                            this.$message({
                                message: '收货人手机号格式不正确',
                                type: 'error'
                            });
                            return false;
                        }
                        if(formData.area && formData.area.length <= 0){
                            this.$message({
                                message: '收货人地区不能为空',
                                type: 'error'
                            });
                            return false;
                        }
                        if(!formData.addr){
                            this.$message({
                                message: '收货人详细地址不能为空',
                                type: 'error'
                            });
                            return false;
                        }
                        //判断配送方式是否不同 不同的话会导致拆单 需要提示框
                        let tempCanals = [],dismantlingFlag = false,proSpaceFlag=false;//dismantlingFlag 是否存在自提且非定制的产品
                        formData.info.forEach(function(item){
                            if(!item.space){
                                that.$message({
                                    message: item.product_name+'的所属空间不能为空',
                                    type: 'error'
                                });
                                proSpaceFlag = true;
                                return false;
                            }
                            let tempCanalString = tempCanals.join(",");
                            if(tempCanalString.indexOf(item.canal) == -1){
                                tempCanals.push(item.canal);
                            }
                            if(item.canal == 'ziti' && item.is_stand == 0 && !dismantlingFlag){//自提且为非定制
                                dismantlingFlag = true;
                            }
                        });
                        if(proSpaceFlag){//有产品空间为空值
                            return false;
                        }
                        if(tempCanals.length >= 2 &&  dismantlingFlag){//存在多种配送方式 存在自提且非定制的产品 则需要拆单
                            this.$confirm('该订单存在不同的配送方式，系统将自动拆单，是否继续操作？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                that.submitOrderCallback(formData);
                            }).catch((error) => {
                                if(error == 'cancel'){
                                    return false;
                                }
                                this.$message({
                                    message: error.message,
                                    type: 'error'
                                });
                            });
                        }else{
                            that.submitOrderCallback(formData);
                        }
                    }else{
                        this.$message({
                            message: '请先添加产品',
                            type: 'error'
                        });
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async submitOrderCallback(formData){//提交订单
                try {
                    const that = this;
                    const res = await pre_order(formData);
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
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.UPDATECHECKOUTDETAILINFO(res.success);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            goBackCheckoutHandle(){//返回结算页第一页
                try {
                    this.UPDATECHECKOUTSWITCH(0);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            setInvoiceHandle(type){//设置发票
                const that = this;
                if(!type){//保存发票数据
                    this.$refs['invoiceForm'].validate((valid) => {
                        if (valid) {
                            try {
                                that.UPDATEINVOICEDATA(that.invoiceForm);
                                that.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                that.invoiceDialogVisible = type;
                            }catch (e) {
                                that.$message({
                                    message: e.message,
                                    type: 'error'
                                });
                            }
                        }
                    });
                }else{
                    this.invoiceForm = Object.assign({},this.invoice);
                    if(!this.invoice.tax_type){
                        this.invoiceForm.tax_type = 'personal';
                    }
                    this.invoiceDialogVisible = type;
                }
            },
            resetInvoiceDialog(){//重置结算页发票数据
                this.$refs['invoiceForm'].resetFields();
            },
            async pushOrderHandle(){//推送订单
                try {
                    const that = this;
                    if(!this.checkoutDetailInfo.transaction_id){
                        this.$message({
                            message: '订单数据有误，请刷新重试',
                            type: 'error'
                        });
                        return false;
                    }
                    const res = await push_order(this.checkoutDetailInfo.transaction_id);
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
                    this.$message({
                        message: res.success,
                        type: 'success'
                    });
                    this.RESETCHECKOUTDATA();//重置结算页数据
                    this.discountTemp = 0;
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            resetOrderHandle(type){//重新下单
                try {
                    if(type === 'logoutCustom'){
                        this.RESETCHECKOUTDATA(type);//重置结算页数据
                    }else{
                        this.RESETCHECKOUTDATA();//重置结算页数据
                        this.discountTemp = 0;
                        if(type == 'order'){//下单成功后调用回调 清除页面数据
                            this.payOrderDialogVisible = false;
                        }else{
                            this.$router.push('/search');
                        }
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            logoutCustom(){//退出账户登录
                this.resetOrderHandle('logoutCustom');
            },
            choosePayMethod(methodVal,index){//选择支付方式
                this.payOrderForm.curMethod = index;
                this.payOrderForm.payment = methodVal;
            },
            closePayOrderDialog(done){//关闭支付方式弹框
                if(this.payOrderForm.showQrcodeVisible){//显示二维码弹框 则点击关闭显示支付方式选择
                    this.payOrderForm.showQrcodeVisible = false;
                }else{
                    done();
                }
                clearTimeout(this.qrcodeTime);
            },
            async checkPaySuccess(payment_id,payment,num){//二维码支付 查询订单是否已完成
                try {
                    if(!this.payOrderForm.showQrcodeVisible){
                        clearTimeout(this.qrcodeTime);
                        return false;
                    }
                    const that = this;
                    if(!this.checkoutDetailInfo.transaction_id){
                        this.$message({
                            message: '订单数据有误，请刷新重试',
                            type: 'error'
                        });
                        return false;
                    }
                    const res = await query_new({"transaction_id":this.checkoutDetailInfo.transaction_id,"showLoad":"3"});
                    this.payOrderForm.message = res.data.msg;
                    if(res.status == "failed"){
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        clearTimeout(this.qrcodeTime);
                        return false;
                    }
                    if(res.status == "success"){//成功
                        this.$message({
                            message: '支付成功！',
                            type: 'success'
                        });
                        clearTimeout(this.qrcodeTime);
                        that.resetOrderHandle('order');
                    }else if(res.status == "error"){//还未支付
                        num++;
                        if(num>60){//限制5分钟 重新获取二维码图片
                            const res2 = await pay_new(payment_id,payment);
                            if(res2.error){
                                this.$message({
                                    message: res2.error,
                                    type: 'error'
                                });
                                return false;
                            }
                            this.payOrderForm.url="/qrcode/index.html?text="+res2.returnInfo.qrcode;
                            num = 1;
                        }
                        that.qrcodeTime = setTimeout(function(){
                            that.checkPaySuccess(payment_id,payment,num);
                        },5000);
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async payOrderHandle(status){//非CRM用户支付
                if(status !== '3'){//确定支付
                    try {
                        const that = this;
                        if(status == "1"){//订单完成需选择支付方式
                            let payment = this.payOrderForm.payment;
                            if(!payment){
                                this.$message({
                                    message: '请先选择支付方式',
                                    type: 'error'
                                });
                                return false;
                            }
                            let formData = {};
                            if(!this.checkoutDetailInfo.transaction_id){
                                this.$message({
                                    message: '订单数据有误，请刷新重试',
                                    type: 'error'
                                });
                                return false;
                            }
                            if(this.invoice.tax_type){//需要发票
                                formData = Object.assign({},this.invoice);
                            }
                            formData.transaction_id = this.checkoutDetailInfo.transaction_id;
                            formData.payment = payment;
                            const res = await ajax_pay(formData);
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
                            if(res.success && res.success.returnInfo){//微信，支付宝
                                this.payOrderForm.message = '';
                                this.payOrderForm.url="/qrcode/index.html?text="+res.success.returnInfo.qrcode;
                                this.payOrderForm.title = payment == 'wxf2fpay' ? '微信扫描支付' : payment == 'alif2fpay' ? '支付宝扫描支付' : '';
                                this.payOrderForm.showQrcodeVisible = true;
                                let  num= 1;//控制次数
                                that.qrcodeTime = setTimeout(function(){
                                    that.checkPaySuccess(res.success.payment_id,res.success.method,num);
                                },5000);
                            }else{//现金，pos，对公转账
                                this.$message({
                                    message: '支付成功',
                                    type: 'success'
                                });
                                that.resetOrderHandle('order');
                            }
                        }
                    }catch (e) {
                        this.$message({
                            message: e.message,
                            type: 'error'
                        });
                    }
                }else{//显示支付弹框
                    this.payOrderDialogVisible = true;
                }
            },
            orderDeadHandle(){//订单作废
                const that = this;
                this.$confirm('确定作废订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(!that.checkoutDetailInfo.transaction_id){
                        that.$message({
                            message: '订单数据有误，请刷新重试',
                            type: 'error'
                        });
                        return false;
                    }
                    order_dead(that.checkoutDetailInfo.transaction_id).then(res=>{
                        if(res.error){
                            that.$message({
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
                            message: res.success,
                            type: 'success'
                        });
                        that.resetOrderHandle('order');
                    });
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
        }
    }
</script>
<style scoped>
    .orderCheckout-container{
        height: 100%;
        background: #f4f4f4;
    }
    .section-1{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .search-form,.custom-info{
        padding: 20px 50px;
        background: #fff;
        border-bottom: 1px solid #D6D7DC;
        margin-bottom: 10px;
    }
    .search-input{
        width: 466px;
        padding-bottom: 12px;
    }
    .search-input .el-autocomplete{
        width: 100%;
    }
    .tips{
        font-size: 12px;
        color: #F25406;
    }
    .getHistoryOrders,.biaotoufujian{
        width: 120px;
        background: #fff;
        color: #1876EF;
        border: 2px solid #1876EF;
        border-radius: 18px;
        box-sizing: border-box;
        font-size: 14px;
        padding: 8px 20px;
    }
    .biaotoufujian{
        width: 140px;
        border-radius: 0;
    }
    .custom-info {
        padding: 20px 50px 4px 20px;
    }
    .custom-info .el-col{
        display: flex;
        align-items: center;
        color: #919191;
        margin-bottom: 16px;
    }
    .custom-info .formItem{
        flex: 1;
    }
    .section-1 .custom-info label.txt-label{
        width: 85px;
        text-align: right;
    }
    .checkoutTableInfo{
        text-align: center;
        background: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .checkoutUploadDialog .upload-container{
        position: relative;
        padding-left: 70px;
    }
    .checkoutUploadDialog .upload-container .title{
        font-size: 12px;
        color: #666666;
        position: absolute;
        left: 0;
    }
    .btns{
        text-align: center;
        position: absolute;
        bottom: 26px;
        left: 0;
        right: 0;
    }
    .submit_btn{
        width: 120px;
        border-radius: 6px;
    }
    .buyService_btn{
        width: 140px;
        background: #F27B06;
        border-radius: 6px;
    }
    /*底部栏*/
    .footer-info{
        height: 80px;
        line-height: 80px;
        display: flex;
        padding: 0 51px;
        font-size: 12px;
        color: #4D4D4D;
    }
    .footer-info .txt-left{
        flex: 1;
        overflow: hidden;
        display: flex;
        white-space: nowrap;
    }
    .footer-info .txt-item{
        margin-right: 40px;
    }
    .footer-info .txt-item:last-child{
        margin-right: 30px;
    }
    .footer-info .formItem{
        width: 120px;
        vertical-align: middle;
    }
    .footer-info .t1{
        font-size: 14px;
        color: #919191;
    }
    .footer-info .t2{
        color: #F25406;
        font-size: 18px;
    }
    .footer-info .txt-item1 .t2{
        color: #1876EF;
    }
    .footer-info .txt-item2 .t2{
        display: inline-block;
        height: 36px;
        line-height: 36px;
        border: 1px solid #D6D7DC;
        padding-left: 10px;
        box-sizing: border-box;
    }
    /*结算页第二页*/
    .section-2{
        height: 100%;
        background: #fff;
        padding: 20px 0 0;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    .section-2 .section-2-wrapper{
        flex: 1;
        overflow: auto;
        padding: 0 51px;
    }
    .section-2 .custom-info{
        color: #919191;
        border-bottom: none;
        padding: 0 0 18px;
    }
    .section-2 .title{
        font-size: 16px;
        color: #1A1A1A;
        margin-bottom: 14px;
    }
    .section-2 .custom-info .txt{
        color: #4D4D4D;
        margin-right: 80px;
    }
    .section-2 .detail-info{
        margin-top: 28px;
        color: #919191;
    }
    .section-2 .detail-info .txt{
        margin-bottom: 14px;
        display: flex;
    }
    .section-2 .detail-info .t1{
        color: #4D4D4D;
        flex: 1;
    }
    .section-2 .detail-info .t2{
        color: #1876EF;
        cursor: pointer;
    }
    .section-2 .detail-info .t3{
        color: #F25406;
        margin-right: 38px;
    }
    .section-2 .footer-info{
        background: #f4f4f4;
        border-top: 1px solid #E0E0E0;
        box-sizing: border-box;
    }
    .extractOrderTips{
        font-size: 10px;
        color: #F25406;
        margin-top: 4px;
    }
    .el-collapse{
        flex: 1;
        overflow: auto;
        border-bottom: none;
    }
    .history-btns{
        text-align: center;
        padding-top: 10px;
    }
    /*安装服务弹框*/
    .serviceListsDialog ul{
        padding-bottom: 92px;
        overflow: auto;
    }
    .serviceListsDialog li{
        list-style-type: none;
        position: relative;
        height: 60px;
        overflow: hidden;
        padding: 0 30px 0 80px;
        font-size: 14px;
        color: #4D4D4D;
        line-height: 60px;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        margin-bottom: 20px;
    }
    .serviceListsDialog .s-img{
        width: 60px;
        height: 60px;
        border: 1px solid #E0E0E0;
        position: absolute;
        left: 0;
        box-sizing: border-box;
    }
    .serviceListsDialog li span{
        float: left;
    }
    .serviceListsDialog .s-title{
        width: 295px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .serviceListsDialog .s-num{
        margin: 0 100px;
        width: 50px;
    }
    .serviceListsDialog .s-price{
        width: 100px;
    }
    .serviceListsDialog i{
        color: #1876EF;
        font-size: 24px;
        position: absolute;
        right: 0;
    }
    .serviceListsDialog li.active i:before{
        content: '\e669';
    }
    .serviceListsDialog .service-btns{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f4f4f4;
        border-top: 1px solid #E0E0E0;
        padding: 0 30px;
        display: flex;
        height: 90px;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #4D4D4D;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .serviceListsDialog .service-btns .s-tips{
        font-size: 14px;
        color: #F25406;
    }
    .serviceListsDialog .service-btns .s-t1{
        font-size: 14px;
        color: #919191;
    }
    .serviceListsDialog .service-btns .s-t2{
        font-size: 18px;
        color: #F25406;
        font-weight: bold;
    }
    .invoiceDialog .invoice-btns{
        text-align: center;
        margin-top: 60px;
    }
    .invoiceDialog .chooseFile-btn{
        width: 100px;
        height: 30px;
        line-height: 30px;
        background: #fff;
        border: 1px solid #1876EF;
        color: #1876EF;
        padding: 0;
        border-radius: 6px;
    }
    .invoice-infos li{
        list-style-type: none;
    }
    /*支付方式弹框*/
    .payOrderDialog .money{
        text-align: center;
        font-size: 14px;
        color: #1A1A1A;
        line-height: 36px;
        padding-bottom: 30px;
        border-bottom: 1px solid #e0e0e0;
    }
    .payOrderDialog .money .t1{
        color: #919191;
        font-size: 16px;
    }
    .payOrderDialog .money .t2{
        color: #F25406;
        font-size: 28px;
        vertical-align: middle;
    }
    .payOrderDialog ul{
        overflow: hidden;
        padding-top: 40px;
    }
    .payOrderDialog li{
        list-style-type: none;
        float: left;
        width: 220px;
        height: 90px;
        line-height: 90px;
        font-size: 18px;
        color: #4D4D4D;
        border: 2px solid #50B674;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 24px;
        cursor: pointer;
        position: relative;
    }
    .payOrderDialog li .el-icon-check{
        position: absolute;
        font-size: 20px;
        margin-right: 0;
        right: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-left: 46px solid transparent;
        border-top: 46px solid transparent;
        border-right: 46px solid;
    }
    .payOrderDialog li .el-icon-check:before{
        content: "\E611";
        position: absolute;
        top: -23px;
        right: -43px;
        color: #fff;
        font-weight: bold;
    }
    .payOrderDialog li.method1,.payOrderDialog li.method4{
        margin: 0 30px;
    }
    .payOrderDialog li i{
        color: #50B674;
        font-size: 60px;
        vertical-align: middle;
        margin-right: 20px;
    }
    .payOrderDialog .method1{
        border-color: #56ABE4;
    }
    .payOrderDialog .method1 i{
        color: #56ABE4;
    }
    .payOrderDialog .method2{
        border-color: #9997F0;
    }
    .payOrderDialog .method2 i{
        color: #9997F0;
    }
    .payOrderDialog .method3{
        border-color: #F2988E;
    }
    .payOrderDialog .method3 i{
        color: #F2988E;
    }
    .payOrderDialog .method4{
        border-color: #E9B251;
    }
    .payOrderDialog .method4 i{
        color: #E9B251;
    }
    .payOrderDialog li.active{
        border: 3px solid #F25406;
    }
    .payOrderDialog li.active .el-icon-check{
        border-right-color: #F25406;
    }
    .payOrderDialog .payOrder-btns{
        background: #f1f1f1;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 90px;
        line-height: 90px;
        text-align: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .qrCode_container{
        text-align: center;
        padding-top: 30px;
    }
    .qrCode_container .method_name{
        font-size: 16px;
        color: #1A1A1A;
    }
    .qrCode_container iframe{
        display: block;
        width: 215px;
        height: 215px;
        margin: 30px auto 10px;
        border:none;
    }
    .qrCode_container .iframeEl{
        width: 235px;
        height: 235px;
    }
    .qrCode_container .payOrderTips{
        color: #F25406;
    }
    .header-label{
        padding: 0 30px 0 61px;
        background: #f4f4f4;
        line-height: 36px;
        height: 36px;
    }
</style>