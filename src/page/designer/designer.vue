<template>
    <div>
        <el-row class="d_hd">
            <el-col :span="21">
                <el-carousel :autoplay="false" arrow="never" ref="carousel">
                    <el-carousel-item v-for="(item,index) in list" :key="index">
                        <el-row  class="d_list">
                            <el-col :span="3" v-for="child in item" :key="item.name">
                                <img class="d_touxiang" :src="child.img">
                                <h3>{{child.name}}</h3>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :span="3">
                <img class="d_add" src="https://pic.solux.cn/PC/crm/d_add.png">
            </el-col>
            <div class="arrow_list">
               <a href="javascript:;" @click="prev()"><i class="el-icon-arrow-left"></i></a>
               <a href="javascript:;"  @click="next()"><i class="el-icon-arrow-right"></i></a>
           </div>
       </el-row>

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
                prop="marks"
                label="标注"
                >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号"
                >
            </el-table-column>
            <el-table-column
                prop="plan"
                label="日程"
                width='260'>
            </el-table-column>
            <el-table-column
                prop="time"
                label="时间">
            </el-table-column>
            <el-table-column
                prop="msg"
                label="投诉建议">
            </el-table-column>
        </el-table>
        <div class="page_fenye">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100">
            </el-pagination>

            <div class="d_data">
                <el-date-picker
                  v-model="value7"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
                <el-button type="primary">筛选</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import sidebar from '@/components/common/sidebar'
    export default{
        name:'home',
        data(){
            return{
                list:[[{
                    name:"马卡",
                    img:"https://pic.solux.cn/image/d1/3e/2f/e9eec6dbc69066962182076168.jpg"
                },
                {
                    name:"马云",
                    img:"https://pic.solux.cn/image/af/de/38/5d8e2749452eb7b261a17def96.jpg"
                },
                {
                    name:"骂骂",
                    img:"https://pic.solux.cn/image/d1/3e/2f/e9eec6dbc69066962182076168.jpg"
                },
                {
                    name:"马卡",
                    img:"https://pic.solux.cn/image/d1/3e/2f/e9eec6dbc69066962182076168.jpg"
                },
                {
                    name:"马云",
                    img:"https://pic.solux.cn/image/af/de/38/5d8e2749452eb7b261a17def96.jpg"
                },
                {
                    name:"骂骂",
                    img:"https://pic.solux.cn/image/d1/3e/2f/e9eec6dbc69066962182076168.jpg"
                },
                {
                    name:"马卡",
                    img:"https://pic.solux.cn/image/d1/3e/2f/e9eec6dbc69066962182076168.jpg"
                },
                {
                    name:"马云",
                    img:"https://pic.solux.cn/image/af/de/38/5d8e2749452eb7b261a17def96.jpg"
                }],[{
                    name:"马卡",
                    img:"https://pic.solux.cn/image/7e/a2/6e/62cc98f0dee1262b8d45f6863a.jpg"
                },
                {
                    name:"马云",
                    img:"https://pic.solux.cn/image/af/de/38/5d8e2749452eb7b261a17def96.jpg"
                },
                {
                    name:"骂骂",
                    img:"https://pic.solux.cn/image/19/08/54/3119d875fe875a088f20f919ce.jpg"
                }]],
                tableData: [
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    },
                    {
                        name: '陈奕迅',
                        marks: "室内设计",
                        phone: '15012121212',
                        plan:'上门量房',
                        time: '2018/04/02',
                        msg:'/'
                    }
                ],
                pickerOptions2: {
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
                },
                value7: ''
            }
        },
        components:{
            sidebar
        },
        methods: {
            prev() {
                this.$refs.carousel.prev();
            },
            next() {
                this.$refs.carousel.next();
            }
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
    .d_hd{padding:0 20px;}
    .d_list{margin-top: 92px;}
    .el-col{text-align:center;}
    .d_touxiang{width:66%;height:66%;border-radius:50%;min-width:60px;min-height:60px;max-width:110px;max-height:110px;}
    .d_add{width:66%;height:66%;border-radius:50%;min-width:60px;min-height:60px;max-width:110px;max-height:110px;margin:0 auto;margin-top:92px;cursor:pointer;}
    .arrow_list{position:absolute;top:40px;right:4%;}
    .arrow_list a{background:#CFCFCF;color:#fff;padding:4px 10px;}
    .arrow_list a:hover{background:#1876EF;}
    .page_fenye{text-align:center;padding:50px 0 30px;position:relative;}
    .d_data{position:absolute;bottom:30px;right:4%;}
</style>