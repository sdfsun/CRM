<template>
    <el-container>
        <el-aside width="auto" min-width='180px'>
            <sidebar></sidebar>
        </el-aside>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>
<script>
    import sidebar from '@/components/common/sidebar'
    export default{
        name:'home',
        components:{
            sidebar
        }
    }
</script>
<style scoped>
    .el-container{
        height: 100%;
    }
    .el-main{
        text-align: left;
        padding: 0;
    }
    .el-aside{
        background-color: #2C3031;
    }
</style>