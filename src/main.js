import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入 axios
import axios from 'axios'
// 配置根url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 全局挂载
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
