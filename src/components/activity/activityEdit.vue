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
            <el-form-item prop='imageLists' label='海报图片'>
                <el-upload
                    ref='upload'
                    action="/crm-upload_image.html"
                    list-type="picture-card"
                    name='mypic[]'
                    :multiple='true'
                    :file-list="activityForm.imageLists"
                    :on-preview="handlePictureCardPreview"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :on-success='handleSuccess'>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                    <el-carousel height="400px" :autoplay='false' ref='carouselItems'  :initial-index='initialIndex'>
                        <el-carousel-item v-for="(item,index) in activityForm.imageLists" :key="index" :name='item.url'>
                            <img :src="item.url" class="image_carousel_item">
                        </el-carousel-item>
                    </el-carousel>
                </el-dialog>
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
                    image_id:[],//图片列表
                    imageLists:[],//图片列表
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
                dialogVisible:false,
                initialIndex:0,
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
                if(this.editInfos.imageLists && this.editInfos.imageLists.length>0){
                    this.activityForm.image_id = this.editInfos.image_id.slice();
                    this.activityForm.imageLists = this.editInfos.imageLists.slice();
                }
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.id){
                    this.activityForm = Object.assign({},newVal);
                    if(newVal.imageLists && newVal.imageLists.length>0){
                        this.activityForm.image_id = newVal.image_id.slice();
                        this.activityForm.imageLists = newVal.imageLists.slice();
                    }
                }else{
                    this.resetFormData();
                    this.activityForm.image_id = [];
                    this.activityForm.imageLists = [];
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
                        this.activityForm.imageLists = fileList;
                        this.activityForm.image_id = tempImageIds.slice();
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
                    let tempLists = this.activityForm.imageLists;
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
                    this.activityForm.image_id.push(response.success[0].image_id);
                }
                this.activityForm.imageLists = fileList;
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
                let that = this;
                this.$refs[formName].validate((valid,obj) => {
                    try {
                        if (valid) {
                            this.submitBtnStatus = true;
                            delete this.activityForm['imageLists'];
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
                                if(res.data && this.memberRoleId.org_id === res.data.org_id && res.data.disabled === 'true'){
                                    this.updateActivitys(res.data);
                                }
                            }).catch(error=>{
                                this.submitBtnStatus = false;
                                this.$message({
                                    message: error.message,
                                    type: 'error'
                                });
                            });
                        }
                    } catch(e) {
                        this.$message({
                            message: e.message,
                            type: 'error'
                        });
                    }
                });
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