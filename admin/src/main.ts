import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import 'element-plus/dist/index.css'
import '@/styles/variables.css'
import '@/styles/element-override.css'
import '@/style.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
