<template>
  <form ref="form" class="file-field input-field col s11">
    <div class="btn">
      <span>{{span}}</span>
      <input
          type="file"
          ref="file"
          @change="uploadFile"
      >
    </div>
    <div class="file-path-wrapper">
      <input
          class="file-path validate"
          type="text"
          :placeholder="url ? placeholderText: placeholder">
    </div>
  </form>

    <a
      class="btn-large col s1"
      :class="!url ? 'disabled' : '' "
      :href="url"
      >
        <i class="material-icons ">cloud_download</i>
    </a>

</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

export default {
  props:['url', 'placeholder', 'span', 'folder', 'fieldName', 'name'],
  emits:['load'],
  setup(props, context){
    const route = useRoute()
    const store = useStore()

    const file = ref()
    const placeholderText = ref('Файл ' + props.name + ' уже загружен')
    const uploadFile = async () => {
      await store.dispatch('request/addContract',
          [route.params.id, file.value.files[0], props.folder, props.fieldName])
      await context.emit('load')
      store.dispatch('toast', 'Информация успешно обновлена')
    }

    return { uploadFile, file, placeholderText}
  }
}
</script>

<style scoped>

</style>