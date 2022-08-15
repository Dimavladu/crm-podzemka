import axios from '../../axios/request'
import store from '../index'

export default {
    namespaced: true,
    state() {
        return {
            clients: []
        }
    },
    mutations: {
        setRequests(state, clients) {
            state.clients = clients
        },
        addRequest(state, client) {
            state.clients.push(client)
        }
    },
    actions: {
        async create({ dispatch}, payload) {
            try {
                const token = store.getters['auth/token']
                const {data} = await axios.post(`/clients.json?auth=${token}`, ...payload)
                dispatch('setMessage', {
                    value: 'Успешно',
                    type: 'primary'
                }, {root: true})
            } catch (e) {
                dispatch('setMessage', {
                    value: e.message,
                    type: 'danger'
                }, {root: true})
            }
        }
    }
}