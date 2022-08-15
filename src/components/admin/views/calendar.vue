<template>
  <user-calendar>

  </user-calendar>

  <div class="center-align">
    <p></p>
    <a class="waves-effect waves-light btn mt"
       @click.prevent="changeToggle"
    >{{toggle ? 'Скрыть' :  'Добавить' }}</a>
  </div>
  <app-meet
        v-if="toggle"
        @changeToggle="changeToggle"
  ></app-meet>

</template>

<script>
import {onMounted, computed, ref, watch} from 'vue'
import {useStore} from 'vuex'

import UserCalendar from '../../../views/calendar'
import AppMeet from '../Meet/AppMeet'
// import TheMeet from '../../Form/TheMeet'
// import Loader from '../../ui/Loader'

export default {
  setup(){
    const toggle = ref(false)
    const changeToggle = () => toggle.value = !toggle.value

    return{
     toggle, changeToggle,
    }
  },
  components:{ AppMeet, UserCalendar}
}
</script>

<style scoped>
.mt{
  margin-top: 10px;
}
</style>