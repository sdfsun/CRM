<template>
    <div class="basicInfo_container">
        <ul class="col_1">
            <li class="title">客户基本信息</li>
            <li style="line-height:20px;">
                <span class="txt_1">姓名：</span>
                <div class="txt_2">
                    <span style="display:inline-block;">{{basicInfoRecord.name}}</span>
                    <el-rate v-model="basicInfoRecord.star_level" disabled></el-rate>
                </div>
            </li>
            <li>
                <span class="txt_1">手机：</span>
                <span class="txt_2">{{basicInfoRecord.mobile}}</span>
            </li>
            <li>
                <span class="txt_1">电话：</span>
                <span class="txt_2">{{basicInfoRecord.tel}}</span>
            </li>
            <li>
                <span class="txt_1">地址：</span>
                <span class="txt_2">{{basicInfoRecord.area}}{{basicInfoRecord.addr}}</span>
            </li>
            <li>
                <span class="txt_1">QQ：</span>
                <span class="txt_2">{{basicInfoRecord.qq}}</span>
            </li>
            <li>
                <span class="txt_1">微信：</span>
                <span class="txt_2">{{basicInfoRecord.weixin}}</span>
            </li>
            <li>
                <span class="txt_1">邮箱：</span>
                <span class="txt_2">{{basicInfoRecord.email}}</span>
            </li>
        </ul>
        <ul class="col_2">
            <li class="title">客户装修信息</li>
            <li>
                <span class="txt_1">房屋状态：</span>
                <span class="txt_2" v-if='basicInfoRecord.house_type'>{{basicInfoRecord.house_type}}/{{basicInfoRecord.house_status}}</span>
            </li>
            <li>
                <span class="txt_1">户型：</span>
                <span class="txt_2">
                    {{basicInfoRecord.house_layout}}
                </span>
            </li>
            <li>
                <span class="txt_1">预算：</span>
                <span class="txt_2" v-if='basicInfoRecord.budget'>{{basicInfoRecord.budget}}万</span>
            </li>
            <li>
                <span class="txt_1">装修需求：</span>
                <span class="txt_2">{{basicInfoRecord.demand}}</span>
            </li>
            <li>
                <span class="txt_1">房屋面积：</span>
                <span class="txt_2">{{basicInfoRecord.acreage}}</span>
            </li>
            <li>
                <span class="txt_1">客户来源：</span>
                <span class="txt_2">{{basicInfoRecord.source_name}}</span>
            </li>
            <li>
                <span class="txt_1">来源说明：</span>
                <span class="txt_2">{{basicInfoRecord.source_explain}}</span>
            </li>
        </ul>
        <ul class="col_3">
            <li class="title"></li>
            <li>
                <span class="txt_1">客户职业：</span>
                <span class="txt_2">{{basicInfoRecord.occupation}}</span>
            </li>
            <li>
                <span class="txt_1">家庭成员：</span>
                <span class="txt_2">{{basicInfoRecord.family}}</span>
            </li>
            <li>
                <span class="txt_1">房屋类型：</span>
                <span class="txt_2">{{basicInfoRecord.house_genre}}</span>
            </li>
            <li>
                <span class="txt_1">装修阶段：</span>
                <span class="txt_2">{{basicInfoRecord.decoration_stage}}</span>
            </li>
            <li>
                <span class="txt_1">计划入住时间：</span>
                <span class="txt_2">{{basicInfoRecord.check_time}}</span>
            </li>
            <li>
                <span class="txt_1">准备购买家居空间：</span>
                <span class="txt_2" v-if='basicInfoRecord.buy_space && basicInfoRecord.buy_space.length>0'>{{basicInfoRecord.buy_space.join(",")}}</span>
            </li>
            <li>
                <span class="txt_1">风格选择：</span>
                <span class="txt_2">{{basicInfoRecord.house_style}}</span>
            </li>
        </ul>
        <ul class="col_3">
            <li class="title"></li>
            <li>
                <span class="txt_1">是否装客：</span>
                <span class="txt_2" v-if='basicInfoRecord.guest'>是</span>
                <span class="txt_2" v-else>否</span>
            </li>
            <li>
                <span class="txt_1">客户类型：</span>
                <span class="txt_2">{{basicInfoRecord.client_type_name}}</span>
            </li>
            <li>
                <span class="txt_1">归属设计师：</span>
                <span class="txt_2">{{basicInfoRecord.member_name}}</span>
            </li>
            <li>
                <span class="txt_1">状态：</span>
                <span class="txt_2">{{basicInfoRecord.status_name}}</span>
            </li>
            <li>
                <span class="txt_1">是否预约：</span>
                <span class="txt_2">{{basicInfoRecord.bespeak_name}}</span>
            </li>
            <li>
                <span class="txt_1">客户备注：</span>
                <span class="txt_2">{{basicInfoRecord.remarks}}</span>
            </li>
            <li class="special_assign" v-if="basicInfoRecord.status && basicInfoRecord.status[basicInfoRecord.status.length-1]<10">
                <span class="txt_1">特殊指派设计师：</span>
                <span class="txt_2">
                    <el-button type="primary" @click='special_assign'>指派设计师</el-button>
                </span>
            </li>
        </ul>
        <!--特殊指派设计师-->
        <el-dialog title="指派设计师" :visible.sync="specialAssignDialogVisible" class="specialAssignDialog">
            <el-form ref="assignForm" :model="assignForm" labelWidth="70px" :rules="assignFormRules">
                <el-form-item prop='member_id' label="设计师">
                    <el-select v-model="assignForm.member_id" clearable placeholder="设计师">
                        <el-option
                            v-for="item in designers"
                            :key="item.member_id"
                            :label="item.name"
                            :value="item.member_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='status' label="客户状态">
                    <el-cascader
                        placeholder='请选择客户状态'
                        :options="customStatus"
                        v-model="assignForm.status"
                        :props="statusDefaultProps"
                        clearable>
                    </el-cascader>
                </el-form-item>
                <div class="btns">
                    <el-button type="primary" @click='submitForm' class="special_assign_btn">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {special_assign} from '@/service/getData';
    import {mapState} from 'vuex';

    export default{
        name:'basicInfo',
        props:['basicInfoRecord'],
        data(){
            return{
                specialAssignDialogVisible:false,
                assignForm:{
                    member_id:"",//设计师
                    status:[]//客户状态
                },
                statusDefaultProps:{
                    value:'id',
                    label:'name',
                    children:'menus'
                },
                assignFormRules:{
                    member_id: [
                        { required: true, message: '请选择设计师', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择客户状态', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            ...mapState([
                'customStatus',
                'designers'
            ])
        },
        methods:{
            special_assign(){
                this.specialAssignDialogVisible = true;
            },
            submitForm(){
                try {
                    const that = this;
                    this.$refs['assignForm'].validate((valid) => {
                        if (valid) {
                            if(!this.basicInfoRecord.id){
                                this.$message({
                                    showClose:true,
                                    message: '客户信息有误，请刷新页面重试',
                                    type: 'error'
                                });
                                return false;
                            }
                            let tempFormData = Object.assign({},this.assignForm);
                            //重置客户状态
                            if(tempFormData.status){
                                const len2 = tempFormData.status.length;
                                tempFormData.status = tempFormData.status[len2-1];
                            }
                            tempFormData.information_id = this.basicInfoRecord.id;
                            special_assign(tempFormData).then(res=>{
                                if(res.error){
                                    this.$message({
                                        showClose:true,
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
                                    showClose:true,
                                    message:res.success,
                                    type:'success'
                                });
                                this.specialAssignDialogVisible = false;
                                this.$emit('updateCustomBasicInfo',res.data);
                            }).catch(error=>{
                                this.$message({
                                    showClose:true,
                                    message: error.message,
                                    type: 'error'
                                });
                            });
                        }
                    });
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .basicInfo_container{
        display: flex;
        padding: 20px 24px 0;
        overflow: hidden;
    }
    .basicInfo_container ul{
        flex: 1;
        font-size: 12px;
        line-height: 18px;
        color: #4D4D4D;
        margin-bottom: 0;
    }
    ul .title{
        font-size: 13px;
        color: #010101;
        margin-bottom: 14px;
        height: 20px;
        font-weight: bold;
        margin-left: 21px;
    }
    ul.col_2 .title{
        margin-left: 30px;
    }
    ul li{
        list-style: none;
        margin-bottom: 10px;
        display: flex;
    }
    ul li .txt_1{
        color: #919191;
        text-align: right;
    }
    ul li .txt_2{
        flex: 1;
    }
    .col_1 .txt_1{
        width: 57px;
    }
    .col_2 .txt_1{
        width: 90px;
    }
    .col_3 .txt_1{
        width: 110px;
    }
    .el-rate{
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
    }
    .special_assign .txt_1{
        line-height:36px;
    }
    .btns{
        text-align: center;
        margin-top: 40px;
    }
    .special_assign_btn{
        width: 120px;
    }
</style>