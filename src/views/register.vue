<template>
  <form class="card" :class="style" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Регистрация</span>
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
      <div class="input-field">
        <input
            id="password"
            type="password"
            :class="['validate', {invalid:pError}]"
            v-model="password"
            @pBlur="pBlur"
        >
        <label for="password">Пароль</label>
        <small
            class="helper-text invalid"
            v-if="pError"
        >{{ pError }}</small>
      </div>

      <div class="input-field">
        <input
            id="name"
            type="text"
            :class="['validate', {invalid:nError}]"
            v-model="name"
            @pBlur="nBlur"
        >
        <label for="name">Имя</label>
        <small
            class="helper-text invalid"
            v-if="nError"
        >{{ nError }}</small>
      </div>

       <div class="input-field">
        <input
            id="comment"
            type="text"
            class="validate"
            v-model="comment"
            @pBlur="cBlur"
        >
        <label for="comment">Комментарий</label>
      </div>

      <div
          class="helper-text blue-text p"
          v-if="message"
      >{{ message }}
      </div>
      <div class="helper-text blue-text p">

      </div>
    </div>

    <div class="card-action">
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
            :disabled="isSubmitting"
        >
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>

        <p class="center">
          Уже есть аккаунт?
          <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import {useRegisterForm} from '../use/register-form'
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {error} from '../utils/error'

export default {
  setup(){
    const store = useStore()
    const route = useRoute()

    const style = ref('')
    const message = computed(() => store.state.message)

    if(route.query.message) {
      store.dispatch('setMessage', {
        value: error(route.query.message)
      })
    }

    if (window.innerWidth > 450) style.value = 'auth-card'

    return {...useRegisterForm(), message, style}
  }
}

</script>
<style scoped>
.p{
  padding-bottom: 10px;
}
</style>