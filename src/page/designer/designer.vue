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
        </el-table>
        <div class="page_fenye" v-if="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="page">
            </el-pagination>
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
                }else{
                    this.tableData = res.success
                    this.page = res.success.length
                }
            } catch(e) {
                this.$message({
                    showClose: true,
                    message: e,
                    type: 'error'
                });
            }
        }
    }
}
</script>
<style scoped>
    .page_fenye{text-align:center;padding:50px 0 30px;position:relative;}
</style>