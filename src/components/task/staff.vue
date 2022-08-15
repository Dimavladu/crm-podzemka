<template>
  <a href="" @click.prevent="goToUser(user.id)">
    {{ user.info.name + ' ' }}
  </a>
  <span v-if="user.info.position">({{user.info.position }})</span>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'

export default {
  props: ['user'],
  setup(){
    const route = useRoute()
    const router = useRouter()
    const goToUser = id => {
      if (route.meta.layout === 'admin') router.push({name: 'userAdmin', params: {id} })
      else if (route.meta.layout === 'main') router.push({name: 'user', params: {id} })
    }
    return{ goToUser }
  }
}
</script>

<style scoped>

</style>