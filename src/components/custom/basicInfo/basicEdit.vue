<template>
    <section class="basicForm_container">
        <el-form ref="basicForms" :model="basicForm" :rules="basicFormRules" label-width="110px" >
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="姓名" prop='name'>
                        <el-input v-model="basicForm.name" placeholder='请输入姓名' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="电话" prop='tel' ref='telItem'>
                        <el-input v-model="basicForm.tel" placeholder='请输入电话' clearable @change='checkMobileHandle'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机" prop='mobile' ref='mobileItem' >
                        <el-input v-model.number="basicForm.mobile" maxlength='11' placeholder='请输入手机' clearable @change='checkMobileHandle'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label='性别' prop='sex'>
                        <el-radio-group v-model="basicForm.sex">
                            <el-radio label="1">男士</el-radio>
                            <el-radio label="2">女士</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="qq" prop='qq' ref='qqItem'>
                        <el-input v-model="basicForm.qq" placeholder='请输入qq' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="微信" prop='weixin' ref='weixinItem'>
                        <el-input v-model="basicForm.weixin" placeholder='请输入微信' clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="客户职业" prop='occupation'>
                        <el-input v-model="basicForm.occupation" placeholder='请输入客户职业' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地区" prop='area'>
                        <el-cascader
                            :options="areaOptions"
                            v-model="basicForm.area"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址" prop='addr'>
                        <el-input v-model="basicForm.addr" placeholder='请输入详细地址' clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="家庭成员" prop='family'>
                        <el-select v-model="basicForm.family" placeholder="家庭成员" clearable>
                            <el-option label="单身" value="单身"></el-option>
                            <el-option label="2人" value="2人"></el-option>
                            <el-option label="3人" value="3人"></el-option>
                            <el-option label="4人" value="4人"></el-option>
                            <el-option label="5人" value="5人"></el-option>
                            <el-option label="6人及以上" value="6人及以上"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="房屋状态" prop='houseTypeOptions'>
                        <el-cascader
                            v-model="basicForm.houseTypeOptions"
                            :options="houseOptions"
                            @change="houseHandleChange"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="房屋类型" prop='house_genre'>
                        <el-select v-model="basicForm.house_genre" placeholder="房屋类型" clearable>
                            <el-option label="普通住宅" value="普通住宅"></el-option>
                            <el-option label="别墅" value="别墅"></el-option>
                            <el-option label="SOHO" value="SOHO"></el-option>
                            <el-option label="自建房" value="自建房"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="户型"  prop='house_layout'>
                        <el-input  v-model="basicForm.house_layout" placeholder='例：别墅 4房3厅 儿童房，女孩 8岁' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="房屋面积" prop='acreage'>
                        <el-select v-model="basicForm.acreage" placeholder="房屋面积" clearable>
                            <el-option label="50㎡以下" value="50㎡以下"></el-option>
                            <el-option label="50-80㎡" value="50-80㎡"></el-option>
                            <el-option label="80-120㎡" value="80-120㎡"></el-option>
                            <el-option label="120-150㎡" value="120-150㎡"></el-option>
                            <el-option label="150㎡以上" value="150㎡以上"></el-option>
                            <el-option label="200㎡以上" value="200㎡以上"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="装修阶段" prop='decoration_stage'>
                        <el-select v-model="basicForm.decoration_stage" placeholder="装修阶段" clearable>
                            <el-option label="准备装修" value="准备装修"></el-option>
                            <el-option label="正在装修" value="正在装修"></el-option>
                            <el-option label="已经装修" value="已经装修"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="计划入住时间" prop='check_time'>
                        <el-date-picker
                            v-model="basicForm.check_time"
                            type="month"
                            placeholder="计划入住时间"
                            value-format='yyyy-MM'
                            clearable>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="准备购买家居空间" prop='buy_space'>
                        <el-select v-model="basicForm.buy_space" multiple  placeholder="准备购买家居空间" clearable>
                            <el-option label="主卧" value="主卧"></el-option>
                            <el-option label="客卧" value="客卧"></el-option>
                            <el-option label="儿童房" value="儿童房"></el-option>
                            <el-option label="书房" value="书房"></el-option>
                            <el-option label="客餐厅" value="客餐厅"></el-option>
                            <el-option label="厨房" value="厨房"></el-option>
                            <el-option label="门厅" value="门厅"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="风格选择" prop='house_style'>
                        <el-select v-model="basicForm.house_style" filterable allow-create
                               default-first-option placeholder="风格选择" clearable>
                            <el-option label="新现代风格" value="新现代风格"></el-option>
                            <el-option label="新奢华风格" value="新奢华风格"></el-option>
                            <el-option label="新古典风格" value="新古典风格"></el-option>
                            <el-option label="新中式风格" value="新中式风格"></el-option>
                            <el-option label="其他" value="其他"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-row :gutter="0">
                        <el-col :span="17">
                            <el-form-item label="推广成本" prop='cost_times'>
                                <el-date-picker
                                    v-model="basicForm.cost_times"
                                    type="date"
                                    placeholder="推广时间"
                                    value-format='yyyy-MM-dd'
                                    class='tuiguang_item1'
                                    clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item  prop='cost'>
                                <el-input  v-model="basicForm.cost" placeholder='成本' class='tuiguang_item2' clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="装修预算"  prop='budget' class='budget_item'>
                        <el-input type='number' v-model="basicForm.budget" placeholder='装修预算' clearable>
                            <i slot="suffix">W</i>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="装修需求" prop='demand'>
                        <el-select v-model="basicForm.demand" placeholder="装修需求" clearable>
                            <el-option label="整屋服务" value="整屋服务"></el-option>
                            <el-option label="卫浴" value="卫浴"></el-option>
                            <el-option label="橱柜" value="橱柜"></el-option>
                            <el-option label="家具" value="家具"></el-option>
                            <el-option label="全屋定制" value="全屋定制"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="客户来源" prop='source'>
                        <el-cascader
                            :options="customSource"
                            v-model="basicForm.source"
                            :props="statusDefaultProps"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来源说明" prop='source_explain'>
                        <el-input  v-model="basicForm.source_explain" placeholder='请输入来源说明' clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="邮箱" prop='email' ref='emailItem'>
                        <el-input type='email' v-model="basicForm.email" placeholder='请输入邮箱' clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" v-if='hideType != "1"'>
                    <el-form-item label="客户状态" prop='status'>
                        <el-cascader
                            :options="customStatus"
                            v-model="basicForm.status"
                            :props="statusDefaultProps"
                            clearable>
                        </el-cascader>
                        <div class="tips">非特殊情况请勿更改客户状态</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户类型" prop='client_type'>
                        <el-select v-model="basicForm.client_type" placeholder="请选择客户类型" clearable>
                            <el-option label="装修用户(本地)" value="1"></el-option>
                            <el-option label="装修用户(外地)" value="4"></el-option>
                            <el-option label="合作商" value="2"></el-option>
                            <el-option label="其他" value="3"></el-option>
                            <el-option label="未知" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="星级" prop='star_level'>
                        <el-rate v-model="basicForm.star_level" @change='starLevelHandle'></el-rate>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="客户备注" class='remarks_item' prop='remarks'>
                        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="basicForm.remarks" placeholder='客户备注' clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="btns" v-if='hideType != "1"'>
            <el-button type="primary" @click="onSubmit('basicForms')" class='submit_btn'>保存</el-button>
        </div>
    </section>
