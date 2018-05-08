<template>
    <section class="measurementEdit_container">
        <el-form ref="measurementForm" :model="measurementForm" :rules='measurementFormRules' label-width="0" >
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
                            value-format='yyyy-MM-dd HH:mm:ss'>
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
                            value-format='yyyy-MM-dd HH:mm:ss'>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item prop='information' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="measurementForm.information" placeholder='量尺信息'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='feedback' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 4}"  v-model="measurementForm.feedback" placeholder='信息回馈'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
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
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('measurementForm')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
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
                    imageLists:[]//图片列表
                },
                submitBtnStatus:false,//保存按钮是否可点击
                dialogImageUrl:'',
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
            },
            handleRemove(file, fileList) {
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
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList){//上传成功
                if(response.success && response.success.length>0){
                    this.measurementForm.image_id.push(response.success[0].image_id);
                }
                this.measurementForm.imageLists = fileList;
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
                            let tempDuration = getDuration(this.measurementForm.measure_time,this.measurementForm.end_time);
                            if(tempDuration < 0){
                                this.$message({
                                    message:'测量结束时间不能小于测量开始时间',
                                    type:'error'
                                });
                                this.submitBtnStatus = false;
                                return false;
                            }else{
                                this.measurementForm.duration  = tempDuration;
                            }
                            delete this.measurementForm.imageLists;
                            measure_save(this.measurementForm).then(res=>{
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
                                // this.$message({
                                //     message: error,
                                //     type: 'error'
                                // });
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
</style>