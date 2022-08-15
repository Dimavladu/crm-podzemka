import axios from '../../axios/request'
import store from '../index'
import {error} from '../../utils/error'
import {useDateFormat} from '../../use/date-format'
import firebase from 'firebase/app'

export default {
    namespaced: true,
    state() {
        return {
            tasks: [],
            tasksLength: 0,
            workerTasks: [],
            mainTasks: [],
        }
    },
    mutations: {
        clear(state){
            state.tasksLength = 0
            state.tasks = []
            state.workerTasks = []
            state.mainTasks = []
        },
        setTasks(state, tasks) {
            state.tasks = tasks
        },
        addTask(state, task) {
            state.tasks.push(task)
        },
        setTasksLength(state){
            state.tasksLength =
                state.tasks?.length +
                state.mainTasks?.length +
                state.workerTasks?.length
        },
        addTasksLength(state, length){
            state.tasksLength += length
        },
        clearTasksLength(state){
            state.tasksLength = 0
        },
        clearTasks(state){
            state.tasks = []
        },

        setMainTasks(state, tasks){
            state.mainTasks = tasks
        },
        addMainTask(state, task) {
            state.mainTasks.push(task)
        },
        clearMainTasks(state, tasks){
            state.mainTasks = []
        },

        setWorkerTasks(state, tasks){
            state.workerTasks = tasks
        },
        addWorkerTask(state, task) {
            state.workerTasks.push(task)
        },
        clearWorkerTasks(state, tasks){
            state.workerTasks = []
        },
    },
    actions: {
        async createSelfTask({commit, dispatch}, payload){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                await axios.post(`/users/${uid}/tasks/self.json?auth=${token}`, payload)
                commit('addTask', {...payload})
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async createMainTask({commit, dispatch, getters}, payload){
            try{
                const uid = store.getters['auth/uid']
                const token = store.getters['auth/token']
                payload.role = 'main'
                const {data} = await axios.post(`/users/${uid}/tasks/main.json?auth=${token}`, payload)
                commit('addMainTask', {...payload})
                await payload.staff.forEach(async id => {
                    await dispatch('createWorkerTask', [payload, id, data.name])
                })
            } catch (e){
                console.log(e)
            }
        },
        async createWorkerTask({getters, commit}, [payload, id, name]){
            try{
                const token = store.getters['auth/token']
                payload.role = 'worker'
                await axios.put(`/users/${id}/tasks/worker/${name}.json?auth=${token}`, payload)
            } catch (e){
                console.log(e)
            }
        },
        async updateOtherTask({}, [payload, id, name, type]){
            try{
                const token = store.getters['auth/token']
                await axios.patch(`/users/${id}/tasks/${type}${name}.json?auth=${token}`, payload)

            } catch (e){
                console.log(e)
            }
        },
        async removeMainTask({dispatch}, [payload, taskID]){
            try{
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                await axios.delete(`/users/${uid}/tasks/main/${taskID}.json?auth=${token}`, payload)
                await payload.staff.forEach(async id =>{
                    await dispatch('removeWorkerTask', [id, taskID])
                })
            } catch (e){

            }
        },
        async removeWorkerTask({}, [id, taskId]){
            try{
                const token = store.getters['auth/token']
                await axios.delete(`/users/${id}/tasks/worker/${taskId}.json?auth=${token}`)
            } catch (e){

            }
        },
        async loadTask({commit, dispatch}, [id, type]){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                const {data} = await axios.get(`/users/${uid}/tasks/${type}${id}.json?auth=${token}`)
                const task = useDateFormat(data)
                return task
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.message)
                }, {root: true})
            }
        },
        async addComment({dispatch}, [workersId, name, text, taskId, mainId]){
            try{
                const token = store.getters['auth/token']
                const payload = {
                    name: name,
                    text: text
                }
                workersId.forEach(async id =>{
                    await axios.post(`/users/${id}/tasks/worker/${taskId}/comments/.json?auth=${token}`, payload)
                })
                await axios.post(`/users/${mainId}/tasks/main/${taskId}/comments/.json?auth=${token}`, payload)
            }catch (e){
                console.log(e)
            }
        },
        async addPhoto({dispatch}, [id, file, name, staff, main]){
            const token = store.getters['auth/token']
            const storage = firebase.storage()
            const ref = storage.ref(`tasks/${id}/${file.name}`)
            const task = ref.put(file)
            await task.on('state_changed', async snapshot =>{
                    const percentage = await (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                },
                e => console.log(error(e)),
                async () => await task.snapshot.ref.getDownloadURL()
                    .then(async url => {
                        await axios.post(`users/${main}/tasks/main/${id}/comments.json?auth=${token}`, {name: name, url: url})
                        await staff.forEach(async userId =>{
                            await axios.post(`users/${userId}/tasks/worker/${id}/comments.json?auth=${token}`, {name: name, url: url})
                        })
                    })
            )
        },
        async loadTasks({state, commit, dispatch}, id){
            try {
                commit('clear')
                const token = store.getters['auth/token']
                const {data} = await axios.get(`/users/${id}/tasks.json?auth=${token}`)

                if (data?.self) dispatch('toObject', [data.self, 'setTasks'])
                if (data?.main) dispatch('toObject', [data.main, 'setMainTasks'])
                if (data?.worker) dispatch('toObject', [data.worker, 'setWorkerTasks'])
                commit('setTasksLength')
            } catch (e){
                console.log(e)
            }
        },
        toObject({commit},[data, commitName]){
            try{
                let tasks = Object.keys(data)
                    .map(id => ({...data[id], id}))
                    .filter(task => useDateFormat(task))
                commit(commitName, tasks)
            }catch (e) {
                console.log(e)
            }
        },
        async endTask({commit}, [payload, id]){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                const {data} = await axios.patch(`/users/${uid}/tasks/${id}.json?auth=${token}`, payload)
                commit('addTask', {...payload})
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },
        async removeTask({dispatch}, id){
            try {
                const token = store.getters['auth/token']
                const uid = store.getters['auth/uid']
                await axios.delete(`/users/${uid}/tasks/self/${id}.json?auth=${token}`)
            } catch (e){
                dispatch('setMessage', {
                    value: error(e.response.data.error.message)
                }, {root: true})
            }
        },

    },
    getters: {
        tasks(state){
            return state.tasks
        },
    }
}