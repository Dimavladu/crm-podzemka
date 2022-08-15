<template>
  <div class="page-title">
    <h3>Мероприятия</h3>
    <button class="waves-effect waves-light btn" @click.prevent="load">
      <i class="material-icons">autorenew</i>
    </button>
  </div>
  <v-date-picker
      v-model="range"
      is-expanded
      is-range
      :model-config="modelConfig"
  ></v-date-picker>
  <loader v-if="loading" class="center-align"></loader>
  <the-meet
      v-else
      :requests="requests"
  ></the-meet>

</template>

<script>
import {onMounted, computed, ref, watch} from 'vue'
import {useStore} from 'vuex'

import TheMeet from '../components/Form/TheMeet'
import Loader from '../components/ui/Loader'

export default {
  setup(props){
    const store = useStore()
    const range = ref({
      start: new Date().setHours(0, 0, 1, 0),
      end: new Date().setHours(23, 59, 59, 0),
    })
    const modelConfig = ref({type: 'Date'})

    const loading = ref(false)

    const load = async () =>{
      loading.value = true
      const fieldName = 'meet'
      await store.dispatch('request/load', fieldName)
      loading.value = false
    }
    onMounted( async () => await load())
    const requests = computed(() => store.getters['request/requests']
        .filter(request =>{
          if (request.dateStart) {
            const date = new Date(request.dateStart.slice(0, 10))
            if (date <= range.value.end && date >= range.value.start) return request
          }
        })
    )
    return{
      range, requests, modelConfig, loading, load
    }
  },
  components:{TheMeet, Loader}
}
</script>

<style scoped>
.mt{
  margin-top: 10px;
}
</style>