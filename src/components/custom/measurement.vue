<template>
    <div class="measurement">
        <el-table
            :data="tableData"
            stripe
            style="width: 100%;text-align: center;"
            header-row-class-name='header_row_style'>
            <el-table-column
                prop="name"
                label="测量次数"
                >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="测量人"
                >
            </el-table-column>
            <el-table-column
                prop="method"
                label="测量时间/起止"
                width='260'>
            </el-table-column>
            <el-table-column
                prop="address"
                label="量尺图片"
                width='400'>
            </el-table-column>
            <el-table-column
                prop="type"
                label="量尺信息">
            </el-table-column>
            <el-table-column
                prop="house_type"
                label="信息回馈">
            </el-table-column>
        </el-table>
        <div class="btns">
            <el-button type="primary" icon='el-icon-plus' class='add_custom'>新建测量记录</el-button>
            <el-button type="primary"  class='add_custom'>编辑</el-button>
        </div>
    </div>
</template>
<script>
    export default{
        name:'measurement',
        data(){
            return{
                tableData: [
                    {
                        name: '1',
                        phone: '电话',
                        method:'2018/3/21 13:00-13:21',
                        address: '2018/3/21 13:00-14:00',
                        type:'2018/3/21 13:00-14:00',
                        house_type:'沟通概要，客户要求沟通概要，客户要求沟通概要，客户要求沟通概要，客户要求'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅'
                    },
                    {
                        name: '陈奕迅',
                        phone: '15012121212',
                        method:'QQ:123456789/微信：123412...',
                        address: '福建省厦门市同安区一二三四镇一二三四村',
                        type:'毛坯房/已交房',
                        house_type:'四房两厅'
                    }
                ]
            }
        }
    }
</script>
<style scoped>
    
</style>