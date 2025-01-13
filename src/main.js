
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Chart from 'chart.js/auto'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')