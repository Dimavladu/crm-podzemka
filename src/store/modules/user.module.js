import axios from '../../axios/request'
import taxios from 'axios'
import store from '../index'
import {error} from '../../utils/error'
import firebase from 'firebase'
import {getCurrentTime} from '../../use/check-last-visit'

export default {
    namespaced: true,
    state() {
        return {
            userInfo: {},
            unregisteredUsers: [],
            users: [],
            usersPhoto: [],
            photoCount: 0
        }
    },
    mutations: {
        setInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        addInfo(state, info){
            state.userInfo = state.userInfo + info
        },
        clearInfo(){
            state.userInfo = {}
        },
        setUnregisteredUsers(state, users){
            state.unregisteredUsers = users
        },
        clearUnregisteredUsers(state){
            state.unregisteredUsers = {}
        },
        setUsersInfo(state, users) {
            state.users = users
        },
        clearUsersInfo(state){
            state.users = []
        },
        addUsersPhoto(state, photo) {
            state.usersPhoto[photo.id] = photo.url
            state.photoCount += 1
        },
        clearUsersPhoto(state){
            state.usersPhoto = []
            state.photoCount = 0
        }
    },
    actions: {
        async setUserInfo({commit, dispatch}, payload){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                const {data} = await axios.put(`/users/${uid}/info.json?auth=${token}`, payload)
                commit('setInfo', {...payload})
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async updateStatus({}, [id, status]){
            const token = store.getters['auth/token']
            const userStatus = {'status': status}
            const {data} = await axios.patch(`/users/${id}.json?auth=${token}`, userStatus)
            console.log(data)
        },
        async loadUserInfo({commit, dispatch}){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']

                let {data} = await axios.get(`/users/${uid}/info.json?auth=${token}`)

                commit('setInfo', data)
                return data
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async loadUserInfoById({dispatch}, id){
            const token = store.getters['auth/token']
            const {data} = await axios.get(`/users/${id}.json?auth=${token}`)
            data.id = id
            return data
        },
        async loadAllUserInfo({commit, dispatch}, id){
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.get(`/users/${id}.json?auth=${token}`)
                // const ref = await firebase.database().ref('users/' + id + `/info`)
                // await ref.on('value', async snapshot =>{
                //     const data = await snapshot.val()
                //     return user
                // })
                const user = await dispatch('loadPhoto', [data, id])
                return user
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async loadPhoto({commit, dispatch}, [user, id]){
            try{
                const storage = firebase.storage()
                let ref = ''
                if (user.info.photo === 'default.png') ref = storage.ref(`users/default.png`)
                else ref = storage.ref(`users/${id}/${user.info.photo}`)

                await ref.getDownloadURL().then(url => user.url = url)
                return user
            }catch(e){
                console.log(e)
            }
        },
        async cicleUsers({commit, dispatch}, users){
            await users.forEach(async user =>{
                user = await dispatch('loadPhoto', [user, user.id])
                const photo = {id: user.id, url: user.url}
                commit('addUsersPhoto', photo)
                if (user.lastUpdated && user.status === 'online') {
                    const time = (store.getters['auth/lastUpdated'] - user.lastUpdated)/(1000*60)
                    if (time > 10){
                        await dispatch('updateStatus', [user.id, 'offline'])
                        user.status = 'offline'
                        console.log('lol')
                    }
                }
            })
            return users
        },
        async getUsersInfo({commit, dispatch}){
            try{
                commit('clearUsersInfo')
                commit('clearUsersPhoto')
                const token = store.getters['auth/token']

                const {data} = await axios.get(`/users.json?auth=${token}`)

                let users = Object.keys(data).map(id => ({...data[id], id}))
                users = await dispatch('cicleUsers', users)
                commit('setUsersInfo', users)
                return users

            }catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async loadUnregisteredUsers({dispatch, commit}){
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.get(`/unregistered.json?auth=${token}`)
                const request = Object.keys(data).map(id => ({...data[id], id}))
                commit('setUnregisteredUsers', request)
                return request
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.message)
                }, {root: true})
            }
        },
        async changeRole({}, [id, role]){
            const token = store.getters['auth/token']
            await axios.patch(`users/${id}.json?auth=${token}`, role)
        },
        async addPhoto ({}, [id, file]){
            const token = store.getters['auth/token']
            const uid = store.getters['auth/uid']

            const storage = firebase.storage()
            const ref = storage.ref(`users/${uid}/${file.name}`)
            const task = ref.put(file)

            await axios.patch(`/users/${uid}/info.json?auth=${token}`, {photo: file.name})
        },
        async deleteUser({}, id){
            try{
                const uid = store.getters['auth/uid']
                const token = store.getters['auth/token']
                const refresh = store.getters['auth/refreshToken']
                // console.log(refresh)
                // const urlRefresh = `https://securetoken.googleapis.com/v1/token?key=${process.env.VUE_APP_FBKEY}`
                // const urlInfo = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.VUE_APP_FBKEY}`
                // const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.VUE_APP_FBKEY}`
                // const testUrl = `'https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount'`
                // const {req} = await axios.post(urlRefresh, {grant_type: 'refresh_token', refresh_token: refresh})
                const idToken = {localId: id}
                // const {req} = await taxios.post(authUrl, idToken)
                await axios.delete(`/users/${id}.json?auth=${token}`)
                console.log(req)
            }catch (e) {
                console.log(e)
            }

        }
    },
    getters: {
        userInfo(state){
            return state.userInfo
        },
        usersListWithoutYou(state){
            return state.users.filter(user => user.id !== store.getters['auth/uid'])
        }
    }
}