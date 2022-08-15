<template>
  <v-calendar
    class="center-align mt"
    is-expanded
    :from-date="new Date()"
    :attributes="attributes"
  />
</template>

<script>
import {ref, computed} from 'vue'
export default {
  props: ['tasks'],
  setup(props){
    const attributes = computed(() => [
        ...props.tasks?.map(todo => ({
          dates: todo.date.fullDate,
          dot: {color: todo.color,},
          popover:{label: `${todo.name} (${todo.date.dateString})`,},
          customData: todo,
        }))
      ]
    )
    return { attributes }
  }
}
</script>

<style scoped>

</style>