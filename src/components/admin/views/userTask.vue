<template>
  <loader v-if="loading"></loader>
  <div v-else>
    <div class="page-title">
      <h3>{{task.name}}</h3>
    </div>
    <div class="row">
      <form>
        <icon-input s="4" icon="title" labelName="Имя задачи" for="task">
          <input
              @change="update({name: task.name})"
              v-model="task.name"
              id="task"
              type="text"
              class="validate">
        </icon-input>
        <icon-input s="4" icon="timer" labelName="Оставшееся время" for="remaining_time" >
          <input disabled
                 v-model="task.date.dateString"
                 id="remaining_time"
                 type="text" class="validate">
        </icon-input>
        <div class="input-field col m4 s12" :class="width">
          <i class="material-icons prefix">sync</i>
          <select v-model="task.status" ref="select" @change="update({status: task.status})">
            <option value="Выполнено">Завершено</option>
            <option value="Подтверждение">Подтверждение</option>
            <option value="Выполняется">Выполняется</option>
            <option value="Отколнено">Отколнено</option>
          </select>
          <label>Статус</label>
        </div>
        <div class="input-field col s12" @change="test(task.date.fullDate)">
          <v-date-picker
              mode="dateTime"
              :minute-increment="5"
              :model-config="modelConfig"
              v-model="task.date.fullDate"
              is24hr >
            <template v-slot="{ inputValue, inputEvents }">
              <i class="material-icons prefix pt-25">date_range</i>
              <label>Дата задачи</label>
              <input :value="inputValue" v-on="inputEvents"/>
            </template>
          </v-date-picker>
        </div>
      </form>
    </div>
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
    <div class="pt-25">
      <button
          class="waves-effect waves-light btn ml yellow"
          @click="endTask" v-if="task.status !== 'Завершено'">
          <i class="material-icons right ">send</i>Завершить
      </button>
      <button
          class="waves-effect waves-light btn ml red"
          @click="declinceTask">
          <i class="material-icons right ">close</i>Отказать
      </button>
      <button
          class="waves-effect waves-light btn ml red right"
          @click="remove">
        <i class="material-icons left ">delete</i>Удалить
      </button>
    </div>
  </div>
</template>

<script>
import {onMounted, onUpdated, ref, computed, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import Loader from '../../ui/Loader'
import commentInput from '../../task/commentInput'
import IconInput from '../Meet/MeetIconInput'
import staff from '../../task/staff'
import LiItem from '../../task/liItem'
import { useToast } from "vue-toastification"

export default {
  setup(){
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const width = ref('')

    const loading = ref(true)
    let task = ref({})
    let select = ref('')
    let collapsible = ref('')
    let users = ref([])
    let comment = ref('')
    let comments = ref('')
    let media = ref('')

    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    onMounted( async () => {
      if(window.innerWidth <= 450) width.value = 's12'
      await load()
    })
    onUpdated(() => {
      select.value = M.FormSelect.init(select.value)
      collapsible.value = M.Collapsible.init(collapsible.value)
    })
    const name = computed(() => store.getters['user/userInfo'])

    const addComment = async comm => {
      await store.dispatch('task/addComment',
          [task.value.staff, name.value.name, comm, route.params.id, task.value.main])
      await load()
      comment.value = ''
    }

    const push = () => router.push({name: 'tasksAdmin'})

    const load = async () =>{
      loading.value = true
      task.value = await store.dispatch('task/loadTask', [route.params.id, 'main/'])
      task.value.staff.forEach(async (id, i) =>{
        users.value[i] = await store.dispatch('user/loadUserInfoById', id)
      })
      loading.value = false
    }

    const endTask = async () =>{
      const status = ref({status: 'Завершено', color: 'green'})
      await update(status.value)
      push()
    }
    const declinceTask = async () =>{
      const status = ref({status: 'Отказано', color: 'green'})
      await update(status.value)
      push()
    }
    const update = async val =>{
      console.log(val)
      task.value.staff.forEach(async id => {
        await store.dispatch('task/updateOtherTask',
            [val, id, route.params.id, 'worker/'])
      })
      await store.dispatch('task/updateOtherTask',
          [val, task.value.main, route.params.id, 'main/'])
      await store.dispatch('task/loadTasks')
      await store.dispatch('toast', 'Ифнормация обновлена')
    }

    const remove = async () => {
      await store.dispatch('task/removeMainTask', [task.value, route.params.id])
      await store.dispatch('task/loadTasks')
      push()
    }
    const openPhoto = () => media.value = M.Materialbox.init(media.value)

    return {width, loading, modelConfig, select, collapsible,
      task, users, comment, addComment, endTask, remove, declinceTask,
      update, load, name, media, openPhoto }
  },
  components: {Loader, LiItem, staff, commentInput, IconInput},
  unmounted(){
    if(this.select && this.select.destroy) this.select.destroy()
    if(this.collapsible && this.collapsible.destroy) this.collapsible.destroy()
  }
}
</script>

<style scoped>
.flex{
  display: flex;
  align-items: center;
}
.selectHeight{
  height: 25px;
}
.pt-25{
  padding-top: 25px;
}
.pt-10{
  padding-top: 10px;
}
.pt--25{
  padding-top: -25px;
}
</style>