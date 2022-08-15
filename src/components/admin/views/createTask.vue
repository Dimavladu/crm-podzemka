<template>
  <div class="page-title">
    <h3>Добавить задачу</h3>
  </div>
  <div class="row">
    <form @submit.prevent="onSubmit">
      <div class="row">
        <div class="switch col s12 mb">
          <label>
            Личная задача
            <input
                type="checkbox"
                v-model="checkType"
                @click="changeType">
            <span class="lever"></span>
            Задача сотруднику
          </label>
        </div>
        <select-users
            v-if="checkType"
            :message="message"
            @staff="usersList"
        />

        <div class="input-field col s12">
          <input
              id="task_name"
              type="text"
              :class="['validate', {invalid: nError}]"
              v-model="name"
              @blur="nBlur"
          >
          <label for="task_name">Наименование задачи </label>
          <small
              class="helper-text invalid"
              v-if="nError"
          >
            {{ nError }}
          </small>
        </div>
        <div class="input-field col s12">
          <v-date-picker
              v-model="date"
              :modelConfig="modelConfig"
              mode="dateTime"
              :minute-increment="5"
              is24hr
              :class="['validate', {invalid: dError}]"
              @blur="dBlur"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <label>Время задачи</label>
              <input
                  class="bg-white border px-2 py-1 rounded"
                  :value="inputValue"
                  v-on="inputEvents"
              />
            </template>
          </v-date-picker>
          <small
              class="helper-text invalid"
              v-if="dError"
          >
            {{ dError }}
          </small>
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
import {ref, onMounted, onUpdated, computed} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'

import usersList from '../../user/usersList'
import selectUsers from '../task/selectUsers'
import {useTaskForm} from '../../../use/task-form'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    let checkType = ref(false)
    let message = ref('')
    const staff = ref([])
    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    const usersList = list => staff.value = list.value
    const submit = async values => {
      if (checkType.value && !staff.value.length) message.value = 'Выберите хотя-бы одного сотрудника'
      else if (checkType.value && staff.value.length){
        values.staff = staff.value
        values.main = store.state.auth.uid
        await store.dispatch('task/createMainTask', values)
      }
      else if (!checkType.value) await store.dispatch('task/createSelfTask', values)

      router.push({name: 'tasksAdmin'})
    }


    const photo = id => store.state.user.usersPhoto[id]
    const changeType = () => checkType.value = !checkType.value

    return {
      ...useTaskForm(submit),
      modelConfig,
      photo,
      message,
      checkType,
      changeType,
      usersList
    }
  },
  components: {usersList, selectUsers},
  unmounted() {
    if (this.select && this.select.destroy) this.select.destroy()
  }
}
</script>

<style scoped>
.ml {
  margin-left: 10px;
}

.pt-25 {
  padding-top: 25px;
}

.mt {
  margin-top: 30px;
}

.pb-25 {
  padding-bottom: 25px;
}

.mb {
  margin-bottom: 30px;
}

</style>