<template>
  <li>
    <div class="collapsible-header">
      <i class="material-icons">{{ iconName }}</i>
        <slot></slot>
      <span class="badge">{{ tasks.length }}</span>
    </div>
    <div class="collapsible-body">
      <loader v-if="loading"></loader>
      <the-task v-else :tasks="tasks" :type="type"></the-task>
    </div>
  </li>
</template>

<script>
import TheTask from './TheTask'
import Loader from '../ui/Loader'

export default {
  props: ['loading', 'tasks', 'iconName', 'type'],
  setup(){

  },
  components: {TheTask, Loader}
}
</script>

<style scoped>

</style>