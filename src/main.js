import { createApp } from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'

const app = createApp(App)
// 全局注册路由
app.use(router)

app.mount('#app')