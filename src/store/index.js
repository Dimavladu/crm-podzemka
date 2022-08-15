import { createStore, createLogger } from 'vuex'
import auth from './modules/login.modules'
import request from './modules/request.module'
import client from './modules/client.module'
import task from './modules/task.module'
import user from './modules/user.module'

const plugins = []

if (process.env.NODE_ENV === 'development'){
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state(){
    return{
      message: null
    }
  },
  mutations: {
    setMessage(state, message){
      state.message = message
    },
    clearMessage(state){
      state.message = null
    }
  },
  actions: {
    setMessage({commit}, message) {
      commit('setMessage', message)
      // console.log(message)
      setTimeout(()=> {
        commit('clearMessage')
      }, 5000)
    },
    toast({}, text){
      M.toast({html: text})
    }
  },
  modules: {
    auth, request, client, task, user
  }
})
