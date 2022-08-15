<template>
  <Loader v-if="loading"></Loader>
  <div v-else class="">
    <div class="page-title">
      <h3 :class="user.role === 'ADMIN' ? 'red-text' : ''">
      {{ user.info?.name }} {{ user.info?.lastName }} {{ user.info?.midName }}</h3>
      <button
          v-if="$route.params.id !== $store.state.auth.uid"
          class="waves-effect waves-light btn"
          @click.prevent="changeRole">
        {{ user.role === 'USER' ? 'Сделать администратором' : 'Убрать права администратора'}}
      </button>
    </div>
    <div id="modal" ref="modal" class="modal bottom-sheet">
      <div class="modal-content">
        <h5>Вы действительно хотите удалить пользователя <b>{{ user.info?.name }}</b>?</h5>
        Восстановить данные будет невозможно
      </div>
      <div class="modal-footer">
        <a href="#!" @click="deleteUser" class="modal-action modal-close waves-effect waves-green btn-flat text-red">Удалить</a>
      </div>
    </div>
    <div class="row">
      <div class="col s6 m4 flex">
        <Loading v-if="!user.url" class="border"></Loading>
          <img
            v-else-if="user.url"
            :src="user.url"
            :width="isVisible ? '160' : '120'"
            class="border"
            :alt="user.name">
          <button class="waves-effect waves-light btn-small mt red" @click="showModal" >Удалить</button>
      </div>
      <div class="col s6 m8">
        <div class="flow-text">{{ user.info.birthday }} </div>
        <div class="flow-text">{{ user.info.position }}
          <div class="flow-text">
            <a @click.prevent="copyText(user.info.phone)"
               href="">{{ user.info.phone }}</a>
          </div>
        </div>
        <div class="flow-text">
          <a
              @click.prevent="copyText(user.info.email)"
              href="">{{ user.info.email }}</a>
        </div>
        <blockquote class="col12">{{ user.info.status }}</blockquote>
      </div>
    </div>
    <the-task :tasks="tasks" type="self"/>
    <div class="center-align">
      <button class="waves-effect waves-light btn " @click="showCreate" >
        Добавить
      </button>
    </div>
  </div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {onMounted, onUpdated, ref, computed} from 'vue'
import {useTaskForm} from '../../../use/task-form'

import Loader from '../../ui/Loader'
import TheTask from '../../task/TheTask'

export default {

  setup(){
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const loading = ref(true)

    const collapsible = ref('')
    const user = ref()
    const modal = ref()
    const width = ref(0)
    const isVisible = ref(true)
    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    const checkResize = () => {
      width.value = window.innerWidth
      if (width.value <= 600) isVisible.value = false
      else isVisible.value = true
    }
    window.addEventListener('resize', checkResize)
    checkResize()

    onMounted(async() => {
      loading.value = true
      user.value = await store.dispatch('user/loadAllUserInfo', route.params.id)
      await store.dispatch('task/loadTasks', route.params.id)
      loading.value = false
    })
    onUpdated(() => modal.value = M.Modal.init(modal.value))

    const showModal = () => modal.value.open()

    onUpdated(() => {
      collapsible.value = M.Collapsible.init(collapsible.value)
    })

    const copyText = text =>{
      navigator.clipboard.writeText(text)
      store.dispatch('toast', 'Скопировано')
    }

    const changeRole = async () =>{
      loading.value = true
      const role = {role: user.value.role}
      role.role = (role.role === 'ADMIN' ? 'USER' : 'ADMIN')
      await store.dispatch('user/changeRole', [route.params.id, role])
      user.value = await store.dispatch('user/loadAllUserInfo', route.params.id)
      loading.value = false
    }
    const deleteUser = async () =>{
      await store.dispatch('user/deleteUser', route.params.id)
      router.push({name: 'usersAdmin'})
    }
    const tasks = computed(() => store.state.task.tasks)

    const showCreate = () => router.push({name: 'createTaskAdmin'})

    return {
      modal, showModal,
      loading, user, copyText,
      tasks, showCreate, changeRole,
      isVisible, width, deleteUser
    }
  },
  components: {Loader, TheTask},
  mounted(){
    this.img = M.Materialbox.init(this.$refs.img)
  },
  unmounted(){
    window.removeEventListener('resize', this.handleResize)
    if(this.img && this.img.destroy) this.img.destroy()
    if(this.collapsible && this.collapsible.destroy) this.collapsible.destroy()
  }
}
</script>

<style scoped>
.border{
  border: solid  ;
  border-radius: 10px;
}
.mt{
  margin-top: 10px;
}
.flex{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.m0auto{
  margin: 0 auto;
}
</style>