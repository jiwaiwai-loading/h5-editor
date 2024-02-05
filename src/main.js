import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/stores/store'
import { useUserStore } from '@/stores/user';
import router from '@/router'
import i18n from '@/config/lang'
import utils from '@/assets/js/utils.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/css/main.css'
import '@/assets/css/theme.css'
import '@/assets/css/animate.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

const userStore = useUserStore(pinia)
const user = utils.getUser()
if (utils.isDefine(user)) {
    userStore.user = user;
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(i18n).use(router).mount('#app')
