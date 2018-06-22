<template>
    <div class="notFound-container">
        <a href="javascript:void(0);" class="go-back" @click='goBackHandle'></a>
    </div>
</template>
<script>
    export default {
        name: 'notFound',
        methods:{
            goBackHandle(){
                this.$router.push('/');
            }
        }
    }
</script>
<style scoped>
    .notFound-container{
        width: 482px;
        height: 438px;
        background: url('../../assets/img/404.png') center center no-repeat;
        background-size: cover;
        margin: 0 auto;
        position: relative;
    }
    .go-back{
        position: absolute;
        width: 112px;
        height: 86px;
        bottom: 0;
        left: 50%;
        margin-left: -56px;
    }
</style>