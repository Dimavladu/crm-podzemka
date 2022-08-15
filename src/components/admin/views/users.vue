<template>
  <div class="page-title">
    <h3>Сотрудники</h3>
    <button class="waves-effect waves-light btn" @click.prevent="reload">
      <i class="material-icons">autorenew</i>
    </button>
  </div>

  <Loader v-if="loadingUsers"></Loader>

  <usersList v-else></usersList>
  <unRegisteredUsers @reload="reload"></unRegisteredUsers>

</template>

<script>
import {onMounted, ref, computed} from 'vue'
import {useStore} from 'vuex'

import Loader from '../../ui/Loader'
import usersList from '../../user/usersList'
import unRegisteredUsers from '../user/unregisteredUsers'

export default {
  setup(){
    const store = useStore()
    const loadingUsers = ref(false)

    onMounted(async () => await reload())

    const reload = async () =>{
      loadingUsers.value = true
      await store.dispatch('user/loadUnregisteredUsers')
      await store.dispatch('user/getUsersInfo')
      loadingUsers.value = false
    }

    return {loadingUsers, reload }
  },
  components: {Loader, usersList, unRegisteredUsers}
}
</script>

<style scoped>

</style>