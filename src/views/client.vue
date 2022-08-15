<template>
  <form class="card auth-card" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Заявка</span>
      <div class="input-field">
        <input
            id="name"
            type="text"
            v-model="name"
            :class="['validate', {invalid: nError}]"
            @blur="nBlur"
        >
        <label for="name">Имя</label>
        <small
            class="helper-text invalid"
            v-if="nError"
        >{{ nError }}</small>
      </div>
      <div class="input-field">
        <input
            id="payInfo"
            type="text"
            v-model="payInfo"
            :class="['validate', {invalid: iError}]"
            @blur="iBlur"
        >
        <label for="payInfo">Реквизиты</label>
        <small
            class="helper-text invalid"
            v-if="iError"
        >{{ iError }}</small>
      </div>
      <div class="input-field">
        <input
            id="email"
            type="text"
            v-model="email"
            :class="['validate', {invalid: eError}]"
            @blur="eBlur"
        >
        <label for="email">E-mail</label>
        <small
            class="helper-text invalid"
            v-if="eError"
        >{{ eError }}</small>
      </div>
      <div class="input-field">
        <input
            id="phone"
            type="text"
            v-model="phone"
            :class="['validate', {invalid: pError}]"
            @blur="pBlur"
        >
        <label for="phone">Телефон</label>
        <small
            class="helper-text invalid"
            v-if="pError"
        >{{ pError }}</small>
      </div>
      <button class="btn waves-effect waves-light auth-submit" type="submit">
        Отправить
        <i class="material-icons right">send</i>
      </button>
    </div>
  </form>
</template>

<script>
import {useStore} from 'vuex'

import {useClientForm} from '../use/client-form'

export default {
  setup(){
    const store = useStore()

    const submit = async values =>{
      const fieldName = 'clients'
      await store.dispatch('request/create', [values, fieldName])
    }
    return{
      ...useClientForm(submit)
    }
  }


}
</script>

<style scoped>

</style>