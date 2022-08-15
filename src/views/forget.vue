<template>

  <form class="card" :class="style" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Восстановление пароля</span>
      <div class="input-field">
        <input
            id="email"
            type="text"
            :class="['validate', {invalid:eError}]"
            v-model="email"
            @blur="eBlur"
        >
        <label for="email">Email</label>
        <small
            class="helper-text invalid"
            v-if="eError"
        >{{ eError }}</small>
      </div>
      <div
          class="helper-text blue-text p"
          v-if="message"
      >{{ message }}
      </div>
    </div>

    <div class="card-action">

        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
            :disabled="isSubmitting"
        >
          Восстановить
          <i class="material-icons right">send</i>
        </button>
        <p class="center">
          Вспомнили пароль?
          <router-link to="/login">Войти!</router-link>
        </p>
      </div>

  </form>
</template>

<script>

import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useForgetForm} from '../use/forget-form'

export default {
  setup(){
    const store = useStore()

    const style = ref('')

    const message = computed(() => store.state.message)
    if (window.innerWidth > 450) style.value = 'auth-card'

    return{ ...useForgetForm(), message, style }
  }

}
</script>

<style scoped>

</style>