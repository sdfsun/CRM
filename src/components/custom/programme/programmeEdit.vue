<template>
    <section class="programmeEdit_container">
        <el-form ref="programmeForm" label-position="left" :model="programmeForm" label-width='55px'>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-row>
                        <span class="title">效果明细</span>
                        <el-button type="primary" @click="addScheme"  v-if='programmeForm.type != "2"'>添加模块</el-button>
                    </el-row>
                    <template v-for='(detail,index) in programmeForm.scheme'>
                        <common :dataForm='detail' :index='index' v-on:deleteModal='deleteSchemeModal' :type='programmeForm.type'></common>
                    </template>
                </el-col>
                <el-col :span="12">
                    <el-row>
                        <span class="title">相关资料</span>
                        <el-button type="primary" @click="addRelevant"  v-if='programmeForm.type != "2"'>添加模块</el-button>
                    </el-row>
                    <template v-for='(rel,ind) in programmeForm.relevant_data'>
                        <common :dataForm='rel' :index='ind' v-on:deleteModal='deleteRelevantModal' :type='programmeForm.type'></common>
                    </template>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('programmeForm')" class='submit_btn'  v-if='programmeForm.type != "2"'>保存</el-button>
        </div>
    </section>
</template>
<script>
    import common from '@/components/custom/programme/common';
    import {programme_save} from '@/service/getData';

    export default{
        name:'programmeEdit',
        props:['informationItem','editInfos'],
        data(){
            return{
                programmeForm:{
                    information_id:this.informationItem.id,//客户id
                    scheme:[{}],//效果明細
                    relevant_data:[{}]//相关资料
                },
                submitBtnStatus:false//保存按钮是否可点击
            }
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.programmeForm = Object.assign({},this.editInfos);
            }else{
                this.resetFormData();
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                this.programmeForm.information_id = this.informationItem.id;
                if(newVal.id){
                    this.programmeForm = Object.assign({},newVal);
                }else{//新增
                    this.resetFormData();
                    this.programmeForm.scheme = [{
                        name:'',
                        image_url:[],
                        imageLists:[]
                    }];
                    this.programmeForm.relevant_data = [{
                        name:'',
                        image_url:[],
                        imageLists:[]
                    }];
                }
            }
        },
        methods:{
            resetFormData(){
                delete this.programmeForm['id'];
                delete this.programmeForm['createtime'];
                delete this.programmeForm['update_time'];
                delete this.programmeForm['disabled'];
            },
            addScheme(){//添加效果明细
                this.programmeForm.scheme.push({});
            },
            addRelevant(){//添加相关资料
                this.programmeForm.relevant_data.push({});
            },
            deleteSchemeModal(index){//删除效果明细模块
                this.programmeForm.scheme.splice(index,1);
            },
            deleteRelevantModal(index){//删除相关资料模块
                this.programmeForm.relevant_data.splice(index,1);
            },
            onSubmit(formName){
                let that = this;
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    this.submitBtnStatus = true;
                    //删除效果的imageLists
                    if(this.programmeForm.scheme && this.programmeForm.scheme.length>0){
                        this.programmeForm.scheme.forEach( function(se, si) {
                            delete se.imageLists;
                        });
                    }
                    //删除相关资料的imageLists
                    if(this.programmeForm.relevant_data && this.programmeForm.relevant_data.length>0){
                        this.programmeForm.relevant_data.forEach( function(re, ri) {
                            delete re.imageLists;
                        });
                    }
                    this.$refs[formName].validate((valid) => {
                        programme_save(this.programmeForm).then(res=>{
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
                            that.closeProgrammeInfoDialog("programmeForm",res.data);
                        }).catch(error=>{
                            // this.$message({
                            //     message: error,
                            //     type: 'error'
                            // });
                            this.submitBtnStatus = false;
                        });
                    });
                    
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                    this.submitBtnStatus = false;
                }
            },
            closeProgrammeInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomProgrammeInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomProgrammeInfoDialog',{data:result,type:'add'});
                }
            }
        },
        components:{
            common
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
    .title{
        font-size: 20px;
        line-height: 48px;
        font-weight: bold;
        margin-right: 10px;
        margin-bottom: 20px;
    }
</style>