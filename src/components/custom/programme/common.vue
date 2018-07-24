<template>
    <section class="common_container" v-bind:class="{ common_container_look: type === '2' }">
        <el-form-item label='名称：'>
            <el-row :gutter="10">
                <el-col :span="13">
                    <el-input  v-model="dataForm.name" placeholder='模块名称' v-if='type !== "2"' clearable></el-input>
                    <el-input  v-model="dataForm.name" readonly placeholder='模块名称' v-else></el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="primary" @click="deleteModel" v-if='type !== "2"'>删除模块</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label='图片/文件：'>
            <el-upload
                ref='upload'
                action="/crm-upload_image.html"
                list-type="picture-card"
                name='mypic[]'
                :disabled = 'type != "2"?false:true'
                :file-list="dataForm.imageLists"
                :multiple='true'
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success='handleSuccess'>
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
                <el-carousel height="400px" :autoplay='false'  ref='carouselItems' :initial-index='initialIndex' trigger="click">
                    <el-carousel-item v-for="(item,index) in dataForm.imageLists" :key="index" :name='item.url'>
                        <img :src="item.url" class="image_carousel_item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
        </el-form-item>
    </section>
</template>
<script>
    import {getUploadIcon} from '@/utils/index';
    export default{
        name:'common',
        props:['dataForm','index','type'],
        data(){
            return{
                dialogImageUrl:'',
                dialogVisible:false,
                initialIndex:0
            }
        },
        methods:{
            handleRemove(file, fileList) {
                try {
                    if(file.response && file.response.success && file.response.success.length>0 || file.status === 'success'){
                        var tempImageIds = [];
                        fileList.forEach( function(item, index) {
                            if(item.response && item.response.success && item.response.success.length>0){
                                tempImageIds.push(item.response.success[0].image_id);
                            }else if(item.status === 'success'){
                                tempImageIds.push(item.image_id);
                            }
                        });
                        this.dataForm.image_url = tempImageIds.slice();
                        this.dataForm.imageLists = fileList;
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handlePictureCardPreview(file) {
                try {
                    let flag = false,fileUrl='';//是否为文件
                    if(file.response && file.response.success && file.response.success.length>0){
                        fileUrl = file.response.success[0].image_id;
                        if(getUploadIcon(fileUrl)){
                            flag = true;
                        }
                    }else if(file.status === 'success'){
                        fileUrl = file.image_id;
                        if(getUploadIcon(fileUrl)){
                            flag = true;
                        }
                    }
                    if(flag){//非图片
                        window.open(fileUrl);
                    }else{
                        let tempLists = this.dataForm.imageLists;
                        const index = tempLists.findIndex(function(item, index, arr) {
                            return item.url === file.url
                        });
                        this.initialIndex = index;
                        this.dialogVisible = true;
                        this.$nextTick(()=>{
                            this.$refs['carouselItems'].setActiveItem(file.url);
                        });
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            handleSuccess(response, file, fileList){//上传成功
                try {
                    if(response.success && response.success.length>0){
                        if(!this.dataForm.image_url){
                            this.dataForm.image_url = [];
                        }
                        this.dataForm.image_url.push(response.success[0].image_id);
                    }
                    this.dataForm.imageLists = fileList;
                    let fileUrl = getUploadIcon(file.name);
                    if(fileUrl){
                        file.url = fileUrl;
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                //   this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message({
                        showClose:true,
                        message:'上传头像图片大小不能超过 2MB!',
                        type:'error'
                    });
                    return false;
                }
                return isLt2M;
            },
            deleteModel(){//删除模块
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('deleteModal',this.index);
                });
            }
        }
    }
</script>
<style scoped>
    .common_container{
        margin-top: 20px;
    }
    .common_container .el-input{
        height: 48px;
        line-height: 48px;
    }
    .el-input__inner{
        height: 100%;
    }
</style>