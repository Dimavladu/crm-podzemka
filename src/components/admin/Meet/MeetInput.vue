<template>
  <div :class="'input-field col s'+ s + ' ' + width">
    <slot
    ></slot>
    <label :for="id">{{ labelName }}</label>
    <small
        class="helper-text invalid"
        v-if="err"
    >{{ err }}</small>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
  export default {
    props:['s', 'id', 'err', 'labelName'],
    setup(){
      const width = ref('')

      onMounted(() =>{
        if(window.innerWidth <= 450) width.value = 's12'
      })
      return{ width }
    }
  }
</script>

<style scoped>

</style>