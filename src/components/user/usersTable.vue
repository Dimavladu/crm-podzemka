<template>
  <div v-if="!$store.state.user.usersPhoto[user.id]" class="circle">
    <LoaderMini></LoaderMini>
  </div>
  <img
      v-else-if="$store.state.user.usersPhoto[user.id]"
      :src="$store.state.user.usersPhoto[user.id]"
      :alt="user.info.name"
      class="circle responsive-img"
  >
  <span class="title">
        {{ user.info?.name }} {{ id === user.id ? '(Вы)' : '' }}
  </span>

  <p>{{ user.info?.lastName }} {{ user.info?.midName }} <br>
    {{ user.info?.position }}
  </p>

  <span
      class="new badge secondary-content"
      :class="user.status !== 'online' ? 'grey' : ''"
      data-badge-caption=""
  >{{ user.status }}</span>
</template>

<script>
import {computed} from 'vue'
import {useStore} from 'vuex'
import {getCurrentTime} from '../../use/check-last-visit'

import LoaderMini from '../ui/Loader-mini'

export default {
  props: ['user'],
  setup(props){
    const store = useStore()
    // if (props.user.id === 'zk4yaQs9faNSOT3ABrR5SAKoFOn1'){
      // console.log(props.user.lastUpdated)
      // console.log(store.getters['auth/lastUpdated'])

      // if (props.user.lastUpdated) {
      //   console.log(props.user.lastUpdated)
      //   const durationTime = getCurrentTime(props.user.lastUpdated, store.getters['auth/lastUpdated'])
      //   const time = {'time': durationTime}
      //   if(durationTime > 10) {
      //     console.log(props.user.id + ' offline')
      //   }

      //   else if (durationTime < 10) {
      //     console.log(props.user.id + ' online')
      //     // store.dispatch['auth.setStatus', []]
      //   }
      // }
      // else {
      //   console.log(props.user.id + ' offline 123')
      // }

    // }
    const id = computed(() => store.state.auth.uid)
    return{id}
  },
  components:{LoaderMini}
}
</script>

<style scoped>

</style>