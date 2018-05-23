<template>
    <div>
        <el-table
            :data="tableData"
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
                label="已接尺数"
                >
            </el-table-column>
        </el-table>
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
                    this.tableData = res.success
                    // this.page = res.success.length
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