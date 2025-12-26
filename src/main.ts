import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import routes from './routes'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(routes)
app.use(VueQueryPlugin)
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
})
app.mount('#app')