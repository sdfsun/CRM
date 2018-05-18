<template>
    <div class="sidebar">
        <div class="side_header">
            {{memberRoleId.name}}<small class="roleName">{{memberRoleId.role_name}}</small>
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
                    <el-menu-item index="/custom/0">客户列表</el-menu-item>
                    <template v-if='memberRoleId.member_role_id !== "designer"'>
                        <el-menu-item index="/custom/1">待联系列表</el-menu-item>
                        <el-menu-item index="/custom/2">需再联系列表</el-menu-item>
                    </template>
                    <el-menu-item index="/custom/reception">我沟通的客户</el-menu-item>
                    <el-menu-item index="/custom/3">待分配列表</el-menu-item>
                    <el-menu-item index="/custom/4">待测量列表</el-menu-item>
                    <el-menu-item index="/custom/5">待上传方案列表</el-menu-item>
                </el-submenu>
                <el-submenu index="2" v-if='memberRoleId.member_role_id !== "service" && memberRoleId.member_role_id !== "guide"'>
                    <template slot="title">
                        <span>工时管理</span>
                    </template>
                    <el-menu-item index="/designer">设计师列表</el-menu-item>
                    <el-menu-item index="/hours">工时上报</el-menu-item>
                </el-submenu>
                <el-submenu index="3" v-if='memberRoleId.member_role_id !== "designer"'>
                    <template slot="title">
                        <span>基本配置</span>
                    </template>
                    <el-menu-item index="/source">渠道来源管理</el-menu-item>
                    <el-menu-item index="/activity">活动管理</el-menu-item>
                </el-submenu>
                <el-submenu index="4" v-if='memberRoleId.member_role_id === "super"'>
                    <template slot="title">
                        <span>系统管理</span>
                    </template>
                    <el-menu-item index="/role">角色管理</el-menu-item>
                    <el-menu-item index="/user">用户列表</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                        <span>操作员管理</span>
                    </template>
                    <el-menu-item index="/updatePasd">修改密码</el-menu-item>
                </el-submenu>
          </el-menu>
        </div>
        <div class="footer-btns">
            <a href="javascript:void(0);" @click='logout'>退出</a>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import {unset_member} from '@/service/getData';

    export default {
        name: 'sidebar',
        data () {
            return {
                openeds:['1']
            }
        },
        computed:{
            ...mapState([
                'memberRoleId'
            ])
        },
        methods:{
            async logout(){//退出用户
                try {
                    const res  = await unset_member();
                    if(res.success){
                        this.$message({
                            message:res.success,
                            type:'success'
                           });
                        setTimeout(()=>{
                            this.$router.push('/');
                        },3000);
                    }
                } catch(e) {
                    this.$message({
                        message: e.message,
                        type: 'error'
                    });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .sidebar{
        width: 100%;
        text-align: center;
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .side_menu{
        flex: 1;
    }
    .footer-btns{
        padding: 40px 30px;
        position: relative;
    }
    .footer-btns a{
        text-decoration: none;
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        display: block;
        width: 60px;
        height: 20px;
        background: url('../../assets/img/logout.png') 0 center no-repeat;
        background-size: 20px 20px;
        padding-left: 20px;
        box-sizing: border-box;
        position: absolute;
        right: 30px;
        bottom: 30px;
    }
    .side_header{
        height: 80px;
        background-color: #1876EF;
        color: #fff;
        font-size: 18px;
        line-height: 26px;
        padding-top: 15px;
        box-sizing: border-box;
        font-weight: bold;
    }
    .side_header small{
        font-size: 14px;
        display: block;
        font-weight: normal;
    }
</style>
