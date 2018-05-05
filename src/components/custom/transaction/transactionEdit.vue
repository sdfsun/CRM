<template>
    <section class="transactionEdit_container">
        <el-form ref="transactionForm" :model="transactionForm" :rules='transactionFormRules' label-width="0" >
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item prop='name'>
                        <el-input  v-model="transactionForm.name" placeholder='接待人名称'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='times'>
                        <el-date-picker
                            v-model="transactionForm.times"
                            type="datetime"
                            placeholder="交易时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='money'>
                        <el-input type='number' v-model="transactionForm.money" placeholder='交易金额'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='order_id'>
                        <el-input  v-model="transactionForm.order_id" placeholder='交易订单号'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-form-item prop='detail'>
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="transactionForm.detail" placeholder='交易备注' ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('transactionForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {transaction_save} from '@/service/getData';

    export default{
        name:'transactionEdit',
        props:['informationItem','editInfos'],
        data(){
            return{
                transactionForm:{
                    information_id:this.informationItem.id,//客户id
                    name:'',//交易人
                    times:'',//交易时间
                    order_id:'',//交易订单号
                    money:'',//交易金额
                    detail:''//交易备注
                },
                submitBtnStatus:false,//保存按钮是否可点击
                transactionFormRules:{//规则校验
                    name: [
                        {  required: true, message: '请填写接待人名称', trigger: 'blur' }
                    ],
                    times: [
                        {  required: true, message: '请选择交易时间', trigger: 'change' }
                    ],
                    money: [
                        { required: true, message: '请填写交易金额', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.transactionForm = Object.assign({},this.editInfos);
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                this.transactionForm.information_id = this.informationItem.id;
                if(newVal.id){
                    this.transactionForm = Object.assign({},newVal);
                }else{
                    this.resetFormData();
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.transactionForm['id'];
                delete this.transactionForm['createtime'];
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
                            transaction_save(this.transactionForm).then(res=>{
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
                                that.closeTransactionInfoDialog("transactionForm",res.data);
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
            closeTransactionInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomTransactionInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomTransactionInfoDialog',{data:result,type:'add'});
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