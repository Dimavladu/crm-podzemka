<template>
  <meet-head v-if="requests.length === 0"></meet-head>
  <table
      class="centered highlight responsive-table"
      v-else>
    <thead>
      <tr><th v-for="(th, i) in titles" :key="i">{{ th }}</th></tr>
    </thead>
    <tbody>
    <tr v-for="(r, i) in requests"
        :key="r.id"
        :class="r.color"
        @click="$route.meta.layout === 'admin' ? meet(r.id) : ''"
    >
      <td>{{ r.name }}</td>
      <td>{{ r.format }}</td>
      <td>{{ r.dateStart }}</td>
      <td>{{ r.dateEnd }}</td>
      <td>{{ r.choice }}</td>
      <td>{{ r.prePaid }}</td>
      <td>{{ r.cost }}</td>
      <td><strong>{{ r.cost - r.prePaid}}</strong></td>
      <td>{{ r.people }}</td>
      <td>{{ r.contract }}</td>
      <td class="center-align" v-if="$route.meta.layout === 'admin'">
        <select
            class="color-width browser-default m0auto"
            v-model="r.color"
            @click.stop=""
            @change="changeColor(r.id, r.color)"
        >
          <option v-for="color in colors" :class="color" :value="color"></option>
        </select>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<script>
import {ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

import MeetHead from './MeetHead'
export default {
  props: ['requests'],
  setup(props){
    const router = useRouter()
    const store = useStore()
    const titles = ref([
      'Заказчик', 'Формат', 'Начало', 'Конец', 'Зал', 'Предоплата',
      'Сумма', 'Осталось', 'Люди', 'Договор'
    ])
    watch(props.requests, req =>{
      console.log(req)
    })

    const colors = ref(['red', 'yellow', 'white', 'green'])

    const fieldName = 'meet'
    const meet = id => router.push({name: fieldName, params: {id}})

    const changeColor = async (id, color) => await store.dispatch('request/change', [{color}, fieldName, id])

    return { colors, meet, changeColor, titles }
  },
  components: { MeetHead }
}
</script>

<style scoped>
.color-width{
  width: 20px;
  height: 20px;
}
.m0auto{
  margin: 0 auto;
}
</style>