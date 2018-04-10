<template>
    <div class="custom">
        <section class="custom_header_form">
            <el-button type="button" icon='el-icon-plus' class='add_custom'>新建客户信息</el-button>
            <el-form ref="form" :model="form" :inline="true"  class='search_form'>
                <el-form-item class='search_form_item'>
                    <el-input v-model="form.name" placeholder="搜索客户信息" class='search_input'></el-input>
                    <el-button type="button" class='search_btn'>搜索</el-button>
                </el-form-item>
                <div class="form_select_right">
                    <el-form-item>
                        <el-select v-model="form.user_intention" placeholder="用户意向">
                            <el-option
                                v-for="item in user_intention"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.time" placeholder="时间">
                            <el-option
                                v-for="item in time"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="button" class='edit_btn'>编辑</el-button>
                </div>
            </el-form>
        </section>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%;text-align: center;"
            header-row-class-name='header_row_style'>
            <el-table-column
                prop="name"
                label="客户"
                >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话"
                >
            </el-table-column>
            <el-table-column
                prop="method"
                label="QQ/微信"
                width='260'>
            </el-table-column>
            <el-table-column
                prop="address"
                label="装修地址"
                width='400'>
            </el-table-column>
            <el-table-column
                prop="type"
                label="房屋类型">
            </el-table-column>
            <el-table-column
                prop="house_type"
                label="户型">
            </el-table-column>
            <el-table-column
                prop="resource"
                label="客户来源">
            </el-table-column>
        </el-table>
        <el-tabs type="border-card" class='el_tabs_footer'>
            <el-tab-pane label="消息中心">消息中心</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    export default{
        name:'custom',
        data(){
            return{
                form: {
                    name: '',
                    user_intention:'',
                    time:''
                },
                user_intention: [
                    {
                        value: '有意',
                        label: '有意'
                    },
                    {
                        value: '无意',
                        label: '无意'
                    },
                    {
                        value: '可再联系',
                        label: '可再联系'
                    }
                ],
                time: [
                    {
                        value: '近三天',
                        label: '近三天'
                    },
                    {
                        value: '近一周',
                        label: '近一周'
                    },
                    {
                        value: '近两周',
                        label: '近两周'
                    },
                    {
                        value: '近一个月',
                        label: '近一个月'
                    }
                ],
                tableData: [
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅',
                        resource:'今日头条'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅',
                        resource:'今日头条'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅',
                        resource:'今日头条'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅',
                        resource:'今日头条'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅',
                        resource:'今日头条'
                    }
                ]
            }
        }
    }
</script>
<style scoped>
    .custom{
        height: 100%;
        position: relative;
    }
    .custom_header_form{
        padding: 18px 22px 0 41px;
    }
    .add_custom{
        width: 200px;
        height: 48px;
        border-radius: 0;
        background-color: #1876EF;
        color: #fff;
        /*font-size: 20px;*/
    }
    .search_form{
        margin-top: 19px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .search_form_item{
        flex: 1;
        
    }
    .search_input{
        flex: 1;
        height: 48px;
        margin-right: 11px;
    }
    .search_btn,.edit_btn{
        background-color: #1876EF;
        color: #fff;
        width: 90px;
        height: 48px;
        /*font-size: 20px;*/
        border-radius: 0;
    }
    .edit_btn{
        width: 80px;
        height: 40px;
        /*font-size: 16px;*/
    }
    .el-select{
        width: 160px;
        border-radius: 0;
    }
    .el-select .el-input__inner{
        border-radius: 0;
    }
    /*底部切换栏*/
    .el_tabs_footer{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>