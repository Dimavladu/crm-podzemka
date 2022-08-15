<template>
  <Loader v-if="!users.length"></Loader>
  <div v-else-if="users.length" class="collection">
    <a class="collection-item avatar"
       href=""
       v-for="user in users"
       :key="user.id"
       @click.prevent="goUser(user.id)"
    >
      <users-table :user="user"></users-table>
    </a>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'

import Loader from '../ui/Loader'
import usersTable from './usersTable'

export default {
  setup(){
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const goUser = async id => {
      await store.dispatch('task/loadTasks', id)
      if (route.meta.layout === 'admin') router.push({name: 'userAdmin', params: {id} })
      else if (route.meta.layout === 'main') router.push({name: 'user', params: {id} })
    }

    const id = computed(() => store.state.auth.uid)
    const users = computed(() => store.state.user.users)
    return {id, users, goUser}
  },
  components: {Loader, usersTable}
}
</script>

<style scoped>

</style>