<template>
    <div class="orderCheckout-container orderRelation-container">
        <!--结算页第一页-->
        <div class="section-1" v-if="checkoutSwitch === 0">
            <div class="search-form">
                <el-row>
                    <el-col :span="12">
                        <el-input v-model="searchPhone" ref="searchPhoneItem" maxlength='11' placeholder="请输入用户联系方式" class="search-input" clearable @keyup.13.native="searchCrmInfomation" v-show="!autocompleteVisible">
                            <el-button slot="append" @click="searchCrmInfomation">搜索</el-button>
                        </el-input>
                        <el-autocomplete
                            v-show="autocompleteVisible"
                            class="search-input"
                            :value="searchPhone"
                            v-focus="autocompleteVisible"
                            :popper-class="autocompleteVisible?'':'hidePopup'"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                            @blur="autocompleteChangeHandle">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.name }}({{item.status_name}})</div>
                            </template>
                            <el-button slot="append" @click="searchCrmInfomation">搜索</el-button>
                        </el-autocomplete>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-button type="primary" class="getHistoryOrders" @click="getHistoryOrders">历史订单</el-button>
                    </el-col>
                </el-row>
                <p class="tips">{{tips}}</p>
            </div>
            <div class="custom-info">
                <el-row :gutter="20">
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
                                class="formItem">
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
                    <el-col :span="13">
                        <label class="txt-label">客户特殊要求：</label>
                        <el-input  placeholder="请输入客户特殊要求" clearable class="formItem" v-model="cumtomFormData.custReRemark"></el-input>
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
                        class-name="alignCenterColumn">
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.space" clearable></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="bn"
                        label="产品型号"
                        min-width='110px'>
                </el-table-column>
                <el-table-column
                        prop="product_name"
                        label="产品名称"
                        min-width='180px'
                        class-name="alignCenterColumn">
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.product_name" clearable v-if="scope.row.is_stand === 1"></el-input>
                        <span v-else>{{scope.row.product_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="is_custom"
                        label="是否定制"
                        min-width='80px'>
                    <template slot-scope="scope">
                        <el-checkbox checked v-if="scope.row.is_custom && scope.row.is_stand === 1" disabled></el-checkbox>
                        <el-checkbox v-model="scope.row.is_standSelected" @change="updateGoodDataHandle(scope.$index,scope.row)" v-else></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column
                        prop='orderDRemark'
                        label="定制需求"
                        min-width='140px'
                        class-name="alignCenterColumn">
                    <template slot-scope='scope'>
                        <el-input  v-model="scope.row.orderDRemark" clearable></el-input>
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
                                clearable>
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                        prop='canal'
                        label="配送方式"
                        min-width='110px'>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.canal" placeholder="请选择" v-if="scope.row.channel === 'store'" @change="canalChangeHandle(scope.$index,scope.row)">
                            <el-option key="ziti" label="自提" value="ziti"></el-option>
                            <el-option :key="method" :label="method === 'kuaidi'?'快递':'物流'" :value="method"></el-option>
                        </el-select>
                        <el-select v-model="scope.row.canal" placeholder="请选择" v-else>
                            <el-option :key="scope.row.canal" :label="scope.row.canal === 'kuaidi'?'快递':'物流'" :value="scope.row.canal"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        prop='fileStr'
                        label="附件"
                        min-width='100px'>
                    <template slot-scope="scope">
                        <span style="color: #1876EF;cursor: pointer;" @click="uploadFileHandle(scope.$index)" v-if="scope.row.fileStr === ''">上传附件</span>
                        <span style="color: #1876EF;cursor: pointer;" @click="uploadFileHandle(scope.$index)" v-else><i class="crmiconfont icon-ic_folder_close" style="margin-right: 7px;"></i>添加</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop='price'
                        label="单价"
                        min-width='130px'
                        class-name="alignCenterColumn">
                    <template slot-scope='scope'>
                        <el-input v-model="scope.row.price" @change="priceChangeHandle(scope.$index,scope.row)" clearable v-if="scope.row.is_stand === 1"></el-input>
                        <span v-else>{{scope.row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop='num'
                        label="数量"
                        min-width='100px'
                        class-name="inputNumColumn">
                    <template slot-scope='scope'>
                        <el-input-number v-model="scope.row.num" :min="1" :max="scope.row.org_store" v-if="scope.row.canal === 'ziti'" @change="numChangeHandle(scope.$index,scope.row)"></el-input-number>
                        <el-input-number v-model="scope.row.num" :min="1" :max="scope.row.store" @change="numChangeHandle(scope.$index,scope.row)" v-else></el-input-number>
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
                        <a href="javascript:void(0);" class="operation-btn" @click="deleteGoodHandle(scope.$index)"><i class="crmiconfont icon-shanchu"></i></a>
                        <a href="javascript:void(0);" class="operation-btn" :class="{disabled:scope.row.gifs_flag}" @click="markGiftHandle(scope.$index,scope.row,scope.row.gifs_flag?false:true)"><i class="crmiconfont icon-zengpin" style="font-size: 18px;"></i></a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer-info">
                <div class="txt-left">
                    <div class="txt-item">
                        商品总价：<span class="t1">￥</span><span class="t2">{{totalMoney}}</span>
                    </div>
                    <div class="txt-item">
                        运费：<span class="t1">￥</span><span class="t2">{{freight}}</span>
                    </div>
                    <div class="txt-item txt-item2">
                        优惠金额：<div class="t2"><span class="t1">￥</span><el-input  clearable class="formItem" v-model="discountTemp" :value="discount" @change="discountChangeHandle"></el-input></div>
                    </div>
                    <div class="txt-item">
                        实付金额：<span class="t1">￥</span><span class="t2">{{payMoney}}</span>
                    </div>
                </div>
                <div class="t-right">
                    <el-button type="primary" @click="submitOrder" class='submit_btn'>保存</el-button>
                </div>
            </div>
            <!--上传图片弹框-->
            <el-dialog title="上传附件" :visible.sync="uploadDialogVisible" class='checkoutUploadDialog' :close-on-click-modal='false'>
                <div class="upload-container">
                    <p class="title">图片/文件：</p>
                    <el-upload
                            ref='upload'
                            action="/crm-upload_image.html"
                            list-type="picture-card"
                            name='mypic[]'
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
                <div class="btns">
                    <el-button type="primary" @click="saveUploadImages" class='submit_btn'>保存</el-button>
                </div>
            </el-dialog>
        </div>
        <!--结算页第二页-->
        <div class="section-2" v-else>
            <div class="section-2-wrapper">
                <div class="custom-info">
                    <p class="title">收货信息</p>
                    姓名：<span class="txt">{{checkoutDetailInfo.acceptOrdMan}}</span>
                    联系方式：<span class="txt">{{checkoutDetailInfo.acceptOrdPhone}}</span>
                    地区：<span class="txt">{{checkoutDetailInfo.area}}</span>
                    详细地址：<span class="txt">{{checkoutDetailInfo.addr}}</span>
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
                                prop="bn"
                                label="产品型号"
                                min-width='80px'>
                        </el-table-column>
                        <el-table-column
                                prop="product_name"
                                label="产品名称"
                                min-width='140px'>
                        </el-table-column>
                        <el-table-column
                                prop="is_custom"
                                label="是否定制"
                                min-width='80px'>
                        </el-table-column>
                        <el-table-column
                                prop='send_time'
                                label="交期"
                                min-width='160px'>
                        </el-table-column>
                        <el-table-column
                                prop='price'
                                label="商品单价"
                                min-width='130px'>
                        </el-table-column>
                        <el-table-column
                                prop='num'
                                label="数量"
                                min-width='100px'>
                        </el-table-column>
                        <el-table-column
                                prop='price'
                                label="商品均摊价"
                                min-width='130px'>
                        </el-table-column>
                        <el-table-column
                                prop='price'
                                label="商品入SAP单价"
                                min-width='130px'>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="detail-info">
                    <p class="title">订单信息</p>
                    <p class="txt">创建人工号：<span class="t1">12345</span></p>
                    <p class="txt">订单编号：<span class="t1">145234541223360122</span></p>
                    <p class="txt">合同编码：<span class="t1">{{checkoutDetailInfo.contractCode}}</span></p>
                    <p class="txt">仓库交货时间：<span class="t1">{{checkoutDetailInfo.sendProDate}}</span></p>
                    <p class="txt">表头附件：<span class="t2">查看附件</span></p>
                    <p class="txt">是否有电梯：<span class="t1">{{checkoutDetailInfo.liftSel==="true"?"是":"否"}}</span></p>
                    <p class="txt">客户特殊要求：<span class="t1">{{checkoutDetailInfo.custReRemark}}</span></p>
                    <p class="txt">订单备注：<span class="t1">{{checkoutDetailInfo.orderRemarks}}</span></p>
                    <p class="txt">
                        收款折扣金额：<span class="t3">￥300</span>
                        订单支付金额：<span class="t3">￥300</span>
                        入SAP总优惠金额：<span class="t3">￥300</span>
                        入SAP的最终价格：<span class="t3">￥300</span>
                    </p>
                </div>
            </div>
            <div class="footer-info">
                <div class="txt-left">
                    <div class="txt-item">
                        商品总价：<span class="t2">￥{{totalMoney}}</span>
                    </div>
                    <div class="txt-item">
                        运费：<span class="t2">￥{{freight}}</span>
                    </div>
                    <div class="txt-item">
                        优惠金额：<span class="t2">￥0</span>
                    </div>
                    <div class="txt-item">
                        实付金额：<span class="t2">￥{{payMoney}}</span>
                    </div>
                </div>
                <div class="t-right">
                    <el-button type="primary" @click="submitOrder" class='submit_btn'>返回</el-button>
                    <el-button type="primary" @click="submitOrder" class='submit_btn'>推送订单</el-button>
                </div>
            </div>
        </div>
        <!--历史订单-->
        <el-dialog title="历史订单" :visible.sync="historyOrdersDialogVisible" class='historyOrdersDialog' :close-on-click-modal='false'>
            <el-collapse accordion @change="historyOrdersChangeHandle">
                <el-collapse-item name="1">
                    <template slot="title">
                        <div class="header-left">
                            <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                            <span class="txt">订单编号：D10011295</span>
                            <span class="txt">接待人</span>
                            <span class="txt">2018-06-02 14:52</span>
                            <span class="txt">客户名</span>
                            <span class="txt">123 1212 1234</span>
                            <span class="txt">福建省/泉州市/惠安县</span>
                            <span class="txt">当前账户余额</span>
                            <span class="txt">已支付</span>
                            <span class="txt">未支付</span>
                        </div>
                        <div class="header-right">
                            <!--<span class="txt money-item">实付金额：￥<strong>1200.00</strong></span>-->
                            <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                        </div>
                    </template>
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
                            min-width='120px'>
                        </el-table-column>
                        <el-table-column
                            prop="is_custom"
                            label="是否定制"
                            min-width='80px'>
                        </el-table-column>
                        <el-table-column
                            prop='orderDRemark'
                            label="定制需求"
                            min-width='130px'>
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
                <el-collapse-item name="2">
                    <template slot="title">
                        <div class="header-left">
                            <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                            <span class="txt">订单编号：D10011295</span>
                            <span class="txt">接待人</span>
                            <span class="txt">2018-06-02 14:52</span>
                            <span class="txt">客户名</span>
                            <span class="txt">123 1212 1234</span>
                            <span class="txt">福建省/泉州市/惠安县</span>
                        </div>
                        <div class="header-right">
                            <span class="txt money-item">实付金额：￥<strong>1200.00</strong></span>
                            <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                        </div>
                    </template>
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
                                min-width='120px'>
                        </el-table-column>
                        <el-table-column
                                prop="is_custom"
                                label="是否定制"
                                min-width='80px'>
                        </el-table-column>
                        <el-table-column
                                prop='orderDRemark'
                                label="定制需求"
                                min-width='130px'>
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
                <el-collapse-item name="3">
                    <template slot="title">
                        <div class="header-left">
                            <i class="crmiconfont icon--xuankuang choose-color" style="margin-right: 15px;"></i>
                            <span class="txt">订单编号：D10011295</span>
                            <span class="txt">接待人</span>
                            <span class="txt">2018-06-02 14:52</span>
                            <span class="txt">客户名</span>
                            <span class="txt">123 1212 1234</span>
                            <span class="txt">福建省/泉州市/惠安县</span>
                        </div>
                        <div class="header-right">
                            <span class="txt money-item">实付金额：￥<strong>1200.00</strong></span>
                            <span class="txt choose-color" style="margin-right: 0;">展开<i class="crmiconfont icon-zhankai" style="font-size: 12px;margin-left: 5px;"></i></span>
                        </div>
                    </template>
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
                                min-width='120px'>
                        </el-table-column>
                        <el-table-column
                                prop="is_custom"
                                label="是否定制"
                                min-width='80px'>
                        </el-table-column>
                        <el-table-column
                                prop='orderDRemark'
                                label="定制需求"
                                min-width='130px'>
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
                <el-button type="primary" @click="extractOrder" class='submit_btn' v-if="!extractOrderFlag">提取订单</el-button>
                <template v-else>
                    <el-button type="primary"  class='submit_btn'>确定</el-button>
                    <p class="extractOrderTips">是否确认提取历史订单替换当前订单？</p>
                </template>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { region } from '@/service/region';
    import {mapState,mapActions,mapMutations} from 'vuex';
    import {getUploadIcon} from '@/utils/index';
    import {post_login,pre_order} from '@/service/getData';
    const priceRegx = /(^[1-9]\d*(\.\d*)?$)|(^0(\.\d*)?$)/;//校验金额
    const phoneRegx = /^1[3456789]\d{9}$/;//校验手机

    export default {
        name:'checkout',
        data(){
            return{
                tips:'*请先输入客户联系方式判断是否为CRM用户，再行下单',
                areaOptions:region,
                uploadDialogVisible:false,
                uploadImageLists:[],
                image_id:[],
                initialIndex:0,
                dialogVisible:false,
                goodIndex:null,//购物车产品索引 用于上传图片
                discountTemp:0,
                searchPhone:"",//搜索手机号
                searchCrmResults:[],//存储多个crm账户
                autocompleteVisible:false,//是否显示多个crm账户下拉列表
                historyOrdersDialogVisible:false,//历史订单弹框是否可见
                historyActiveIndex:'',//历史订单当前选中的订单索引
                extractOrderFlag:false,//是否确认提取历史订单
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
                checkoutDetailInfo:state => state.order.checkoutDetailInfo
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
                'SETMEMBERID'
            ]),
            ...mapActions([
                'updateGood',
                'setOrderMethod',
                'setOrderTotalMoney'
            ]),
            async searchCrmInfomation(){//判断是否为crm客户
                try {
                    if(!this.searchPhone){
                        return false;
                    }
                    if(!phoneRegx.test(this.searchPhone)){
                        this.$message({
                            message: '请输入正确的手机格式',
                            type: 'error'
                        });
                        return false;
                    }
                    const res = await post_login(this.searchPhone);
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
                    if(res.success.information && res.success.information.length === 1){//一个crm账户
                        //赋值
                        this.UPDATECUSTOMINFO(res.success.information[0]);
                        this.tips = '该号码为CRM客户';
                    }else if(res.success.information.length >1){//多个crm账户
                        this.searchCrmResults = res.success.information;
                        this.autocompleteVisible = true;
                    }else{
                        this.$message({
                            message: '该号码非CRM客户',
                            type: 'error'
                        });
                        this.UPDATECUSTOMINFO({});
                        this.tips = '*请先输入客户联系方式判断是否为CRM用户，再行下单';
                    }
                    this.SETMEMBERID(res.success.member_id);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            querySearchAsync(queryString, cb){
                if(queryString !== this.searchPhone){
                    this.autocompleteVisible = false;
                    this.searchPhone = queryString;
                    this.$refs['searchPhoneItem'].focus();
                }
                cb(this.searchCrmResults);
            },
            handleSelect(item){//
                try {
                    this.UPDATECUSTOMINFO(item);
                    this.tips = '该号码为CRM客户';
                    this.autocompleteVisible = false;
                    this.$refs['searchPhoneItem'].focus();
                }catch(e){
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            autocompleteChangeHandle(){
                this.autocompleteVisible = false;
                this.$refs['searchPhoneItem'].focus();
            },
            updateGoodDataHandle(index,item){//是否定制
                try {
                    item.is_stand = item.is_standSelected ? 1 : 0;
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
                    this.UPDATEGOODDATA({index:index,goodData:item});
                    this.setOrderMethod();
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
            deleteGoodHandle(index){//删除产品
                const that = this;
                this.$confirm('确定删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.DELETEGOOD(index);
                    that.setOrderTotalMoney();
                    that.setOrderMethod();
                }).catch((e) => {
                    if(e === 'cancel'){
                        return false;
                    }
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                });
            },
            markGiftHandle(index,item,val){//标记赠品
                try {
                    item.gifs_flag = val;
                    if(val){//标记赠品
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
                    if(file.response && file.response.success && file.response.success.length>0 || file.status === 'success'){
                        var tempImageIds = [];
                        fileList.forEach( function(item, index) {
                            if(item.response && item.response.success && item.response.success.length>0){
                                tempImageIds.push(item.response.success[0].url);
                            }else if(item.status === 'success'){
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
                    }else if(file.status === 'success'){
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
                            return item.url === file.url
                        });
                        this.initialIndex = index;
                        this.dialogVisible = true;
                        this.$refs['carouselItems'].setActiveItem(file.url);
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
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
            uploadFileHandle(index){//购物车产品上传附件 或者 表头附件
                try {
                    let item = null;
                    if(index === 'aaa'){//表头附件
                        item = this.cumtomFormData.fileUrls;
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
                    if(this.goodIndex === 'aaa'){//表头附件
                        this.cumtomFormData.fileUrls = fileStr;
                    }else{
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
                    this.UPDATEORDERMONEY(val);
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
            getHistoryOrders(){//获取历史订单
                try {
                    this.historyOrdersDialogVisible = true;
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            historyOrdersChangeHandle(val){//历史订单当前激活面板改变时触发
                this.historyActiveIndex = val;
                console.log(val);
            },
            async submitOrder(){//提交订单
                try {
                    if(this.cartGoods && this.cartGoods.length>0){
                        const orderJson = this.$store.state.order;
                        let formData = {};
                        formData.acceptOrdMan = orderJson.cumtomFormData.acceptOrdMan;//收货人
                        formData.acceptOrdPhone = orderJson.cumtomFormData.acceptOrdPhone;//收货手机号
                        formData.area = orderJson.cumtomFormData.area;//收货地区
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
                            return item.is_stand === 1 && item.fileStr === '';
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
                            return item.is_stand === 1;
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
                        const res = await pre_order(formData);
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

                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
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
            extractOrder(){//历史订单提取
                this.extractOrderFlag =  true;
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
    }
    .footer-info .txt-item{
        float: left;
        margin-right: 80px;
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
</style>