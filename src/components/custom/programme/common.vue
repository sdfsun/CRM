<template>
    <section class="common_container">
        <el-form-item label='名称：'>
            <el-row :gutter="10">
                <el-col :span="13">
                    <el-input  v-model="dataForm.name" placeholder='模块名称'></el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="primary" @click="deleteModel">删除模块</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label='图片：'>
            <el-upload
                ref='upload'
                action="/crm-upload_image.html"
                list-type="picture-card"
                name='mypic[]'
                :file-list="dataForm.imageLists"
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
    </section>
</template>
<script>
    export default{
        name:'common',
        props:['dataForm','index'],
        data(){
            return{
                dialogImageUrl:'',
                dialogVisible:false,
            }
        },
        methods:{
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
                    this.dataForm.image_url = tempImageIds.slice();
                    this.dataForm.imageLists = fileList;
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList){//上传成功
                if(response.success && response.success.length>0){
                    if(!this.dataForm.image_url){
                        this.dataForm.image_url = [];
                    }
                    this.dataForm.image_url.push(response.success[0].image_id);
                }
                this.dataForm.imageLists = fileList;
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