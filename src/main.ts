import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import routes from './routes'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(routes)
app.use(VueQueryPlugin)
app.mount('#app')