</template>
<script>
    const isPhone = /^1[3456789]\d{9}$/;
    const isEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    import { region } from '@/service/region';
    import { customer_save,check_mobile } from '@/service/getData';
    import { mapState } from 'vuex';

    export default{
        name:'basicEdit',
        props:['editInfos','hideType'],
        data(){
            //校验电话、qq、微信、手机
            let checkRelateMethod = (rule, value, callback)=>{
                if(this.basicForm.mobile === '' && this.basicForm.tel === ''){
                    callback(new Error('电话、手机必填一项'));
                    return false;
                }
                if(this.basicForm.mobile !== '' && !isPhone.test(this.basicForm.mobile)){
                    if(rule.field === 'mobile'){
                        callback(new Error('请输入正确的手机号码'));
                        return false;
                    }
                }
                if(rule.field === 'mobile'){
                    // this.$refs['qqItem'].clearValidate();
                    // this.$refs['weixinItem'].clearValidate();
                    this.$refs['telItem'].clearValidate();
                }else{
                    // this.$refs['qqItem'].clearValidate();
                    // this.$refs['weixinItem'].clearValidate();
                    this.$refs['mobileItem'].clearValidate();
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
                    name:"",
                    sex:"0",
                    tel:"",
                    mobile:"",
                    qq:"",
                    weixin:"",
                    email:"",
                    source:[],
                    guest:"",
                    // bespeak:"false",
                    demand:'',
                    area:[],
                    addr:"",
                    house_type:"",
                    house_status:"",
                    house_layout:"",
                    budget:"",
                    status:['1','2'],
                    remarks:"",
                    houseTypeOptions:[],//房屋类型
                    client_type:'',
                    cost:'',
                    cost_times:'',
                    acreage:'',//房屋面积
                    source_explain:'',//来源说明
                    star_level:0,//星级
                    tempStarLevel:0,//临时存储星级字段
                    occupation:'',
                    family:'',
                    house_genre:'',
                    decoration_stage:'',
                    check_time:'',
                    buy_space:[],
                    house_style:''
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
                    // qq:[
                    //     { validator: checkRelateMethod}
                    // ],
                    // weixin:[
                    //     { validator: checkRelateMethod}
                    // ],
                    source: [
                        { required: true, message: '请选择客户来源', trigger: 'change' }
                    ],
                    email:[
                        { validator: checkEmail}
                    ]
                },
                statusDefaultProps:{
                    value:'id',
                    label:'name',
                    children:'menus'
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
                                value: '已拆',
                                label: '已拆',
                            },
                            {
                                value: '未拆',
                                label: '未拆',
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
            try {
                if(this.editInfos && this.editInfos.id){
                    let newValData = Object.assign({},this.editInfos);
                    if(newValData.house_type !== '' && newValData.house_status !== ''){//装修类型
                        newValData.houseTypeOptions = [newValData.house_type,newValData.house_status];
                    }
                    if(newValData.area){
                        if(typeof newValData.area === 'string' && newValData.area !== ''){//地区
                            let areaTempArr = newValData.area.split(" ");
                            newValData.area = areaTempArr.slice();
                        }
                    }else{
                        newValData.area=[];
                    }
                    this.basicForm = Object.assign({},newValData);
                    this.basicForm.tempStarLevel = newValData.star_level;
                }else{
                    this.resetFormData();
                    this.basicForm.tempStarLevel = 0;
                }
            } catch(e) {
                this.$message({
                    showClose:true,
                    message: e.message,
                    type: 'error'
                });
            }
        },
        watch:{
            editInfos:function(newVal,oldVal){//不应该使用箭头函数来定义 watcher 函数 箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例
                try {
                    if(newVal.id){
                        let newValData = Object.assign({},newVal);
                        if(newValData.house_type !== '' && newValData.house_status !== ''){//装修类型
                            newValData.houseTypeOptions = [newValData.house_type,newValData.house_status];
                        }
                        if(newValData.area){
                            if(typeof newValData.area === 'string' && newValData.area !== ''){//地区
                                let areaTempArr = newValData.area.split(" ");
                                newValData.area = areaTempArr.slice();
                            }
                        }else{
                            newValData.area=[];
                        }
                        this.basicForm = Object.assign({},newValData);
                        this.basicForm.tempStarLevel = newValData.star_level;
                    }else{
                        this.resetFormData();
                        this.basicForm.tempStarLevel = 0;
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        },
        methods:{
            starLevelHandle(val){
                if(this.basicForm.tempStarLevel === val){
                    this.basicForm.star_level = val-1;
                    this.basicForm.tempStarLevel = val-1;
                }else{
                    this.basicForm.tempStarLevel = val;
                }
            },
            resetFormData(){//重置表单数据
                delete this.basicForm['id'];
                delete this.basicForm['customer_number'];
                delete this.basicForm['createtime'];
                delete this.basicForm['update_time'];
                delete this.basicForm['org_id'];
            },
            async checkMobileHandle(val){//新增客户信息时 电话或手机改变时校验是否为CRM用户
                try{
                    const that = this;
                    if(this.basicForm.id || !val){//编辑 或 空值 不校验
                        return false;
                    }
                    const res = await check_mobile(val);
                    if(res.error){
                        this.$message({
                            showClose:true,
                            message: res.error,
                            type: 'error'
                        });
                        if(res.nologin == 1){//未登录
                            setTimeout(()=>{
                                that.$router.push('/');
                            },3000);
                        }
                        return false;
                    }
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            houseHandleChange(house){//房屋类型回调
                console.log(this.basicForm.source)
                if(house && house.length>0){
                    this.basicForm.house_type = house[0];
                    this.basicForm.house_status = house[1];
                }else {
                    this.basicForm.house_type = "";
                    this.basicForm.house_status = "";
                }
            },
            onSubmit(formName){//保存
                if(this.submitBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitBtnStatus = true;
                        let tempFormData = Object.assign({},this.basicForm);
                        //重置客户来源，客户状态
                        if(tempFormData.source){
                            const len = tempFormData.source.length;
                            tempFormData.source = tempFormData.source[len-1];
                        }
                        if(tempFormData.status){
                            const len2 = tempFormData.status.length;
                            tempFormData.status = tempFormData.status[len2-1];
                        }
                        customer_save(tempFormData).then(res=>{
                            this.submitBtnStatus = false;
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
                            that.closeBasicInfoDialog("basicForms",res.data);
                        }).catch(error=>{
                            this.submitBtnStatus = false;
                            this.$message({
                                showClose:true,
                                message: error.message,
                                type: 'error'
                            });
                        });
                    }
                });
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
    .el-form-item {
        margin-bottom: 16px;
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
    .tips{
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
        padding-top: 2px;
    }
    .el-rate{
        margin-top: 8px;
    }
</style>