<template>
    <section class="activityEdit_container">
        <el-form ref="activityForm" :model="activityForm" :rules='activityFormRules' label-width="90px" >
            <el-form-item prop='title' label='活动主题'>
                <el-input  v-model="activityForm.title" placeholder='请输入活动主题' clearable></el-input>
            </el-form-item>
            <el-form-item prop='content' label='活动内容'>
                <el-input  type="textarea" :autosize="{ minRows: 4}" v-model="activityForm.content" placeholder='活动内容' clearable></el-input>
            </el-form-item>
            <el-form-item prop='start_time' label='开始时间'>
                <el-date-picker
                    v-model="activityForm.start_time"
                    type="datetime"
                    placeholder="活动起始时间"
                    value-format='yyyy-MM-dd HH:mm:ss'>
                </el-date-picker>
            </el-form-item>
            <el-form-item prop='end_time' label='结束时间'>
                <el-date-picker
                    v-model="activityForm.end_time"
                    type="datetime"
                    placeholder="活动结束时间"
                    value-format='yyyy-MM-dd HH:mm:ss'>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="所属门店" prop='org_id'>
                <el-select v-model="activityForm.org_id" placeholder="请选择所属门店">
                    <el-option
                        v-for="item in orgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否激活" prop='disabled'>
                <el-switch
                    v-model="activityForm.disabled"
                    active-value="true"
                    inactive-value="false">
                </el-switch>
            </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('activityForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import {activity_save} from '@/service/getData';
    import {mapState,mapMutations,mapActions} from 'vuex';
    import {getDuration} from '@/utils/index';

    export default{
        name:'activityEdit',
        props:['editInfos'],
        data(){
            return{
                activityForm:{
                    title:'',//活动主题
                    content:'',//活动内容
                    start_time:'',//开始时间
                    end_time:'',//结束时间
                    disabled:'true',//是否启用
                    org_id:'5',//所属门店
                },
                orgs:[
                    {
                        value: '5',
                        label: '松霖厦门精品店'
                    },
                    {
                        value: '4',
                        label: '松霖成都体验店'
                    },
                    {
                        value: '3',
                        label: '松霖西安体验店'
                    },
                    {
                        value: '2',
                        label: '松霖长沙体验店'
                    },
                    {
                        value: '1',
                        label: '松霖南京体验店'
                    }
                ],
                submitBtnStatus:false,//保存按钮是否可点击
                activityFormRules:{//规则校验
                    title: [
                        {  required: true, message: '请输入活动主题', trigger: 'blur' }
                    ],
                    content: [
                        {  required: true, message: '请输入活动内容', trigger: 'blur' }
                    ],
                    start_time: [
                        { required: true, message: '请选择开始时间', trigger: 'change'}
                    ],
                    end_time: [
                        {  required: true, message: '请选择结束时间', trigger: 'change' }
                    ],
                    org_id: [
                        {  required: true, message: '请选择所属门店', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.activityForm = Object.assign({},this.editInfos);
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.id){
                    this.activityForm = Object.assign({},newVal);
                }else{
                    this.resetFormData();
                }
            }
        },
        computed:{
            ...mapState([
                'memberRoleId'
            ])
        },
        methods:{
            ...mapActions([
                'updateActivitys'
            ]),
            resetFormData(){
                delete this.activityForm['id'];
                delete this.activityForm['createtime'];
            },
            onSubmit(formName){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid,obj) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            let tempDuration = getDuration(this.activityForm.start_time,this.activityForm.end_time);
                            if(tempDuration < 0){
                                this.$message({
                                    message:'活动结束时间不能小于活动开始时间',
                                    type:'error'
                                });
                                this.submitBtnStatus = false;
                                return false;
                            }
                            activity_save(this.activityForm).then(res=>{
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
                                this.closeActivityEditInfoDialog("activityForm",res.data);
                                if(res.data && this.memberRoleId.org_id === res.data.org_id){
                                    this.updateActivitys(res.data);
                                }
                            }).catch(error=>{
                                this.submitBtnStatus = false;
                            });
                        }
                    });
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitBtnStatus = false;
                }
            },
            closeActivityEditInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeActivityInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeActivityInfoDialog',{data:result,type:'add'});
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
</style>