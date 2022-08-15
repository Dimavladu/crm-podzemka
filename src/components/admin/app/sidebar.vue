<template>
  <ul class="sidenav app-sidenav" :class="{open: isOpen}">
    <router-link
        v-for="link in links"
        :key="link.name"
        active-class="active"
        :to="{name: link?.name}"
        :exact="link.exact"
    >
      <li @click="$emit('bar')" >
        <a href="#" class="waves-effect waves-blue pointer">{{ link.title }}
          <span
              v-if="link.title === 'Задачи' && tasks"
              class="new badge"
              data-badge-caption=""
          >{{tasksLength}}</span>
        </a>
      </li>
    </router-link>
  </ul>

</template>

<script>
import {reactive, ref, computed, onMounted} from 'vue'
import {useStore} from 'vuex'

export default {
  props: ['isOpen'],
  setup() {
    const store = useStore()
    const links = reactive([
      {title: 'Сотрудники', name: 'usersAdmin'},
      {title: 'Задачи', name: 'tasksAdmin', exact: true},
      // {title: 'Клиенты', url: 'clients'},
      {title: 'Мероприятия', name: 'calendarAdmin'},
    ])
    const tasks = ref({})
    onMounted(async () =>{
      await store.dispatch('task/loadTasks', store.getters['auth/uid'])
    })
    const tasksLength = computed(() => store.state.task.tasksLength)

    return {links, tasks, tasksLength}
  },
  components: {}

}
</script>
<style scoped>
.test{
  position: fixed;
  bottom: 0px;
  right: 15px;
}
.test1{
  position: fixed;
  bottom: 180px;
  right: 15px;
}
</style>