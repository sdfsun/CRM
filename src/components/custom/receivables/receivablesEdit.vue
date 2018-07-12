<template>
    <section class="receivablesEdit_container">
        <el-form ref="receivablesForm" :model="receivablesForm" :rules='receivablesFormRules' label-width="90px" >
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item prop='name' label='收款人'>
                        <el-input  v-model="receivablesForm.name" placeholder='收款人名称' readonly='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='times' label='收款时间'>
                        <el-date-picker
                            v-model="receivablesForm.times"
                            type="datetime"
                            placeholder="收款时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item prop='is_retainage' label='收款类型'>
                        <el-select v-model="receivablesForm.is_retainage" placeholder="请选择收款类型" clearable >
                            <el-option label="小额定金" value="0"></el-option>
                            <el-option label="预存款" value="1"></el-option>
                            <el-option label="尾款" value="2"></el-option>
                            <el-option label="全款" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label='装修预算'>
                        <el-input :value='informationItem.budget+"万"' placeholder='装修预算' readonly='true' v-if='informationItem.budget'></el-input>
                        <el-input value='' placeholder='装修预算' readonly='true' v-else></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 预存款 -->
            <el-row :gutter="60">
                <el-col :span="12" v-if='receivablesForm.is_retainage === "1"'>
                    <el-form-item label='预计合同金额'>
                        <el-input v-model="receivablesForm.expect_money" placeholder='预计合同金额' clearable></el-input>
                    </el-form-item>
                </el-col>
                <template v-else-if='receivablesForm.is_retainage === "2"'>
                    <el-col :span="12">
                        <el-form-item label='实际合同金额'>
                            <el-input type='number' v-model="receivablesForm.actual_money" placeholder='实际总额' clearable @change='isActualMoneyHandle' @keyup.13='isActualMoneyHandle'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='应收尾款'>
                            <el-input v-model="receivablesForm.total_amount" placeholder='应收尾款' readonly='true'></el-input>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-row :gutter="0">
                        <el-col :span="16">
                            <el-form-item prop='payment' label='收款金额' class='receivables_item1' required>
                                <el-select v-model="receivablesForm.payment" placeholder="付款方式" clearable>
                                    <el-option label="支付宝" value="支付宝"></el-option>
                                    <el-option label="微信" value="微信"></el-option>
                                    <el-option label="POS刷卡" value="POS刷卡"></el-option>
                                    <el-option label="对公转账" value="对公转账"></el-option>
                                    <el-option label="现金" value="现金"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop='money' labelWidth='0' class='receivables_item2'>
                                <el-input type='number' v-model="receivablesForm.money" placeholder='收款金额' clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='discount' label='抵扣金额'>
                        <el-input  type='number' v-model="receivablesForm.discount" placeholder='抵扣金额' clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item prop='voucher' label='收款凭证号'>
                        <el-input  v-model="receivablesForm.voucher" placeholder='收款凭证号' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='activity_id' label='活动'>
                        <el-select v-model="receivablesForm.activity_id" placeholder="请选择活动" clearable @change='activityHandle'>
                            <el-option
                                v-for="item in activitys"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item prop='finance_money' label='财务确认金额'>
                        <el-input  v-model="receivablesForm.finance_money" placeholder='财务确认金额' :readonly="memberRoleId.member_role_id !== 'finance'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item prop='remarks' :error='remarksError' label='收款备注'>
                        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="receivablesForm.remarks" placeholder='收款备注'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop='imageLists' label='发票图片'>
                <el-upload
                    ref='upload'
                    action="/crm-upload_image.html"
                    list-type="picture-card"
                    name='mypic[]'
                    :multiple='true'
                    :file-list="receivablesForm.imageLists"
                    :on-preview="handlePictureCardPreview"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :on-success='handleSuccess'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                    <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex'>
                        <el-carousel-item v-for="(item,index) in receivablesForm.imageLists" :key="index" :name='item.url'>
                            <img :src="item.url" class="image_carousel_item">
                        </el-carousel-item>
                    </el-carousel>
                </el-dialog>
            </el-form-item>
        </el-form>
        <div class="activity-infos" v-show='activityVisible'>
            <el-table
            :data="activityItems"
            stripe
            border
            style="width: 100%;text-align: center;flex:1;overflow: auto;"
            header-row-class-name='header_row_style'>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="活动主题">
                                <span>{{ props.row.title }}</span>
                            </el-form-item>
                            <el-form-item label="活动内容">
                                <span>{{ props.row.content }}</span>
                            </el-form-item>
                            <el-form-item label="开始时间">
                                <span>{{ props.row.start_time }}</span>
                            </el-form-item>
                            <el-form-item label="结束时间">
                                <span>{{ props.row.end_time }}</span>
                            </el-form-item>
                            <el-form-item label="是否激活">
                                <span>{{ props.row.disabled_name }}</span>
                            </el-form-item>
                            <el-form-item label="所属门店">
                                <span>{{ props.row.org_name }}</span>
                            </el-form-item>
                            <el-form-item  label='海报图片' style='width:100%;'>
                                <el-upload
                                    ref='upload'
                                    action="/crm-upload_image.html"
                                    list-type="picture-card"
                                    name='mypic[]'
                                    :disabled='true'
                                    :file-list="activityItems[0].imageLists"
                                    :on-preview="handlePictureCardPreview2">
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible2" :append-to-body='true'>
                                    <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex'>
                                        <el-carousel-item v-for="(item,index) in activityItems[0].imageLists" :key="index" :name='item.url'>
                                            <img :src="item.url" class="image_carousel_item">
                                        </el-carousel-item>
                                    </el-carousel>
                                </el-dialog>
                            </el-form-item>
                        </el-form>
                      </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="活动主题"
                    min-width='130px'
                    >
                </el-table-column>
                <el-table-column
                    prop='content'
                    label="活动内容"
                    min-width='180px'
                    >
                </el-table-column>
                <el-table-column
                    prop="org_name"
                    label="所属门店"
                    min-width='150px'>
                </el-table-column>
            </el-table>
        </div>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('receivablesForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {mapState} from 'vuex';
    import {receivables_save} from '@/service/getData';
    import {formatDate} from '@/utils/index';

    export default{
        name:'receivablesEdit',
        props:['informationItem','editInfos'],
        data(){
            let checkMoneyAndDiscount = (rule, value, callback)=>{
                if(rule.field === 'money' && value === ''){
                    callback(new Error('请填写收款金额'));
                    return false;
                }
                if(this.receivablesForm.money !== '' && this.receivablesForm.discount !== ''){
                    if(Number(this.receivablesForm.money)-Number(this.receivablesForm.discount)<0 && this.receivablesForm.remarks === ''){
                        this.remarksError = '请填写备注信息';
                        return false;
                    }
                }
                callback();
            };
            let checkRemarks = (rule, value, callback)=>{
                if(this.receivablesForm.money !== '' && this.receivablesForm.discount !== ''){
                    if(Number(this.receivablesForm.money)-Number(this.receivablesForm.discount)<0 && value === ''){
                        callback(new Error('请填写备注信息'));
                        return false;
                    }else{
                        this.remarksError = '';
                        callback();
                        return false;
                    }
                }
                callback();
            };
            return{
                receivablesForm:{
                    information_id:this.informationItem.id,//客户id
                    name:this.$store.state.memberRoleId.name,//收款人
                    times:'',//收款时间
                    voucher:'',//收款凭证号
                    money:'',//收款金额
                    discount:'',//抵扣金额
                    image_id:[],//发票图片
                    remarks:'',//收款备注
                    is_retainage:'0',//收款类型
                    imageLists:[],//图片列表
                    payment:'',//收款方式
                    activity_id:'',//活动
                    expect_money:'',//预计合同金额
                    actual_money:'',//实际总额
                    total_amount:'',//应收尾款
                    finance_money:''//财务确认金额
                },
                remarksError:'',//备注错误信息提醒
                submitBtnStatus:false,//保存按钮是否可点击
                dialogImageUrl:'',
                dialogVisible:false,
                activityVisible:false,
                activityItems:[],//活动列表信息
                dialogVisible2:false,
                initialIndex:0,
                receivablesFormRules:{//规则校验
                    name: [
                        {  required: true, message: '请填写收款人名称', trigger: 'blur' }
                    ],
                    times: [
                        {  required: true, message: '请选择收款时间', trigger: 'change' }
                    ],
                    payment:[
                        {  required: true, message: '请选择付款方式', trigger: 'change' }
                    ],
                    money: [
                        { validator: checkMoneyAndDiscount}
                    ],
                    discount:[
                        { validator: checkMoneyAndDiscount}
                    ],
                    remarks:[
                        { validator: checkRemarks}
                    ]
                }
            }
        },
        computed:{
            ...mapState([
                'activitys',
                'memberRoleId'
            ])
        },
        mounted(){
            try {
                if(this.editInfos && this.editInfos.receivables_id){
                    // this.receivablesForm = this.editInfos;
                    this.receivablesForm = Object.assign({},this.editInfos);
                    if(this.editInfos.imageLists && this.editInfos.imageLists.length>0){
                        this.receivablesForm.imageLists = this.editInfos.imageLists.slice();
                    }
                }else{
                    this.resetFormData();
                    this.receivablesForm.times = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                    this.receivablesForm.sum_price = this.editInfos.sum_price;
                }
            } catch(e) {
                this.$message({
                    message: e.message,
                    type: 'error'
                });
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                try {
                    this.receivablesForm.information_id = this.informationItem.id;
                    if(newVal.receivables_id){
                        this.receivablesForm = Object.assign({},newVal);
                        if(newVal.imageLists && newVal.imageLists.length>0){
                            this.receivablesForm.imageLists = newVal.imageLists.slice();
                        }
                    }else{//新增
                        this.resetFormData();
                        this.receivablesForm.imageLists = [];
                        this.receivablesForm.times = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
                        this.receivablesForm.sum_price = newVal.sum_price;
                    }
                    this.activityHandle(this.receivablesForm.activity_id);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.receivablesForm['receivables_id'];
                delete this.receivablesForm['createtime'];
                delete this.receivablesForm['update_time'];
                this.receivablesForm.expect_money = '';//预计合同金额
                this.receivablesForm.actual_money = '';//实际总额
                this.receivablesForm.total_amount = '';//应收尾款
            },
            handleRemove(file, fileList) {
                try {
                    if(file.response && file.response.success && file.response.success.length>0 || file.status === 'success'){
                        var tempImageIds = [];
                        fileList.forEach( function(item, index) {
                            if(item.response && item.response.success && item.response.success.length>0){
                                tempImageIds.push(item.response.success[0].image_id);
                            }else if(item.status === 'success'){
                                tempImageIds.push(item.url);
                            }
                        });
                        this.receivablesForm.imageLists = fileList;
                        this.receivablesForm.image_id = tempImageIds.slice();
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handlePictureCardPreview(file) {
                try {
                    let tempLists = this.receivablesForm.imageLists;
                    const index = tempLists.findIndex(function(item, index, arr) {
                        return item.url === file.url
                    });
                    this.initialIndex = index;
                    this.dialogVisible = true;
                    this.$refs['carouselItems'].setActiveItem(file.url);
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
                        this.receivablesForm.image_id.push(response.success[0].image_id);
                    }
                    this.receivablesForm.imageLists = fileList;
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            beforeAvatarUpload(file) {
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
            activityHandle(item){//选择活动时显示具体的活动信息
                try {
                    if(item){
                        const index = this.activitys.findIndex(function(el, index, arr) {
                            return el.id === item;
                        });
                        this.activityItems = [];
                        this.activityItems.push(this.activitys[index]);
                        let imageLists = [];
                        if(this.activityItems[0].image_id &&  this.activityItems[0].image_id.length>0){
                            this.activityItems[0].image_id.forEach( function(item, index) {
                                imageLists.push({url:item});
                            });
                            this.activityItems[0].imageLists = imageLists.slice();
                            // this.$set(this.activityItems[0],'imageLists',imageLists);
                        }
                        this.activityVisible = true;
                    }else{
                        this.activityVisible = false;
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handlePictureCardPreview2(file) {
                try {
                    let tempLists = this.activityItems[0].imageLists;
                    const index = tempLists.findIndex(function(item, index, arr) {
                        return item.url === file.url
                    });
                    this.initialIndex = index;
                    this.dialogVisible2 = true;
                    this.$refs['carouselItems'].setActiveItem(file.url);
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            isActualMoneyHandle(val){//实际总额改变维护应收金额
                let temp = Number(val)-Number(this.receivablesForm.sum_price);
                this.receivablesForm.total_amount = temp>0?temp:0;
            },
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitBtnStatus = true;
                        delete this.receivablesForm.imageLists;
                        receivables_save(this.receivablesForm).then(res=>{
                            this.submitBtnStatus = false;
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
                                message:res.success,
                                type:'success'
                            });
                            that.closeReceivablesInfoDialog("receivablesForm",res.data);
                        }).catch(error=>{
                            this.$message({
                                message: error.message,
                                type: 'error'
                            });
                            this.submitBtnStatus = false;
                        });
                    }
                });
            },
            closeReceivablesInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.receivables_id){//编辑
                    this.$emit('closeCustomReceivablesInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomReceivablesInfoDialog',{data:result,type:'add'});
                }
            }
        }
    }
</script>
<style scoped>
    .btns{
        text-align: center;
        margin-top: 30px;
    }
    .btns .submit_btn{
        width: 120px;
    }
    .form_item_style_width{
        width: 100%;
        margin-right: 0;
    }
    .image_item_upload{
        width: 128px;
        height: 128px;
    }
    .demo-table-expand{
        text-align: left;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 49%;
    }

</style>