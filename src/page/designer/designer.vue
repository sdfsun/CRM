<template>
    <div>
        <div class="designer_box" v-for="item in tableData">
            <div class="designer_hd">
                <div class="d_col">{{item.zubie}}</div>
                <div class="d_col">小组当月接尺数：<span>{{item.month_sum}}</span></div>
                <div class="d_col">小组总接尺数：<span>{{item.sum}}</span></div>
            </div>
            <el-table
                :data="item.designer"
                stripe
                style="width: 100%;text-align: center;"
                header-row-class-name='d_tale_hd'>
                <el-table-column
                    prop="name"
                    label="设计师"
                    >
                </el-table-column>
                <el-table-column
                    prop="login_account"
                    label="工号"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nums"
                    label="当月接尺数"
                    >
                </el-table-column>
                <el-table-column
                    prop="nums_count"
                    label="总接尺数"
                    >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getDesignerLists } from '@/service/getData';
export default{
    name:'home',
    data(){
        return{
            tableData: [],
            page:''
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init()
        })
    },
    methods: {
        async init(){
            try {
                let res = await getDesignerLists();
                if(res.error){
                    this.$message({
                        message: res.error,
                        type: 'error'
                    });
                    if(res.nologin === 1){//未登录
                        setTimeout(()=>{
                            this.$router.push('/');
                        },3000);
                    }
                }else{
                    let key;
                    for (key in res.success) {
                        this.$set(res.success[key],'zubie',key);
                        this.tableData.push(res.success[key]);
                    }
                }
            } catch(e) {
                this.$message({
                    showClose: true,
                    message: e.message,
                    type: 'error'
                });
            }
        }
    }
}
</script>
<style scoped>
.designer_box{padding:20px 0 30px;}
.designer_hd{padding-left:30px;}
.designer_hd .d_col{float:left;line-height:36px;padding-right:40px;font-size:14px;}
.designer_hd .d_col span{color:red;font-weight:bold;font-size:16px;}
</style>