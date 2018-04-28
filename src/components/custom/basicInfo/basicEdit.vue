<template>
    <section class="basicForm_container">
        <el-form ref="basicForms" :model="basicForm" :rules="basicFormRules" label-width="80px" >
            <el-form-item prop='id' class='hide-form-item'></el-form-item>
            <el-form-item prop='createtime' class='hide-form-item'></el-form-item>
            <el-form-item prop='update_time' class='hide-form-item'></el-form-item>
            <el-form-item prop='customer_number' class='hide-form-item'></el-form-item>
            <el-form-item prop='org_id' class='hide-form-item'></el-form-item>
            <el-form-item label="姓名" prop='name'>
                <el-input v-model="basicForm.name"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop='area'>
                <el-cascader
                    :options="areaOptions"
                    v-model="basicForm.area">
                </el-cascader>
            </el-form-item>
            <el-form-item label='性别' prop='sex'>
                <el-radio-group v-model="basicForm.sex">
                    <el-radio label="1">男士</el-radio>
                    <el-radio label="2">女士</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="地址" prop='addr'>
                <el-input v-model="basicForm.addr" placeholder='请输入详细地址'></el-input>
            </el-form-item>
            <el-form-item label="电话" prop='tel' ref='telItem'>
                <el-input v-model="basicForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop='mobile' ref='mobileItem'>
                <el-input v-model.number="basicForm.mobile" maxlength='11'></el-input>
            </el-form-item>
            <el-form-item label="qq" prop='qq' ref='qqItem'>
                <el-input v-model="basicForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="微信" prop='weixin' ref='weixinItem'>
                <el-input v-model="basicForm.weixin"></el-input>
            </el-form-item>
            <el-form-item label="房屋类型" prop='houseTypeOptions'>
                <el-cascader
                    v-model="basicForm.houseTypeOptions"
                    :options="houseOptions"
                    @change="houseHandleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="户型"  prop='house_layout'>
                <el-input type="textarea" autosize v-model="basicForm.house_layout" placeholder='例：别墅 4房3厅 儿童房，女孩 8岁'></el-input>
            </el-form-item>
            
            <el-form-item label="装修预算"  prop='budget' class='budget_item'>
                <el-input type='number' v-model="basicForm.budget" placeholder='装修预算'>
                    <i slot="suffix">W</i>
                </el-input>
            </el-form-item>
            <el-form-item label="装修需求" prop='demand'>
                <el-select v-model="basicForm.demand" placeholder="装修需求">
                    <el-option label="标准件" value="标准件"></el-option>
                    <el-option label="全屋设计" value="全屋设计"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop='status'>
                <el-select v-model="basicForm.status" placeholder="状态">
                    <el-option
                        v-for="item in customStatus"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop='email' ref='emailItem'>
                <el-input type='email' v-model="basicForm.email"></el-input>
            </el-form-item>
            <!-- <el-form-item label='是否装客'>
                <el-radio-group v-model="basicForm.guest">
                    <el-radio label="是"></el-radio>
                    <el-radio label="否"></el-radio>
                </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label='是否预约成功' label-width='100px' prop='bespeak'>
                <el-radio-group v-model="basicForm.bespeak">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="客户来源" prop='source'>
                <el-select v-model="basicForm.source" placeholder="请选择客户来源">
                    <el-option
                        v-for="item in customSource"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        v-if='item.disabled'>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户备注" class='remarks_item' prop='remarks'>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="basicForm.remarks" placeholder='客户备注'></el-input>
            </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="onSubmit('basicForms')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    const isPhone = /^1[3456789]\d{9}$/;
    const isEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    import { region } from '@/service/region';
    import { customer_save } from '@/service/getData';
    import { mapState } from 'vuex';

    export default{
        name:'basicEdit',
        props:['editInfos'],
        data(){
            //校验电话、qq、微信、手机
            let checkRelateMethod = (rule, value, callback)=>{
                if(this.basicForm.mobile === '' && this.basicForm.tel === '' && this.basicForm.qq === '' && this.basicForm.weixin === ''){
                    callback(new Error('电话、手机、qq、微信必填一项'));
                    return false;
                }
                if(this.basicForm.mobile !== '' && !isPhone.test(this.basicForm.mobile)){
                    callback(new Error('请输入正确的手机号码'));
                    return false;
                }
                if(rule.field === 'mobile'){
                    this.$refs['qqItem'].clearValidate();
                    this.$refs['weixinItem'].clearValidate();
                    this.$refs['telItem'].clearValidate();
                }else if(rule.field === 'tel'){
                    this.$refs['qqItem'].clearValidate();
                    this.$refs['weixinItem'].clearValidate();
                    this.$refs['mobileItem'].clearValidate();
                }else if(rule.field === 'qq'){
                    this.$refs['mobileItem'].clearValidate();
                    this.$refs['weixinItem'].clearValidate();
                    this.$refs['telItem'].clearValidate();
                }else{
                    this.$refs['qqItem'].clearValidate();
                    this.$refs['mobileItem'].clearValidate();
                    this.$refs['telItem'].clearValidate();
                }
                callback();
            };
            let checkEmail = (rule, value, callback)=>{
                if(value === ''){
                    this.$refs['emailItem'].clearValidate();
                    callback();
                    return false;
                }
                if(value !== '' && !isEmail.test(value)){
                    callback(new Error('请输入正确的邮箱地址'));
                    return false;
                }
                callback();
            };
            return{
                basicForm:{
                    id:'',
                    customer_number:'',
                    createtime:'',
                    update_time:'',
                    org_id:'',
                    name:"",
                    sex:"0",
                    tel:"",
                    mobile:"",
                    qq:"",
                    weixin:"",
                    email:"",
                    source:'',
                    guest:"",
                    // bespeak:"false",
                    demand:'',
                    area:[],
                    addr:"",
                    house_type:"",
                    house_status:"",
                    house_layout:"",
                    budget:"",
                    status:"0",
                    remarks:"",
                    houseTypeOptions:[]//房屋类型
                },
                areaOptions:region,
                submitBtnStatus:false,//是否可点击保存按钮
                basicFormRules:{//规则校验
                    mobile:[
                        { validator: checkRelateMethod}
                    ],
                    tel:[
                        { validator: checkRelateMethod}
                    ],
                    qq:[
                        { validator: checkRelateMethod}
                    ],
                    weixin:[
                        { validator: checkRelateMethod}
                    ],
                    source: [
                        { required: true, message: '请选择客户来源', trigger: 'change' }
                    ],
                    email:[
                        { validator: checkEmail}
                    ]
                },
                houseOptions:[
                    {
                        value: '毛坯房',
                        label: '毛坯房',
                        children: [
                            {
                                value: '未交房',
                                label: '未交房',
                            },
                            {
                                value: '已交房',
                                label: '已交房',
                            },
                            {
                                value: '做水电',
                                label: '做水电',
                            },
                            {
                                value: '装修完',
                                label: '装修完'
                            },
                            {
                                value: '未知',
                                label: '未知'
                            }
                        ]
                    },
                    {
                        value: '精装房',
                        label: '精装房',
                        children: [
                            {
                                value: '未交房',
                                label: '未交房',
                            },
                            {
                                value: '已交房',
                                label: '已交房',
                            },
                            {
                                value: '未知',
                                label: '未知'
                            }
                        ]
                    },
                    {
                        value: '二手房/旧房翻新',
                        label: '二手房/旧房翻新',
                        children: [
                            {
                                value: '是否已拆',
                                label: '是否已拆',
                            },
                            {
                                value: '未交房',
                                label: '未交房',
                            },
                            {
                                value: '已交房',
                                label: '已交房',
                            },
                            {
                                value: '做水电',
                                label: '做水电',
                            },
                            {
                                value: '装修完',
                                label: '装修完'
                            },
                            {
                                value: '未知',
                                label: '未知'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            ...mapState([
                'customSource',
                'customStatus'
            ])
        },
        mounted(){
            if(this.editInfos && this.editInfos.id){
                this.basicForm = Object.assign({},this.editInfos);
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                if(newVal.id){
                    this.basicForm = Object.assign({},newVal);
                }
            }
        },
        methods:{
            houseHandleChange(house){//房屋类型回调
                this.basicForm.house_type = house[0];
                this.basicForm.house_status = house[1];
            },
            onSubmit(formName){//保存
                if(this.submitBtnStatus === true){
                    return false;
                }
                try {
                    let that = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitBtnStatus = true;
                            customer_save(this.basicForm).then(res=>{
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
                                that.closeBasicInfoDialog("basicForms",res.data);
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
            closeBasicInfoDialog(formName,result){//关闭弹框
                this.$refs[formName].resetFields();//重置表单数据
                if(this.editInfos && this.editInfos.id){//编辑
                    this.$emit('closeCustomBasicInfoDialog',{data:result,type:'edit'});
                }else{//新增
                    this.$emit('closeCustomBasicInfoDialog',{data:result,type:'add'});
                }
            }
        }
    }
</script>
<style scoped>
    .basicForm_container .el-form{
        overflow: hidden;
    }
    .basicForm_container .el-form-item{
        width: 46%;
        float: left;
    }
    .basicForm_container .el-form-item:nth-child(2n){
        width: 52%;
        margin-left: 2%;
    }
    .el-select,.el-cascader,.basicForm_container .remarks_item{
        width: 100%;
    }
    .btns{
        text-align: center;
    }
    .btns .submit_btn{
        width: 120px;
    }
</style>