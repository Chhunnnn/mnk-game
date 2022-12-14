import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID,
    measurementId: process.env.VUE_APP_MEASUREMENT_ID
};
initializeApp(firebaseConfig);

createApp(App).use(store).use(router).mount('#app')