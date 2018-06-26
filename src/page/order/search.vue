<template>
    <div class="orderSearch-container orderRelation-container">
        <div class="search-form">
            <el-input v-model='bval' placeholder="请输入商品型号或名称" class="search-input" clearable @keyup.13.native="searchGoods">
                <el-button slot="append" @click="searchGoods">搜索</el-button>
            </el-input>
            <template v-for="(con,index) in searchCondition">
                <div class="search-lists">
                    <p>{{con.title}}：</p>
                    <ul>
                        <li v-for="(conIl,il) in con.lists" @click="search(conIl.product_name,index)" :class="{active:currentChooseProName[index]===conIl.name}">
                            {{conIl.name}}
                        </li>
                    </ul>
                </div>
            </template>
        </div>
        <div class="search-results">
            <el-row :gutter="1">
                <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4" v-for="item in searchResults" :key="item.id">
                    <div class="search-item">
                        <div class="t1">
                            <img :src="item.image_default_id" :alt="item.product_name">
                            <p class="pro-guige">{{item.tag}}</p>
                        </div>
                        <div class="t2">
                            <h2 class="pro-title">{{item.product_name}}</h2>
                            <div class="item1">
                                <p class="pro-price">￥{{item.price}}</p>
                                <p class="pro-store" v-if="item.is_custom === 'false'">库存：{{item.store}}</p>
                            </div>
                            <p class="pro-status">{{item.status}}</p>
                            <div class="item1">
                                <el-input-number value="1" :min="1" :max="item.store" v-model="item.num"></el-input-number>
                                <el-button type="primary" class="addCart" @click="addCart(item)">加入订单</el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--多规格-->
        <el-dialog title="" :visible.sync="proSpecDialogVisible" class='proSpecdialog' :close-on-click-modal='false' v-if="proSpecDatas.product_name" @close="closeProSpecDialog">
            <div class="spec-modal">
                <div class="spec-header">
                    <img :src="proSpecDatas.image_default_id" :alt="proSpecDatas.product_name" class="spec-img">
                    <div class="s1">
                        <h2 class="spec-title">{{proSpecDatas.product_name}}</h2>
                        <p class="spec-price">￥{{proSpecDatas.price}}</p>
                        <p class="spec-status" :style="{color: proSpecDatas.send_type.color}"><strong>{{proSpecDatas.send_type.gTitle}}</strong>，{{proSpecDatas.send_type.gDesc}}</p>
                    </div>
                </div>
                <div class="spec-content">
                    <div class="s2">
                        <template v-if="proSpecDatas.canal === 'ziti'">
                            <el-input-number v-model="proSpecDatas.num" :min="1" :max='proSpecDatas.org_store' v-if="proSpecDatas.org_store>0"></el-input-number>
                            <el-input-number v-model="proSpecDatas.num" :min="1" :max='proSpecDatas.store' v-else-if="proSpecDatas.store>0"></el-input-number>
                            <el-input-number :value='0' :min="0" :max='0' v-else></el-input-number>
                            <p class="spec-store">门店库存：{{proSpecDatas.org_store}}，线上库存：{{proSpecDatas.store}}</p>
                        </template>
                        <template v-else>
                            <el-input-number v-model="proSpecDatas.num" :min="1" :max='proSpecDatas.store' v-if="proSpecDatas.store>0"></el-input-number>
                            <el-input-number :value='0' :min="0" :max='0'  v-else></el-input-number>
                            <p class="spec-store">库存：{{proSpecDatas.store}}</p>
                        </template>
                    </div>
                    <div class="s3">
                        <template v-for="specItem in proSpecDatas.spec">
                            <div class="s3-item " :class='{imageItems:specItem.spec_type=="img"}'>
                                <p class="txt-1">{{specItem.spec_name}}</p>
                                <ul>
                                    <template v-for='guige in specItem.sepc_list'>
                                        <template v-if='guige.select'>
                                            <template v-if="proSpecDatas.canal === 'ziti'">
                                                <li :class='{active:guige.select,disabled:guige.store<=0 && guige.org_store<=0}'  @click='choose_spec(proSpecDatas.goods_id,guige.product_id)'>{{guige.spec_value}}</li>
                                            </template>
                                            <li :class='{active:guige.select,disabled:guige.store<=0}'  @click='choose_spec(proSpecDatas.goods_id,guige.product_id)' v-else>{{guige.spec_value}}</li>
                                        </template>
                                        <li @click='choose_spec(proSpecDatas.goods_id,guige.product_id)' v-else>{{guige.spec_value}}</li>
                                    </template>
                                </ul>
                            </div>
                        </template>
                    </div>
                    <div class="s4">
                        <template v-if="proSpecDatas.canal === 'ziti'">
                            <el-button type="primary" disabled v-if="proSpecDatas.org_store<=0 && proSpecDatas.store<=0 ">暂时缺货</el-button>
                            <el-button type="primary" @click="addProSpecCart" v-else>确定</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" v-if="proSpecDatas.store>0" @click="addProSpecCart">确定</el-button>
                            <el-button type="primary" disabled v-else>暂时缺货</el-button>
                        </template>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import {goods_custom,search_goods,add_new} from '@/service/getData';

    export default{
        name:'orderSearch',
        data(){
            return{
                bval:'',
                addCartBtnStatus:false,
                proSpecDialogVisible:false,
                proSpecDatas:{},//多规格数据
                currentChooseProName:['',''],//当前选中的搜索产品名称
                searchCondition:[],//历史记录和定制单
                searchResults:[],//搜索结果
                tempProSpecNum:1//多规格当前选中规格的数量
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            ...mapActions([
                'addGoods'
            ]),
            async init(){//获取历史记录和定制单
                try {
                    const that = this;
                    const res = await goods_custom();
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
                    if(res.success){
                        this.searchCondition = res.success;
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async searchGoods(){//搜索产品
                if(!this.bval){
                    this.searchResults = [];
                    this.$message({
                        message: '请先输入产品型号或名称',
                        type: 'error'
                    });
                    return false;
                }
                try {
                    const that = this;
                    const res = await search_goods(this.bval);
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
                    if(res.success){
                        this.searchResults = res.success;
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            search(item,index){//历史记录或定制单搜索
                try {
                    if(this.currentChooseProName[index]){
                        return false;
                    }
                    const that = this;
                    this.$set(this.currentChooseProName,index,item);
                    this.bval = item;
                    this.searchGoods();
                    setTimeout(()=>{
                        that.$set(that.currentChooseProName,index,'');
                    },2000);
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async addCart(item){//加入购物车
                try {
                    if(item.is_spec === 'true'){//多规格
                        this.choose_spec(item.goods_id,item.product_id);
                        return false;
                    }
                    this.addGoods(Object.assign({},item));
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            async choose_spec(goods_id,product_id){//多规格切换
                try {
                    if(!product_id){
                        return false;
                    }
                    const res = await add_new(goods_id,product_id);
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
                    if(res.success && res.success.get_goods){
                        if(this.proSpecDatas && this.proSpecDatas.product_id){
                            this.tempProSpecNum = this.proSpecDatas.num;
                        }
                        this.proSpecDatas = res.success.get_goods;
                        if(this.proSpecDatas && this.proSpecDatas.canal === 'ziti'){
                            this.tempProSpecNum = this.tempProSpecNum > this.proSpecDatas.org_store ? this.proSpecDatas.org_store:this.tempProSpecNum;
                        }else{
                            this.tempProSpecNum = this.tempProSpecNum > this.proSpecDatas.store ? this.proSpecDatas.store:this.tempProSpecNum;
                        }
                        this.proSpecDatas.num = this.tempProSpecNum;
                        if(!this.proSpecDialogVisible){
                            this.proSpecDialogVisible = true;
                        }
                    }
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            addProSpecCart(){//多规格加入购物车
                try {
                    let tempProSpecDatas = Object.assign({},this.proSpecDatas);
                    delete tempProSpecDatas['send_type'];
                    delete tempProSpecDatas['spec'];
                    delete tempProSpecDatas['spec_desc'];
                    this.addGoods(tempProSpecDatas);
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.proSpecDialogVisible = false;
                }catch (e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            },
            closeProSpecDialog(){//关闭多规格弹框
                this.proSpecDatas = {};
                this.tempProSpecNum = 1;
            }
        }
    }
</script>
<style scoped>
    .orderSearch-container{
        height: 100%;
        background: #f4f4f4;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .orderSearch-container ul{
        overflow: hidden;
    }
    .search-form{
        padding: 20px 50px 10px;
        background: #fff;
        border-bottom: 1px solid #D6D7DC;
    }
    .search-input{
        width: 466px;
        padding-bottom: 12px;
    }
    .search-lists{
        overflow: hidden;
        color: #1876EF;
        line-height: 24px;
        position: relative;
        padding-left: 66px;
    }
    .search-lists p{
        position: absolute;
        left: 0;
        color: #919191;
    }
    .search-lists ul li{
        float: left;
        list-style-type: none;
        padding: 0 16px;
        background: #EAF3FE;
        border-radius: 10px;
        margin: 0 11px 20px 0;
        cursor: pointer;
    }
    .search-lists ul li.active{
        color: #F25406;
        background: #FFF6EE;
    }
    .search-results{
        padding: 10px 49px 25px;
        flex: 1;
        overflow: auto;
    }
    .search-results .search-item{
        list-style-type: none;
        background: #ffffff;
        padding: 15px 16px 20px;
        box-sizing: border-box;
        margin: 0 1px 2px;
    }
    .search-results .search-item .t1{
        width: 100%;
        height: 238px;
        position: relative;
        overflow: hidden;
        text-align: center;
    }
    .search-results img{
        width: 100%;
        max-width: 238px;
        height: 100%;
        display: block;
        margin: 0 auto;
    }
    .search-results .pro-guige{
        position: absolute;
        font-size: 14px;
        color: #F27B06;
        width: 14px;
        right: 11px;
        top:10px;
        text-align: center;
        line-height: 20px;
    }
    .search-results .pro-title{
        font-size: 14px;
        color: #1a1a1a;
        line-height: 22px;
        height: 44px;
        overflow: hidden;
    }
    .search-results .item1{
        display: flex;
        justify-content: space-between;
        line-height: 36px;
    }
    .search-results .pro-price{
        font-size: 16px;
        color: #1876EF;
    }
    .search-results .pro-status{
        color: #919191;
        line-height: 20px;
        margin-bottom: 16px;
        height: 20px;
    }
    .addCart{
        flex: 1;
        max-width: 140px;
        padding: 4px 5px;
        background: #fff;
        border: 1px solid #1876EF;
        color: #1876EF;
        border-radius: 12px;
        font-size: 14px;
        margin-left: 5px;
    }
    /*多规格弹框*/
    .spec-modal .spec-header{
        position: relative;
        height: 80px;
        padding-left: 94px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E0E0E0;
        padding-bottom: 20px;
    }
    .spec-modal .spec-img{
        position: absolute;
        width: 80px;
        height: 80px;
        left: 0;
        border: 1px solid #c5c5c5;
        text-align: center;
        overflow: hidden;
    }
    .spec-modal .s1{
        width: 100%;
    }
    .spec-modal .spec-title{
        font-size: 14px;
        color: #1a1a1a;
        line-height: 20px;
        max-height: 40px;
        overflow: hidden;
    }
    .spec-modal .spec-price{
        color: #1876EF;
        line-height: 22px;
    }
    .spec-modal .spec-status{
        color: #919191;
        font-size: 12px;
        line-height: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .spec-modal .spec-content{
        padding-top: 30px;
    }
    .spec-modal .s2{
        display: flex;
        margin-bottom: 25px;
    }
    .spec-modal .spec-store{
        margin-left: 20px;
        color: #1a1a1a;
    }
    .spec-modal .s3 .txt-1{
        color: #999999;
        margin: 15px 0 9px;
    }
    .spec-modal .s3 ul{
        overflow: hidden;
    }
    .spec-modal .s3 li{
        float: left;
        width: 200px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #CFCFCF;
        color: #4d4d4d;
        list-style-type: none;
        text-align: center;
        cursor: pointer;
        margin-bottom: 10px;
    }
    .spec-modal .s3 li:nth-child(2n){
        margin-left: 20px;
    }
    .spec-modal .imageItems li{
        width: 56px;
        height: 32px;
        padding: 5px;
        border: 1px solid #CFCFCF;
        box-sizing: border-box;
    }
    .spec-modal .imageItems li img{
        display: block;
        width: 100%;
        height: 100%;
    }
    .spec-modal .s3 li.active{
        color: #F25406;
        border-color: #F25406;
    }
    .spec-modal .s4{
        text-align: center;
        margin-top: 52px;
    }
    .spec-modal .s4 .el-button{
        width: 120px;
        border-radius: 6px;
    }
</style>