import axios from '../../axios/request'
import store from '../index'
import {error} from '../../utils/error'
import firebase from 'firebase/app'

export default {
    namespaced: true,
    state() {
        return {
            requests: []
        }
    },
    mutations: {
        setRequests(state, requests) {
            state.requests = requests
        },
        addRequest(state, request){
            state.requests.push(request)
        },
        clearRequest(state){
            state.requests = []
        }
    },
    actions: {
        async create({commit, dispatch}, [payload, fieldName]){
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.post(`/${fieldName}.json?auth=${token}`, payload)
                commit('addRequest', {...payload})
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async load({commit, dispatch}, fieldName){
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.get(`/${fieldName}.json?auth=${token}`)
                const requests = Object.keys(data).map(id => ({...data[id], id}))
                commit('setRequests', requests)
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.message)
                }, {root: true})
            }
        },
        async loadOne({commit, dispatch}, [fieldName, id]){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                const {data} = await axios.get(`/${fieldName}/${id}.json?auth=${token}`)
                if (data.fileNameContract)
                    await dispatch('downloadOneFile', [id, data, 'fileNameContract', 'contract'])
                if (data.fileNameRoom)
                    await dispatch('downloadOneFile', [id, data, 'fileNameRoom', 'room'])
                return data
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async downloadOneFile({}, [id, data, name, folderName]){
            const storage = firebase.storage()
            const ref = storage.ref(`contracts/${id}/${folderName}/${data[name]}`)
            const urlFile = 'url' + name
            await ref.getDownloadURL().then(url => data.[urlFile] = url)
        },
        async change({commit}, [payload, fieldName, id]){
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.patch(`/${fieldName}/${id}.json?auth=${token}`, payload)
                commit('addRequest', {...payload})
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async remove({dispatch, commit}, [fieldName, id]){
            try {
                const token = store.getters['auth/token']
                await axios.delete(`/${fieldName}/${id}.json?auth=${token}`)
                commit('clearRequest')
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async addContract({dispatch}, [id, file, folder, fieldName]){
            const storage = firebase.storage()
            const ref = storage.ref(`contracts/${id}/${folder}/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot =>{
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
                e => console.log(error(e)),
                    () => task.snapshot.ref.getDownloadURL()
                        .then(url => {
                            dispatch('fixName', [id, file.name, folder, fieldName])
                        })
                )
            },
        async fixName ({}, [id, name, folder, fieldName]){
            const token = store.getters['auth/token']
            const fileName = {
                [fieldName]: name
            }
            console.log(`FileName: ${fileName}`)
            await axios.patch(`/meet/${id}.json?auth=${token}`, fileName)
        }
    },
    getters: {
        requests(state){
            return state.requests
        }
    }
}