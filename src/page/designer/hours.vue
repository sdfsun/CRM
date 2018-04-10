<template>
    <div class="page_hours">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的日程" name="first">我的日程</el-tab-pane>
            <el-tab-pane label="所有日程" name="second">所有日程</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  export default {
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
  };
</script>