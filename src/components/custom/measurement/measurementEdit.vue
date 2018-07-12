<template>
    <section class="measurementEdit_container">
        <el-form ref="measurementForm" :model="measurementForm" :rules='measurementFormRules' label-width="0" >
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label='是否创建外出单：' prop='is_outgoing' label-width="110px">
                        <el-radio-group v-model="measurementForm.is_outgoing">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-form-item prop='measure_name'>
                        <el-input  v-model="measurementForm.measure_name" placeholder='测量人名称' readonly='true'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='measure_time'>
                        <el-date-picker
                            v-model="measurementForm.measure_time"
                            type="datetime"
                            placeholder="测量起始时间"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            :readonly='measurementForm.id?true:false'
                            @change='measureTimeHandle'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <el-form-item>
                        至
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='end_time'>
                        <el-date-picker
                            v-model="measurementForm.end_time"
                            type="datetime"
                            placeholder="测量结束时间"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            :readonly='measurementForm.id?true:false'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <p class="wrapper-txt">测量成功</p>
                    <el-form-item prop='information' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="measurementForm.information" placeholder='量尺信息'></el-input>
                    </el-form-item>
                    <el-form-item prop='feedback' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="measurementForm.feedback" placeholder='信息回馈'></el-input>
                    </el-form-item>
                    <el-form-item prop='imageLists'>
                        <el-upload
                                ref='upload'
                                action="/crm-upload_image.html"
                                list-type="picture-card"
                                name='mypic[]'
                                :file-list="measurementForm.imageLists"
                                :multiple='true'
                                :on-preview="handlePictureCardPreview"
                                :before-upload="beforeAvatarUpload"
                                :on-remove="handleRemove"
                                :on-success='handleSuccess'>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                            <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex'>
                                <el-carousel-item v-for="(item,index) in measurementForm.imageLists" :key="index" :name='item.url'>
                                    <img :src="item.url" class="image_carousel_item">
                                </el-carousel-item>
                            </el-carousel>
                        </el-dialog>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <p class="wrapper-txt">测量失败</p>
                    <el-form-item prop='change_times'>
                        <el-date-picker
                            v-model="measurementForm.change_times"
                            type="datetime"
                            placeholder="更改测量时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop='remarks' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="measurementForm.remarks" placeholder='测量失败备注'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('measurementForm','1')" class='submit_btn'>测量成功</el-button>
            <el-button type="primary" @click="onSubmit('measurementForm','0')" class='submit_btn'>测量失败</el-button>
        </div>
    </section>
</template>
<script>
    import Vue from 'vue';
    import {measure_save} from '@/service/getData';
    import {getDuration} from '@/utils/index';

    export default{
        name:'measurementEdit',
        props:['informationItem','editInfos'],
        data(){
            return{
                measurementForm:{
                    information_id:this.informationItem.id,//客户id
                    measure_name:this.$store.state.memberRoleId.name,//测量人
                    measure_time:'',//测量开始时间
                    end_time:'',//测量结束时间
                    duration:'',//测量时长
                    image_id:[],//量尺图片
                    information:'',//量尺信息
                    feedback:'',//信息回馈
                    imageLists:[],//图片列表
                    is_outgoing:'true',//是否创建外出单
                    change_times:'',//更改测量时间
                    remarks:''//测量失败备注
                },
                initialIndex:0,
                submitBtnStatus:false,//保存按钮是否可点击
                dialogVisible:false,
                measurementFormRules:{//规则校验
                    measure_name: [
                        {  required: true, message: '请填写测量人名称', trigger: 'blur' }
                    ],
                    measure_time: [
                        {  required: true, message: '请选择测量开始时间', trigger: 'change' }
                    ],
                    end_time: [
                        {  required: true, message: '请选择测量结束时间', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.measurementForm = Object.assign({},this.editInfos);
                if(this.editInfos.imageLists && this.editInfos.imageLists.length>0){
                    this.measurementForm.image_id = this.editInfos.image_id.slice();
                    this.measurementForm.imageLists = this.editInfos.imageLists.slice();
                }
            }else{
                this.resetFormData();
                this.measurementForm.complex = this.editInfos.complex;
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                this.measurementForm.information_id = this.informationItem.id;
                if(newVal.id){
                    this.measurementForm = Object.assign({},newVal);
                    if(newVal.imageLists && newVal.imageLists.length>0){
                        this.measurementForm.image_id = newVal.image_id.slice();
                        this.measurementForm.imageLists = newVal.imageLists.slice();
                    }
                }else{
                    this.resetFormData();
                    this.measurementForm.image_id = [];
                    this.measurementForm.imageLists = [];
                    this.measurementForm.complex = newVal.complex;
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.measurementForm['id'];
                delete this.measurementForm['createtime'];
                delete this.measurementForm['update_time'];
                this.measurementForm.is_outgoing = 'true';
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
                        this.measurementForm.imageLists = fileList;
                        this.measurementForm.image_id = tempImageIds.slice();
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
                    let tempLists = this.measurementForm.imageLists;
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
                if(response.success && response.success.length>0){
                    this.measurementForm.image_id.push(response.success[0].image_id);
                }
                this.measurementForm.imageLists = fileList;
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
            measureTimeHandle(val){//选择开始量尺时间后 自动赋值给结束时间
                this.measurementForm.end_time = val;
            },
            onSubmit(formName,type){
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            let tempFormData = Object.assign({},this.measurementForm);
                            let tempDuration = getDuration(tempFormData.measure_time,tempFormData.end_time);
                            if(tempDuration < 0){
                                this.$message({
                                    message:'测量结束时间不能小于测量开始时间',
                                    type:'error'
                                });
                                this.submitBtnStatus = false;
                                return false;
                            }else{
                                tempFormData.duration  = tempDuration;
                            }
                            delete tempFormData.imageLists;
                            tempFormData.measure_state = type;
                            measure_save(tempFormData).then(res=>{
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
                                that.closeMeasurementInfoDialog("measurementForm",res.data);
                            }).catch(error=>{
                                this.$message({
                                    message: error.message,
                                    type: 'error'
                                });
                                this.submitBtnStatus = false;
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
            closeMeasurementInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomMeasurementInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomMeasurementInfoDialog',{data:result,type:'add'});
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
    .wrapper-txt{
        line-height: 36px;
        font-weight: bold;
    }
</style>