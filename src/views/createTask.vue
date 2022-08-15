<template>
  <div class="page-title">
    <h3>Добавить задачу</h3>
  </div>
  <div class="row">
    <form @submit.prevent="onSubmit">
      <div class="row">
        <div class="input-field col s12">
          <v-date-picker
              v-model="date"
              :modelConfig="modelConfig"
              mode="dateTime"
              :minute-increment="5"
              is24hr >
            <template v-slot="{ inputValue, inputEvents }">
              <label>Время задачи</label>
              <input
                  class="bg-white border px-2 py-1 rounded"
                  :value="inputValue"
                  v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>
        <div class="input-field col s12">
          <input
              id="task_name"
              type="text"
              :class="['validate', {invalid: nError}]"
              v-model="name"
              @blur="nBlur"
          >
          <label for="task_name">Наименование задачи</label>
          <small
              class="helper-text invalid"
              v-if="nError"
          >{{ nError }}</small>
        </div>

        <div class="input-field col s12">
          <textarea
              id="textarea"
              class="materialize-textarea"
              v-model="comment"
              @blur="cBlur"
          ></textarea>
          <label for="textarea">Комментарий</label>
        </div>
        <button class="btn waves-effect waves-light ml" type="submit">Отправить
          <i class="material-icons right">cloud</i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {ref, onMounted, computed} from 'vue'
import {useTaskForm} from '../use/task-form'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'

export default {
  setup(){
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    let select = ref('')
    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    onMounted(async ()=>{
      select.value = M.FormSelect.init(select.value)
      await store.dispatch('user/getUsersInfo')
      M.AutoInit()
    })

    const submit = async values =>{
      await store.dispatch('task/createSelfTask', values)
      await store.dispatch('task/loadTasks', store.getters['auth/uid'])
      router.push({name: 'tasks'})
    }

    const users = computed(() => store.state.user.users)

    return{
      ...useTaskForm(submit), modelConfig,
    }
  },
  // mounted(){
  //   this.select = M.FormSelect.init(this.$refs.select)
  // },
  unmounted(){
    if(this.select && this.select.destroy) this.select.destroy()
  }
}
</script>

<style scoped>
  .ml{
    margin-left: 10px;
  }
</style>