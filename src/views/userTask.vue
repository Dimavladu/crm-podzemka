<template>
  <div class="page-title">
    <h3>{{task.name}}</h3>
  </div>
  <loader v-if="loading"></loader>
  <div v-else-if="task">
    <ul class="collection">
      <li-item>Оставшееся время: {{ task.date.dateString }}</li-item>
      <li-item>Дата задачи: {{ task.date.fullDate }}</li-item>
      <li-item>
        Статус:
          <span :class="task.color + '-text'">
            {{ task.status }}
          </span>
      </li-item>
      <li-item>
        <b>Администратор: </b>
        <staff :user="mainUser"></staff>
      </li-item>
      </ul>

    <ul class="collection with-header">
      <li class="collection-header"><h6>Сотрудники</h6></li>
      <li-item v-for="user in users" :key="user.id">
        <staff :user="user"></staff>
      </li-item>
    </ul>
    <ul class="collection with-header">
      <li class="collection-header"><h6>Комментарии</h6></li>
      <li-item v-for="comm in task.comments">
        <div v-if="comm.text"><b>{{comm.name}}</b>: {{comm.text}}</div>
        <div v-else-if="comm.url">
          <b>{{comm.name}}</b>:
          <img class="materialboxed" @click="openPhoto" width="300" :src="comm.url" ref="media">
        </div>
      </li-item>
      <li-item>
        <comment-input
            :comment="comment"
            :staff="task.staff "
            :main="task.main"
            :name="name.name"
            @addComment="addComment"
        />
      </li-item>
    </ul>
    <button class="waves-effect waves-light btn ml yellow" @click="endTask">
      <i class="material-icons right" >send</i>Завершить
    </button>
  </div>
</template>

<script>
import {onMounted, ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import Loader from '../components/ui/Loader'
import commentInput from '../components/task/commentInput'
import Staff from '../components/task/staff'
import LiItem from '../components/task/liItem'
import { useToast } from "vue-toastification"

export default {
  setup(){
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    const comment = ref('')
    let mainUser = ref({})
    let users = ref([])
    const taskDate = new Date()
    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    const loading = ref(true)
    let task = ref({})

    onMounted( async () =>await load())

    const load = async () =>{
      loading.value = true
      task.value = await store.dispatch('task/loadTask', [route.params.id, 'worker/'])

      task.value.staff.forEach(async (id, i) =>{
        users.value[i] = await store.dispatch('user/loadUserInfoById', id)
      })
      mainUser.value = await store.dispatch('user/loadUserInfoById', task.value.main)
      loading.value = false
    }

    const push = () => {
      if (route.meta.layout === 'admin') router.push({name: 'tasksAdmin' })
      else if (route.meta.layout === 'main') router.push({name: 'tasks' })
    }

    const endTask = async () =>{
      const status = ref({status: 'Подтверждение', color: 'green'})

      task.value.staff.forEach(async id => {
        await store.dispatch('task/updateOtherTask',
            [status.value, id, route.params.id, 'worker/'])
      })
      await store.dispatch('task/updateOtherTask',
          [status.value, task.value.main, route.params.id, 'main/'])
      await store.dispatch('task/loadTasks')
      await store.dispatch('toast', 'Ифнормация обновлена')
      load()
    }

    const addComment = async comm => {
      await store.dispatch('task/addComment',
          [task.value.staff, name.value.name, comm, route.params.id, task.value.main])
      await load()
      comment.value = ''
    }
    const name = computed(() => store.getters['user/userInfo'])

    return { task, loading, endTask, name,
      taskDate, comment, addComment, users, mainUser }
  },
  components: {Loader, LiItem, Staff, commentInput},
}
</script>

<style scoped>
.flex{
  display: flex;
}
.selectHeight{
  height: 25px;
}
</style>