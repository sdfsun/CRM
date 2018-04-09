<template>
    <div class="basicInfo_container">
        <ul class="col_1">
            <li class="title">客户基本信息</li>
            <li>
                <span class="txt_1">姓名：</span>
                <span class="txt_2">陈奕迅/先生</span>
            </li>
            <li>
                <span class="txt_1">电话：</span>
                <span class="txt_2">150-1212-1212</span>
            </li>
            <li>
                <span class="txt_1">地址：</span>
                <span class="txt_2">福建省厦门市同安区某某镇xx街道xx社区xxxx小区</span>
            </li>
            <li>
                <span class="txt_1">QQ：</span>
                <span class="txt_2">123456789</span>
            </li>
            <li>
                <span class="txt_1">微信：</span>
                <span class="txt_2">xc12345678912</span>
            </li>
            <li>
                <span class="txt_1">邮箱：</span>
                <span class="txt_2">123456789@qq.com</span>
            </li>
        </ul>
        <ul class="col_2">
            <li class="title">客户装修信息</li>
            <li>
                <span class="txt_1">房屋类型：</span>
                <span class="txt_2">精装房/已交房</span>
            </li>
            <li>
                <span class="txt_1">户型：</span>
                <span class="txt_2">
                    普通住宅</br>
                    四房两厅 160㎡</br>
                    主卧/夫妻/中年</br>
                    儿童房/女孩/8岁</br>
                    儿童房/女孩/8岁
                </span>
            </li>
            <li>
                <span class="txt_1">预算：</span>
                <span class="txt_2">50w</span>
            </li>
            <li>
                <span class="txt_1">装修需求：</span>
                <span class="txt_2">全屋设计</span>
            </li>
            <li>
                <span class="txt_1">客户来源：</span>
                <span class="txt_2">今日头条</span>
            </li>
        </ul>
        <ul class="col_3">
            <li class="title"></li>
            <li>
                <span class="txt_1">是否装客：</span>
                <span class="txt_2">是</span>
            </li>
            <li>
                <span class="txt_1">归属设计师：</span>
                <span class="txt_2">张某某</span>
            </li>
            <li>
                <span class="txt_1">状        态：</span>
                <span class="txt_2">未联系</span>
            </li>
            <li>
                <span class="txt_1">是否预约：</span>
                <span class="txt_2">未预约</span>
            </li>
            <li>
                <span class="txt_1">客户备注：</span>
                <span class="txt_2">备注例如客户态度客户意向备注例如客户态度客户意向</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        name:'basicInfo'
    }
</script>
<style scoped>
    .basicInfo_container{
        display: flex;
        padding-top: 38px;
    }
    .basicInfo_container ul{
        flex: 1;
        font-size: 16px;
        line-height: 22px;
        color: #4D4D4D;
    }
    ul .title{
        font-size: 18px;
        color: #010101;
        margin-bottom: 28px;
        height: 22px;
    }
    ul li{
        list-style: none;
        margin-bottom: 17px;
        display: flex;
    }
    ul li .txt_1{
        color: #919191;
        text-align: right;
    }
    ul li .txt_2{
        flex: 1;
    }
    .col_1 .txt_1{
        width: 57px;
    }
    .col_2 .txt_1{
        width: 90px;
    }
    .col_3 .txt_1{
        width: 106px;
    }
</style>