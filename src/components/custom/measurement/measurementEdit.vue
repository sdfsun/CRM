<template>
    <section class="measurementEdit_container">
        <el-form ref="measurementForm" :model="measurementForm" :rules='measurementFormRules' label-width="0" >
            <el-form-item prop='id' class='hide-form-item'></el-form-item>
            <el-form-item prop='createtime' class='hide-form-item'></el-form-item>
            <el-form-item prop='update_time' class='hide-form-item'></el-form-item>
            <el-row :gutter="10">
                <el-col :span="7.7">
                    <el-form-item prop='measure_name'>
                        <el-input  v-model="measurementForm.measure_name" placeholder='测量人名称'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7.7">
                    <el-form-item prop='measure_time'>
                        <el-date-picker
                            v-model="measurementForm.measure_time"
                            type="datetime"
                            placeholder="测量起始时间"
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
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="measurementForm.information" placeholder='量尺信息'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='feedback' class='form_item_style_width'>
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="measurementForm.feedback" placeholder='信息回馈'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item prop='status'>
                        <el-select v-model="measurementForm.status" placeholder="请选择客户状态">
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
            <el-form-item prop='imageLists'>
                <el-upload
                    ref='upload'
                    action="/crm-upload_image.html"
                    list-type="picture-card"
                    name='mypic[]'
                    :file-list="measurementForm.imageLists"
                    :multiple='true'
                    :on-preview="handlePictureCardPreview"
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
    import { mapState } from 'vuex';

    export default{
        name:'measurementEdit',
        props:['informationItem','editInfos'],
        data(){
            return{
                measurementForm:{
                    information_id:this.informationItem.id,//客户id
                    id:'',
                    createtime:'',
                    update_time:'',
                    measure_name:'',//测量人
                    measure_time:'',//测量开始时间
                    end_time:'',//测量结束时间
                    duration:'',//测量时长
                    image_id:[],//量尺图片
                    information:'',//量尺信息
                    feedback:'',//信息回馈
                    imageLists:[],//图片列表
                    status:this.informationItem.status//状态
                },
                submitBtnStatus:false,//保存按钮是否可点击
                dialogImageUrl:'',
                dialogVisible:false,
                measurementFormRules:{//规则校验
                    measure_name: [
                        {  required: true, message: '请填写测量人名称', trigger: 'trigger' }
                    ],
                    measure_time: [
                        {  required: true, message: '请选择测量开始时间', trigger: 'trigger' }
                    ],
                    end_time: [
                        {  required: true, message: '请选择测量结束时间', trigger: 'trigger' }
                    ],
                    status: [
                        {  required: true, message: '请选择状态', trigger: 'trigger' }
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
                // this.measurementForm = this.editInfos;
                this.measurementForm = Object.assign({},this.editInfos);
                if(this.editInfos.imageLists && this.editInfos.imageLists.length>0){
                    this.measurementForm.image_id = this.editInfos.image_id.slice();
                    this.measurementForm.imageLists = this.editInfos.imageLists.slice();
                }
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.id){
                    this.measurementForm = Object.assign({},newVal);
                    if(newVal.imageLists && newVal.imageLists.length>0){
                        this.measurementForm.image_id = newVal.image_id.slice();
                        this.measurementForm.imageLists = newVal.imageLists.slice();
                    }
                }
            }
        },
        methods:{
            handleRemove(file, fileList) {
                const index = this.measurementForm.image_id.findIndex(function(item, index, arr) {
                    return item === file.url;
                });
                this.measurementForm.image_id.splice(index,1);
                this.measurementForm.imageLists = fileList;
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