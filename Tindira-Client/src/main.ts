import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'

// Ignore error because '@/Presets/Lara/index.js' lacks type definitions.
// @ts-ignore
import Lara from '@/Presets/Lara/index.js'

const app = createApp(App)

app.use(PrimeVue, { unstyled: true, pt: Lara })

app.use(createPinia())
app.use(router)

app.mount('#app')
