import axios from 'axios'
import router from '../router'

const requestAxios = axios.create({
    baseURL: process.env.VUE_APP_FBURL
})

requestAxios.interceptors.response.use(null, error =>{
    if(error.response.status === 401){
        router.push('/login?message=auth')
    }
})

export default requestAxios

