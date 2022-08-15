import axiosLocale from '../../axios/request'
import axios from 'axios'
import {error} from '../../utils/error'

const TOKEN_KEY = 'jwt-token'
const UID = 'UID'
const ADMIN = 'ADMIN'

export default {
    namespaced: true,
    state() {
        return {
            token: localStorage.getItem(TOKEN_KEY),
            uid: localStorage.getItem(UID),
            admin: localStorage.getItem(ADMIN),
            lastUpdated: ''
        }
    },
    mutations: {
        setToken(state, token){
            state.token = token
            localStorage.setItem(TOKEN_KEY, token)
        },
        setLastUpdated(state, lastUpdated){
            state.lastUpdated = lastUpdated
            localStorage.setItem('lastUpdated', lastUpdated)
        },
        setUID(state, uid){
            state.uid = uid
            localStorage.setItem(UID, uid)
        },
        logout(state){
            state.token = null
            state.uid = null
            state.admin = false
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(UID)
            localStorage.removeItem(ADMIN)
        },
        admin(state, check){
            state.admin = check
            localStorage.setItem(ADMIN, check)
        }
    },
    actions: {
        async setUpdated({commit, getters}){
            const url = `https://time100.ru/api.php?type=ts`
            const {data} = await axios.get(url)
            const date = {lastUpdated: data}
            await axiosLocale.patch(`/users/${getters.uid}.json?auth=${getters.token}`, date)
            commit('setLastUpdated', data)
        },
        async login({commit, dispatch, getters}, payload){
            try{
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VUE_APP_FBKEY}`
                const {data} = await axios.post(url, {...payload, returnSecureToken: true})
                commit('setToken', data.idToken)
                commit('setUID', data.localId)
                await dispatch('setStatus', ['online', getters.uid])
                await dispatch('checkAdmin')
            }catch(e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async logout({commit, dispatch}){
            await dispatch('setStatus', ['offline', getters.uid])
            commit('logout')
            commit('user/clearInfo')
        },
        async register({commit, dispatch}, payload){
            await axiosLocale.post(`/unregistered.json`, payload )
        },
        async registerUser({getters, dispatch}, payload){
            try{
                const info = {email: payload.email, password: payload.password}
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.VUE_APP_FBKEY}`
                const {data} = await axios.post(url, {...info})
                const userID = data.localId
                const user = {
                    info: {name: payload.name, email: payload.email, photo: 'default.png'},
                    status: 'offline',
                    role: 'USER'
                }
                await axiosLocale.put(`/users/${userID}.json?auth=${getters.token}`, user)
                dispatch('refuseUser', payload.id)
                dispatch('toast', 'Новый пользователь успешно зарегистрирован', {root: true})

            }catch (e) {
                dispatch('toast', error(e.response.data.error.message)
                , {root: true})
            }
        },
        async refuseUser({getters, commit}, id){
            try {
                await axiosLocale.delete(`/unregistered/${id}.json?auth=${getters.token}`)
                commit('user/clearUnregisteredUsers', null, {root: true})
            }
            catch(e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async checkAdmin({getters, commit}){
            const test = await axiosLocale.get(`/users/${getters.uid}/role.json?auth=${getters.token}`)
            if (test.data === 'ADMIN') {
                commit('admin', true)
                return true
            }
            else if (test.data === 'USER') {
                commit('admin', false)
                return false
            }
        },
        async setStatus ({getters}, [payload, id]){
            let status = {status: payload}
            const {data} = await axiosLocale.patch(`/users/${id}.json?auth=${getters.token}`, status)
        },
        async forgetPassword({dispatch}, payload){
            try{
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=
                            ${process.env.VUE_APP_FBKEY}`
                const data = {requestType: "PASSWORD_RESET", email: payload.email}
                await axios.post(url, data)
                dispatch(
                    'setMessage',
                    'Вы успешно подали заявку на изменение пароля, подтвердите его по вашей почте',
                    {root: true})
            }
            catch(e){
                dispatch(
                    'setMessage',
                    error(e.response.data.error.message),
                    {root: true})
            }

        }
    },
    getters: {
        lastUpdated(state){
            return state.lastUpdated
        },
        token(state){
            return state.token
        },
        uid(state){
            return state.uid
        },
        isAuthenticated(_, getters){
            return getters.token && getters.uid ?  true : false
        },
        admin(state){
            console.log(state.admin)
          return state.admin
        }
    }
}