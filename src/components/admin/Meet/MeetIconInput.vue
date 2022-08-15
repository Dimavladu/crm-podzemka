<template>
  <div :class="'input-field col s12 m' + s" >
    <i class="material-icons prefix">{{icon}}</i>
    <slot></slot>
    <label class="active" :for="for">{{labelName}}</label>
  </div>
</template>

<script>
import {ref, onMounted, } from 'vue'

export default {
  props: ['s', 'icon', 'labelName', 'for'],
  setup(){
    const width = ref('')

    onMounted(() =>{
      if(window.innerWidth <= 450) width.value = 's12'
    })
    return { width }
  }
}
</script>

<style scoped>

</style>