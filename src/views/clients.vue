<template>
  <div>
    <div class="page-title">
      <h3>Клиенты</h3>
    </div>
    <loader v-if="loading"></loader>
    <app-client v-else :clients="clients"></app-client>

  </div>
</template>
<script>
import {ref, onMounted, computed} from 'vue'
import AppClient from '../components/client/AppClient'
import Loader from '../components/ui/Loader'
import {useStore} from 'vuex'

export default {
  setup(){
    const store = useStore()

    const loading = ref(false)
    onMounted( async () =>{
      loading.value = true
      const fieldName = 'clients'
      await store.dispatch('request/load', fieldName)
      loading.value = false
    })

    const clients = computed(()=> store.getters['request/requests'])
    return{
      clients, loading
    }
  },

  components:{AppClient, Loader}
}
</script>