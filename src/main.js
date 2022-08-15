import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'
import VCalendar from 'v-calendar'
import Toast, {POSITION, TYPE} from 'vue-toastification'
import "vue-toastification/dist/index.css"
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

firebase.initializeApp({
    apiKey: process.env.VUE_APP_FBKEY,
    authDomain: process.env.VUE_APP_AUTH,
    databaseURL: process.env.VUE_APP_FBURL,
    projectId: process.env.VUE_APP_PRJID,
    storageBucket: process.env.VUE_APP_STORAGE,
    messagingSenderId: process.env.VUE_APP_SENDER,
    appId: process.env.VUE_APP_APPID
})


let app
const options = {
    position: POSITION.BOTTOM_RIGHT,
    timeout: false
}
firebase.auth().onAuthStateChanged(()=>{
    if(!app){

        app = createApp(App)
            .use(store)
            .use(router)
            .use('moment')
            .use(VCalendar, {})
            .use(Toast, options)
            .mount('#app')
    }
})


