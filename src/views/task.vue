<template>
  <div class="page-title">
    <h3>Название задачи</h3>
  </div>
  <loader v-if="loading"></loader>
  <div v-else-if="task" class="">
    <ul class="collection">

      <li-item>Оставшееся время: {{ task.date.dateString }}</li-item>
      <li-item>Дата задачи: {{ task.date.fullDate }}</li-item>
      <li-item>
        Статус:
        <span :class="task.color + '-text'">
              {{ task.status }}
            </span>
      </li-item>
    </ul>
    <button v-if="task.status != 'Завершено'" class="waves-effect waves-light btn ml yellow" @click="endTask">
      <i class="material-icons right" >send</i>Завершить
    </button>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import LiItem from '../components/task/liItem'
import Loader from '../components/ui/Loader'

export default {
  setup(){
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const loading = ref(true)
    const task = ref()
    onMounted(async() =>{
      await load()
    })
    const load = async () =>{
      loading.value = true
      task.value = await store.dispatch('task/loadTask', [route.params.id, 'self/'])
      loading.value = false
    }
    const endTask = async () =>{
      const status = ref({status: 'Завершено', color: 'green'})
      await store.dispatch('task/updateOtherTask',
          [status.value, store.state.auth.uid, route.params.id, 'self/'])
      if (route.meta.layout === 'admin') router.push({name: 'tasksAdmin' })
      else if (route.meta.layout === 'main') router.push({name: 'tasks' })
    }
    return{task, load, loading, endTask }
  },
  components:{
    LiItem, Loader
  }
}
</script>

<style scoped>

</style>