<template>
    <section class="receivablesEdit_container">
        <el-form ref="receivablesForm" :model="receivablesForm" :rules='receivablesFormRules' label-width="0" >
            <!-- <el-form-item prop='receivables_id' class='hide-form-item'></el-form-item>
            <el-form-item prop='createtime' class='hide-form-item'></el-form-item>
            <el-form-item prop='update_time' class='hide-form-item'></el-form-item> -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='name'>
                        <el-input  v-model="receivablesForm.name" placeholder='收款人名称'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='times'>
                        <el-date-picker
                            v-model="receivablesForm.times"
                            type="datetime"
                            placeholder="收款时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='voucher'>
                        <el-input  v-model="receivablesForm.voucher" placeholder='收款凭证号'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='money'>
                        <el-input type='number' v-model="receivablesForm.money" placeholder='收款金额'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='discount'>
                        <el-input  type='number' v-model="receivablesForm.discount" placeholder='抵扣金额'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='is_retainage' label='是否尾款' label-width='80px'>
                        <el-radio-group v-model="receivablesForm.is_retainage">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" align='middle'>
                <el-col :span="8">
                    <el-form-item prop='status'>
                        <el-select v-model="receivablesForm.status" placeholder="请选择客户状态">
                            <el-option
                                v-for="item in customStatus"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item prop='remarks' :error='remarksError'>
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="receivablesForm.remarks" placeholder='收款备注' ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop='imageLists'>
                <el-upload
                    ref='upload'
                    action="/crm-upload_image.html"
                    list-type="picture-card"
                    name='mypic[]'
                    :limit='1'
                    :file-list="receivablesForm.imageLists"
                    :on-preview="handlePictureCardPreview"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :on-success='handleSuccess'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('receivablesForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {receivables_save} from '@/service/getData';
    import { mapState } from 'vuex';

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
                    name:'',//收款人
                    times:'',//收款时间
                    voucher:'',//收款凭证号
                    money:'',//收款金额
                    discount:'',//抵扣金额
                    image_id:'',//发票图片
                    remarks:'',//收款备注
                    is_retainage:'false',//是否尾款
                    imageLists:[],//图片列表
                    status:this.informationItem.status//状态
                },
                remarksError:'',//备注错误信息提醒
                submitBtnStatus:false,//保存按钮是否可点击
                dialogImageUrl:'',
                dialogVisible:false,
                receivablesFormRules:{//规则校验
                    name: [
                        {  required: true, message: '请填写收款人名称', trigger: 'blur' }
                    ],
                    times: [
                        {  required: true, message: '请选择收款时间', trigger: 'change' }
                    ],
                    money: [
                        { validator: checkMoneyAndDiscount}
                    ],
                    discount:[
                        { validator: checkMoneyAndDiscount}
                    ],
                    remarks:[
                        { validator: checkRemarks}
                    ],
                    status: [
                        {  required: true, message: '请选择状态', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            ...mapState([
                'customStatus'
            ])
        },
        mounted(){
            if(this.editInfos && this.editInfos.receivables_id){
                // this.receivablesForm = this.editInfos;
                this.receivablesForm = Object.assign({},this.editInfos);
                if(this.editInfos.imageLists && this.editInfos.imageLists.length>0){
                    this.receivablesForm.imageLists = this.editInfos.imageLists.slice();
                }
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                this.receivablesForm.information_id = this.informationItem.id;
                this.receivablesForm.status = this.informationItem.status;
                if(newVal.receivables_id){
                    this.receivablesForm = Object.assign({},newVal);
                    if(newVal.imageLists && newVal.imageLists.length>0){
                        this.receivablesForm.imageLists = newVal.imageLists.slice();
                    }
                }else{//新增
                    this.resetFormData();
                    this.receivablesForm.imageLists = [];
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.receivablesForm['receivables_id'];
                delete this.receivablesForm['createtime'];
                delete this.receivablesForm['update_time'];
            },
            handleRemove(file, fileList) {
                this.receivablesForm.image_id = '';
                this.receivablesForm.imageLists = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList){//上传成功
                if(response.success && response.success.length>0){
                    this.receivablesForm.image_id = response.success[0].image_id;
                }
                this.receivablesForm.imageLists = fileList;
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                //   this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message({
                        message:'上传头像图片大小不能超过 2MB!',
                        type:'error'
                    });
                    return false;
                }
                return isLt2M;
            },
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitBtnStatus = true;
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
                                // this.$message({
                                //     message: error,
                                //     type: 'error'
                                // });
                                this.submitBtnStatus = false;
                            });
                        }
                    })
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitBtnStatus = false;
                }
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
        width: 148px;
        height: 148px;
    }
</style>