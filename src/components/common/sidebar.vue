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
                <template v-for="(item, index) in menus">
                    <el-submenu :index="index+1+''">
                        <template slot="title">
                            <span>{{item.title}}</span>
                        </template>
                        <template v-for="itm in item.menus">
                            <el-menu-item :index="itm.path">{{itm.name}}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
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
                'memberRoleId',
                'menus'
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
        min-height: 100%;
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
