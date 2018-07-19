<template>
    <section class="present_container">
        <el-button type="primary" icon='el-icon-plus' class='add_source' @click='insertRecord'>新建奖品记录</el-button>
        <el-table
            ref='customListsTable'
            :data="presentLists"
            stripe
            border
            header-row-class-name='header_row_style'>
            <el-table-column
                type="index"
                :index="1"
                label='序号'
                width='80'
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="奖品名称"
                min-width="120px">
            </el-table-column>
            <el-table-column
                prop='store'
                label="库存"
                min-width="90px">
            </el-table-column>
            <el-table-column
                prop="org_name"
                label="所属门店"
                min-width="140px">
            </el-table-column>
            <el-table-column
                prop="disabled_name"
                label="是否失效"
                min-width="80px">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间"
                min-width="140px">
            </el-table-column>
            <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="handleEdit(scope.row)"
                        type="text"
                        size="medium">
                        编辑
                    </el-button>
                    <el-button
                        @click.native.prevent="sendPresent(scope.row)"
                        type="text"
                        size="medium"
                        v-if="scope.row.disabled === 'false'">
                        分发奖品
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="奖品记录" :visible.sync="presentDialogVisible" @close='resetpresentEdit' class='present_dialog' :close-on-click-modal='false'>
            <el-form ref="presentForm" :model="presentForm" :rules='presentFormRules' label-width="95px">
                <el-form-item prop='name' label='名称'>
                    <el-input v-model="presentForm.name" placeholder='请输入奖品名称'></el-input>
                </el-form-item>
                <el-form-item prop='store' label='库存'>
                    <el-input v-model="presentForm.store" placeholder='请输入奖品库存'></el-input>
                </el-form-item>
                <el-form-item label="所属门店" prop='org_id'>
                    <el-select v-model="presentForm.org_id" placeholder="请选择所属门店">
                        <el-option
                            v-for="item in orgs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='month' label='所属月份'>
                    <el-input v-model="presentForm.month" placeholder='请输入所属月份'></el-input>
                </el-form-item>
                <el-form-item label="是否失效" prop='disabled'>
                    <el-switch
                        v-model="presentForm.disabled"
                        active-value="true"
                        inactive-value="false">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmitForm('presentForm')" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="奖品发放记录" :visible.sync="presentReceiveDialogVisible" @close='resetPresentReceiveEdit' class='presentReceive_dialog' :close-on-click-modal='false'>
            <el-form ref="presentReceiveForm" :model="presentReceiveForm" :rules='presentReceiveFormRules' label-width="90px">
                <el-form-item prop='prize_id' class='hide-form-item'></el-form-item>
                <el-form-item prop='prize_name' label='奖品名称'>
                    <el-input v-model="presentReceiveForm.prize_name" readonly></el-input>
                </el-form-item>
                <el-form-item prop='mobile' label='领取人手机'>
                    <el-input v-model="presentReceiveForm.mobile" placeholder='请输入领取人电话' max-length="11"></el-input>
                </el-form-item>
                <el-form-item prop='nums' label='发放数量'>
                    <el-input v-model="presentReceiveForm.nums" placeholder='请输入发放数量' type="number"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="onSubmitSendForm('presentReceiveForm')" class='submit_btn'>保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {prize_index,prize_save,prize_grant} from '@/service/getData';
    var isPhone = /^1[3456789]\d{9}$/;

    export default{
        name:'present',
        data(){
            return{
                presentLists:[],
                submitBtnStatus:false,
                presentDialogVisible:false,
                presentReceiveDialogVisible:false,
                presentForm:{
                    name:'',//名称
                    store:'',//库存
                    org_id:'',//所属门店
                    month:'',//所属月份
                    disabled:'false'//是否失效
                },
                presentFormRules:{
                    name: [
                        {  required: true, message: '请输入奖品名称', trigger: 'blur' }
                    ],
                    store: [
                        {  required: true, message: '请输入库存', trigger: 'blur' }
                    ],
                    org_id: [
                        {  required: true, message: '请选择所属门店', trigger: 'change' }
                    ]
                },
                presentReceiveForm:{
                    prize_id:'',//奖品id
                    prize_name:'',//奖品名称
                    mobile:'',//电话
                    nums:''//发放数量
                },
                presentReceiveFormRules:{
                    mobile: [
                        {  required: true, message: '请输入领取人电话', trigger: 'blur' }
                    ],
                    nums: [
                        {  required: true, message: '请输入发放数量', trigger: 'blur' }
                    ]
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
                ]
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                try {
                    let that = this;
                    let res = await prize_index();
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
                    if(res.success){
                        this.presentLists = res.success;
                    }else{
                        this.presentLists = [];
                    }
                } catch(e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            insertRecord(){//新增记录
                this.presentForm = {};
                this.$set(this.presentForm,'disabled','false');
                this.presentDialogVisible = true;
            },
            handleEdit(curRow){//编辑
                this.presentForm = Object.assign({},curRow);
                this.presentDialogVisible = true;
            },
            updateReceiveRecord(callbackData){//更新奖品记录
                try {
                    this.presentDialogVisible = false;
                    if(callbackData.data){
                        if(callbackData.type === 'add'){
                            this.presentLists.push(callbackData.data);
                        }else{//编辑
                            const index = this.presentLists.findIndex(function(item, index, arr) {
                                return item.id === callbackData.data.id;
                            });
                            this.$set(this.presentLists,index,callbackData.data);
                        }
                    }
                }catch (e) {
                    this.$message({
                        showClose:true,
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            resetpresentEdit(){//重置表单数据
                this.presentDialogVisible = false;
                this.$refs['presentForm'].resetFields();
            },
            onSubmitForm(formName){//保存奖品记录
                if(this.submitBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitBtnStatus = true;
                        prize_save(this.presentForm).then(res=>{
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
                            that.resetpresentEdit();
                            if(this.presentForm && this.presentForm.id){//编辑
                                that.updateReceiveRecord({data:res.data,type:'edit'});
                            }else{//新增
                                that.updateReceiveRecord({data:res.data,type:'add'});
                            }
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
            sendPresent(currentRow){//发放奖品
                this.presentReceiveForm.prize_id = currentRow.id;
                this.presentReceiveForm.prize_name = currentRow.name;
                this.presentReceiveDialogVisible = true;
            },
            resetPresentReceiveEdit(){//奖品发放弹框重置
                this.presentReceiveDialogVisible = false;
                this.$refs['presentReceiveForm'].resetFields();
            },
            onSubmitSendForm(formName){//奖品发放
                if(this.submitBtnStatus === true){
                    return false;
                }
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!isPhone.test(this.presentReceiveForm.mobile)){
                            this.$message({
                                showClose:true,
                                message: '手机号格式不正确',
                                type: 'error'
                            });
                            return false;
                        }
                        this.submitBtnStatus = true;
                        prize_grant(this.presentReceiveForm).then(res=>{
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
                            const index = this.presentLists.findIndex(function(item, index, arr) {
                                return item.id === that.presentReceiveForm.prize_id;
                            });
                            this.$set(this.presentLists[index],"store",res.data.store);
                            that.resetPresentReceiveEdit();
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
            }
        }
    }
</script>
<style scoped>
    .present_container{
        padding: 20px 30px;
    }
    .add_source{
        margin-bottom: 20px;
    }
    .btns{
        text-align: center;
    }
    .submit_btn{
        width: 100px;
    }
</style>