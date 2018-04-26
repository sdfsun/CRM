<template>
    <section class="communicationEdit_container">
        <el-form ref="communicateForm" :model="communicateForm"  :rules="communicateFormRules" label-width="0">
            <el-form-item prop='id' class='hide-form-item'></el-form-item>
            <el-form-item prop='createtime' class='hide-form-item'></el-form-item>
            <el-form-item prop='update_time' class='hide-form-item'></el-form-item>
            <el-row :gutter="8">
                <el-col :span="7.7">
                    <el-form-item prop='mode'>
                        <el-select v-model="communicateForm.mode" placeholder="沟通方式">
                            <el-option label="店里沟通" value="店里沟通"></el-option>
                            <el-option label="电话沟通" value="电话沟通"></el-option>
                            <el-option label="微信沟通" value="微信沟通"></el-option>
                            <el-option label="邮件沟通" value="邮件沟通"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7.7">
                    <el-form-item prop='contact_time'>
                        <el-date-picker
                            v-model="communicateForm.contact_time"
                            type="datetime"
                            placeholder="沟通起始时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="0.9">
                    <el-form-item>
                        至
                    </el-form-item>
                </el-col>
                <el-col :span="7.7">
                    <el-form-item prop='end_time'>
                        <el-date-picker
                            v-model="communicateForm.end_time"
                            type="datetime"
                            placeholder="沟通结束时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='bespeak_time'>
                        <el-date-picker
                            v-model="communicateForm.bespeak_time"
                            type="datetime"
                            placeholder="预约到店时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='scale_time'>
                        <el-date-picker
                            v-model="communicateForm.scale_time"
                            type="datetime"
                            placeholder="预约量尺时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='is_arrival'>
                        <el-select v-model="communicateForm.is_arrival" placeholder="是否已到店" clearable>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item prop='is_bespeak' ref='isBespeakItem'>
                        <el-select v-model="communicateForm.is_bespeak" placeholder="是否预约成功" clearable @change='bespeakChange'>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='status'>
                        <el-select v-model="communicateForm.status" placeholder="请选择客户状态">
                            <el-option
                                v-for="item in customStatus"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item prop='reason' class='form_item_style_width' v-show='reasonVisibleFlag' ref='reasonItem' :error='reasonError'>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="communicateForm.reason" placeholder='预约失败原因'></el-input>
            </el-form-item>
            <el-form-item prop='outline' class='form_item_style_width'>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="communicateForm.outline" placeholder='沟通概要'></el-input>
            </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('communicateForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {communicate_save} from '@/service/getData';
    import {getDuration} from '@/utils/index';
    import { mapState } from 'vuex';

    export default{
        name:'communicationEdit',
        props:['informationItem','editInfos'],
        data(){
            let checkIsBespeak = (rule,val,callback)=>{
                if(val !== '2'){
                    this.$refs['isBespeakItem'].clearValidate();
                    callback();
                    return false;
                }
                if( val === '2' && this.communicateForm.reason === ''){//预约失败则预约失败原因必填
                    this.reasonError = '请填写预约失败原因';
                    return false;
                }
                callback();
            };
            let checkReason = (rule,val,callback)=>{
                if( this.communicateForm.is_bespeak === '2' && val === ''){//预约失败则预约失败原因必填
                    // this.reasonError = '请填写预约失败原因';
                    callback(new Error('请填写预约失败原因'));
                    return false;
                }
                if( this.communicateForm.is_bespeak === '2' && val !== ''){//预约失败则预约失败原因必填
                    this.reasonError = '';
                    callback();
                    return false;
                }
                callback();
            };
            return{
                communicateForm:{
                    information_id:this.informationItem.id,//客户id
                    id:'',
                    createtime:'',
                    update_time:'',
                    mode:'',//沟通方式
                    contact_time:'',//沟通开始时间
                    end_time:'',//沟通结束时间
                    duration:'',//沟通时长
                    bespeak_time:'',//预约到店时间
                    is_arrival:'',//是否到店
                    is_bespeak:'',//是否预约成功
                    scale_time:'',//预约量尺时间
                    reason:'',//预约失败原因
                    outline:'',//沟通概要
                    status:this.informationItem.status//状态
                },
                reasonVisibleFlag:false,//预约失败原因是否显示
                submitBtnStatus:false,//保存按钮是否可点击
                reasonError:'',//预约失败原因
                communicateFormRules:{//规则校验
                    mode: [
                        { required: true, message: '请选择沟通方式', trigger: 'change' }
                    ],
                    contact_time: [
                        {  required: true, message: '请选择沟通开始时间', trigger: 'change' }
                    ],
                    end_time: [
                        {  required: true, message: '请选择沟通结束时间', trigger: 'change' }
                    ],
                    is_bespeak:[
                        { validator: checkIsBespeak, trigger: 'change'}
                    ],
                    reason:[
                        { validator: checkReason}
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
            if(this.editInfos && this.editInfos.id){
                // this.communicateForm = this.editInfos;
                this.communicateForm = Object.assign({}, this.editInfos);
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                // this.communicateForm = newVal;
                this.communicateForm = Object.assign({}, newVal);
            }
        },
        methods:{
            bespeakChange(val){//是否预约成功联动预约失败原因
                if(val === '2'){//预约失败
                    this.reasonVisibleFlag = true;
                }else{
                    this.reasonVisibleFlag = false;
                    this.communicateForm.reason = "";
                }
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
                            let tempDuration = getDuration(this.communicateForm.contact_time,this.communicateForm.end_time);
                            if(tempDuration < 0){
                                this.$message({
                                    message:'沟通结束时间不能小于沟通开始时间',
                                    type:'error'
                                });
                                this.submitBtnStatus = false;
                                return false;
                            }else{
                                this.communicateForm.duration  = tempDuration;
                            }
                            communicate_save(this.communicateForm).then(res=>{
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
                                that.closeCommunicateInfoDialog("communicateForm",res.data);
                            }).catch(error=>{
                                this.submitBtnStatus = false;
                                // this.$message({
                                //     message: error,
                                //     type: 'error'
                                // });
                            });
                        }
                    })
                } catch(e) {
                    this.submitBtnStatus = false;
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            closeCommunicateInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomCommunicateInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomCommunicateInfoDialog',{data:result,type:'add'});
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
    }
</style>