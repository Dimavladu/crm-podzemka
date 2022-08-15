<template>
  <Loader v-if="$store.state.user.photoCount - 1 !== users.length"></Loader>
  <div
      class="input-field col s12"
      v-else-if="$store.state.user.photoCount - 1 === users.length">
    <select multiple class="icons" ref="select" v-model="staff" @change="sendUsers">
      <option
          v-for="user in users"
          :value="user.id"
          :key="user"
          :data-icon="$store.state.user.usersPhoto[user.id]"
          class="circle"
      >
        {{ user.info?.name }}
        {{ user.info.position ? '(' + user.info.position + ')' : '' }}
      </option>
    </select>
    <label class="">Выберите сотрудника</label>
    <small
        class="helper-text invalid"
        v-if="message"
    >{{ message }}</small>
  </div>
</template>

<script>
import {ref, onMounted, onUpdated, computed} from 'vue'
import {useStore} from 'vuex'

import Loader from '../../ui/Loader'

export default {
  props:['message'],
  emits:['staff'],
  setup(_, context) {
    let select = ref('')
    const store = useStore()
    const staff = ref([])

    onMounted(async () => await store.dispatch('user/getUsersInfo'))

    onUpdated(() => select.value = M.FormSelect.init(select.value))

    const sendUsers = () => context.emit('staff', staff)

    const id = computed(() => store.state.auth.uid)
    const users = computed(() => store.getters['user/usersListWithoutYou'])

    return {users, id, select, staff, sendUsers}
  },
  components: {Loader}
}
</script>

<style scoped>

</style>