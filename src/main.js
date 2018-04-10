// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import ElementUI from 'element-ui'
import routes from './router'
import store from './store/'
import 'normalize.css/normalize.css'
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import './assets/css/index.css'
import './assets/css/designer.css'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
    routes
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
