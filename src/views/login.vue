<template>
  <form class="card" :class="style" @submit.prevent="onSubmit">
    <div class="card-content">
      <span class="card-title">Вход</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          :class="['validate', { invalid: eError }]"
          v-model="email"
          @blur="eBlur"
        />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="eError">{{ eError }}</small>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          :class="['validate', { invalid: pError }]"
          v-model="password"
          @Blur="pBlur"
        />
        <label for="password">Пароль</label>
        <small class="helper-text invalid" v-if="pError">{{ pError }}</small>
      </div>
      <div>
        <div class="helper-text invalid" v-if="isToManyAttempts">
          Вы слишком часто пытаетесть войти в систему. Попробуйте позже
        </div>
        <div class="helper-text invalid" v-else-if="message">
          {{ message.value }}
        </div>
      </div>
    </div>
    <div class="card-action">
      <button
        class="btn waves-effect waves-light auth-submit"
        type="submit"
        :disabled="isSubmitting || isToManyAttempts"
      >
        Войти
        <i class="material-icons right">send</i>
      </button>
      <p class="center">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
      <p class="center">
        Забыл пароль?
        <router-link to="/forget">Восстановить</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { useLoginForm } from "../use/login-form";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { error } from "../utils/error";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();

    const message = computed(() => store.state.message);
    const style = ref("");
    if (route.query.message) {
      store.dispatch("setMessage", {
        value: error(route.query.message),
      });
    }
    if (window.innerWidth > 450) style.value = "auth-card";
    return { ...useLoginForm(), message, style };
  },
};
</script>