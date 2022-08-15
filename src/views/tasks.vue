<template>
    <div class="page-title">
      <h3>Задачи
        <button class="waves-effect waves-light btn" @click.prevent="changeVisible">
          <i class="material-icons">date_range</i>
        </button>
      </h3>

      <button class="waves-effect waves-light btn" @click.prevent="load">
        <i class="material-icons">autorenew</i>
      </button>
    </div>

  <ul class="collapsible" ref="collapsible" v-if="!isCalendar">
    <collapsible-item
        :loading="loading"
        :tasks="tasks"
        iconName="add_alert"
        type="self"
    >
      Ваши задачи
    </collapsible-item>
    <collapsible-item
        :loading="loading"
        :tasks="workerTasks"
        iconName="announcement"
        type="worker"
    >
      Задачи от руководства
    </collapsible-item>
  </ul>

  <task-calendar  v-else-if="isCalendar" :tasks="tasks"></task-calendar>

  <div class="center-align mt">
    <router-link
        tag="a"
        class="waves-effect waves-light btn mt"
        :to="{name: $route.meta.layout === 'admin' ? 'createTaskAdmin' : 'createTask'}"
    >Добавить</router-link>
  </div>

</template>

<script>
import {ref, computed, onMounted, onUpdated} from 'vue'
import {useStore} from 'vuex'

import TheTask from './../components/task/TheTask'
import CollapsibleItem from '../components/task/CollapsibleItem'
import TaskCalendar from './../components/task/TaskCalendar'
import Loader from './../components/ui/Loader'

export default {
  setup(){
    const store = useStore()
    const loading = ref(false)
    const collapsible = ref('')

    const isCalendar = ref(false)
    const changeVisible = () => isCalendar.value = !isCalendar.value

    onMounted( async() => {
      await load()
    })
    onUpdated(() => collapsible.value = M.Collapsible.init(collapsible.value))

    const load = async () =>{
      loading.value = true
      await store.dispatch('task/loadTasks', store.getters['auth/uid'])
      loading.value = false
    }
    const tasks = computed(() => store.state.task.tasks)
    const workerTasks = computed(() => store.state.task.workerTasks)

    return{
      collapsible, tasks, workerTasks, loading, load, isCalendar, changeVisible
    }
  },
  name: 'reminders',
  components: {TheTask, TaskCalendar, CollapsibleItem, Loader},

}
</script>

<style scoped>
.mt{
  margin-top: 10px;
}
</style>