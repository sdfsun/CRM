<template>
    <div class="sidebar">
        <div class="side_header">
            张某某
        </div>
        <div class="side_menu">
            <el-menu
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active='$route.path'
                :default-openeds='openeds'
                router>
                <el-submenu index="1">
                    <template slot="title">
                        <span>客户管理</span>
                    </template>
                    <el-menu-item index="/custom">客户列表</el-menu-item>
                    <el-menu-item index="1-2">待联系列表</el-menu-item>
                    <el-menu-item index="1-3">已联系列表</el-menu-item>
                    <el-menu-item index="1-4">待分配列表</el-menu-item>
                    <el-menu-item index="1-5">待测量列表</el-menu-item>
                    <el-menu-item index="1-6">待上传方案列表</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <span>工时管理</span>
                    </template>
                    <el-menu-item index="/designer">设计师列表</el-menu-item>
                    <el-menu-item index="/designerHours">工时上报</el-menu-item>
                </el-submenu>
          </el-menu>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'sidebar',
        data () {
            return {
                openeds:['1']
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .sidebar{
        text-align: center;
    }
    .side_header{
        height: 90px;
        line-height: 90px;
        background-color: #1876EF;
        color: #fff;
        font-size: 22px;
    }

</style>
