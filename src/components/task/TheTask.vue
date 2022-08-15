<template>
 <table class="centered highlight" v-if="tasks.length">
   <thead>
   <tr>
     <th>Имя</th>
     <th>Дата</th>
     <th>Время</th>
     <th>Статус</th>
   </tr>
   </thead>
   <tbody>
     <tr
       v-for="(r, i) in tasks"
       :key="r.id"
       @click.prevent="task(r.id)">
       <td>{{ r.name }}</td>
       <td>{{ r.date.fullDate }}</td>
       <td>{{ r.date.dateString }}</td>
       <td :class="r.color + '-text'" >{{ r.status }}</td>
     </tr>
   </tbody>
 </table>
  <div class="center-align" v-else>Задач пока нет</div>
</template>

<script>
import {computed, ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useStore} from 'vuex'
export default {
  props: ['tasks', 'type'],
  setup(props, context){
    const router = useRouter()
    const store = useStore()
    const route = useRoute()
    const task = id => {
      if (route.meta.layout === 'admin') router.push({name: `${props.type}Admin`, params: {id}})
      else router.push({name: props.type, params :{id}})
    }

    return{ task }
  }

}
</script>

<style scoped>

</style>