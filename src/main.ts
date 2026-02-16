import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import routes from './routes'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura';

const pinia = createPinia()
const app = createApp(App)


app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'dark',
            cssLayer: false
        }
    }
 });

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(routes)
app.use(VueQueryPlugin)
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
})
app.mount('#app')