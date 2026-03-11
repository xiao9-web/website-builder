import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI)

// 配置axios
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
}, error => {
  NProgress.done()
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(response => {
  NProgress.done()
  return response.data
}, error => {
  NProgress.done()
  ElementUI.Message.error('网络请求失败，请稍后重试')
  return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
