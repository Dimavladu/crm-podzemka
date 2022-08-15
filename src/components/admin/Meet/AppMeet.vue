<template>
  <p></p>
  <div class="row">
    <form @submit.prevent="onSubmit">
      <div class="row">
        <meet-input s="6" id="name" labelName="Заказчик" :err=nError >
          <input v-model="name"
                 :class="['validate', {invalid: nError}]"
                 id="name"
                 type="text"
                 blur="nBlur">
        </meet-input>

        <meet-input s="6" id="format" labelName="Формат мероприятия" :err=fError>
          <input v-model="format"
                 :class="['validate', {invalid: fError}]"
                 id="format"
                 type="text"
                 blur="fBlur">
        </meet-input>

        <div class="input-field col s6" :class="width">
          <v-date-picker
              v-model="dateStart"
              mode="dateTime"
              :minute-increment="5"
              :model-config="modelConfig"
              is24hr >
            <template v-slot="{ inputValue, inputEvents }">
              <label>Начало мероприятия</label>
              <input
                  class="bg-white border px-2 py-1 rounded"
                  :value="inputValue"
                  v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>
        <div class="input-field col s6" :class="width">
          <v-date-picker
              v-model="dateEnd"
              mode="dateTime"
              :minute-increment="5"
              :model-config="modelConfig"
              is24hr >
            <template v-slot="{ inputValue, inputEvents }">
              <label>Конец мероприятия</label>
              <input
                  class="bg-white border px-2 py-1 rounded"
                  :value="inputValue"
                  v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>
        <div class="input-field col s12" >
          <select ref="select" v-model="choice">
            <option value="Концертный">Концертный</option>
            <option value="Особенный">Особенный</option>
            <option value="Правда">Правда</option>
          </select>
          <label>Выберите зал</label>
        </div>

        <meet-input s="6" id="prePaid" labelName="Предоплата" :err=preError>
          <input v-model="prePaid"
                 :class="['validate', {invalid: preError}]"
                 id="prePaid"
                 type="number"
                 blur="preBlur">
        </meet-input>
        <meet-input s="6" id="Cost" labelName="Общая сумма" :err=cError>
          <input v-model="cost"
                 :class="['validate', {invalid: cError}]"
                 id="Cost"
                 type="number"
                 blur="cBlur">
        </meet-input>
        <meet-input s="6" id="phone" labelName="Номер телефона" :err=phoneError>
          <input v-model="phone"
                 :class="['validate', {invalid: phoneError}]"
                 id="phone"
                 type="number"
                 blur="phoneBlur">
        </meet-input>
        <meet-input s="6" id="people" labelName="Ожидаемое количество людей" :err=pError>
          <input v-model="people"
                 :class="['validate', {invalid: pError}]"
                 id="people"
                 type="number"
                 blur="pBlur">
        </meet-input>

      </div>
      <button class="btn waves-effect waves-light centered" type="submit">Отправить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'

import {useMeetForm} from '../../../use/meet-form'
import MeetInput from './MeetInput'

export default {
  emits:['changeToggle'],
  setup(_, context) {
    const store = useStore()
    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })
    const width = ref('')

    onMounted(() =>{
      if(window.innerWidth <= 450) width.value = 's12'
    })

    const submit = async values =>{
      const fieldName = 'meet'
      values.resPaid = values.cost - values.prePaid
      await store.dispatch('request/create', [values, fieldName])
      context.emit('changeToggle')
      store.dispatch('toast', 'Новое мероприятие успешно добавлено')
    }

    return { ...useMeetForm(submit), modelConfig, width }
  },
  components: {MeetInput},

  mounted(){
    this.select = M.FormSelect.init(this.$refs.select)
  },
  unmounted(){
    if(this.select && this.select.destroy){
      this.select.destroy()
    }
  }
}
</script>

<style scoped>

</style>