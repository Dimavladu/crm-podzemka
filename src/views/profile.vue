<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>
    <div class="row">
      <form ref="form" class="file-field input-field col s10">
        <div class="btn">
          <span>Фото</span>
          <input
              type="file"
              ref="file"
          >
        </div>
        <div class="file-path-wrapper">
          <input class="file-path validate" type="text" placeholder="Загрузите фотографию">
          <span class="helper-text invalid" v-if="invalidPhoto">Выберите фотографию</span>
        </div>
      </form>
      <a class="btn-large col s2"
         @click="uploadPhoto"
      >
        <i class="material-icons ">send</i>
      </a>
    </div>
    <form @submit.prevent="addInfo">
      <div class="row">
        <div class="col s12 p">
          <v-date-picker v-model="userInfo.birthday" :model-config="modelConfig">
            <template v-slot="{ inputValue, inputEvents }" >
              <label for="phone" :class="userInfo.birthday ? 'active': '' ">День рождения</label>
              <input
                  :value="inputValue"
                  v-on="inputEvents"
              />
              <span class="helper-text invalid" v-if="!userInfo.birthday">Введите дату рождения</span>
            </template>
          </v-date-picker>
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="name"
              type="text"
              v-model="userInfo.name"
          >
          <label for="name" :class="userInfo.name ? 'active': '' ">Имя</label>
          <span class="helper-text invalid" v-if="!userInfo.name">Введите имя</span>
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="lastName"
              type="text"
              v-model="userInfo.lastName"
          >
          <label for="lastName" :class="userInfo.lastName ? 'active': '' ">Фамилия</label>
          <span class="helper-text invalid" v-if="!userInfo.lastName">Введите Фамилию</span>
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="midName"
              type="text"
              v-model="userInfo.midName"
          >
          <label for="midName" :class="userInfo.midName ? 'active': '' ">Отчество</label>
          <span class="helper-text invalid" v-if="!userInfo.midName">Введите Отчество</span>
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="phone"
              type="text"
              v-model="userInfo.phone"
          >
          <label for="phone" :class="userInfo.phone ? 'active': '' ">Телефон</label>
          <span class="helper-text invalid" v-if="!userInfo.phone">Введите номер телефона, начиная с 7</span>
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="email"
              type="email"
              v-model="userInfo.email"
              disabled
          >
          <label for="phone" :class="userInfo.email ? 'active': '' ">Почта</label>
          <!--          <span class="helper-text invalid"></span>-->
        </div>
        <div class="input-field active col s4" :class="width">
          <input
              id="position"
              type="text"
              v-model="userInfo.position"
          >
          <label for="phone" :class="userInfo.position ? 'active': '' ">Должность</label>
          <span class="helper-text invalid" v-if="!userInfo.position">Введите вашу должность</span>
        </div>
        <div class="input-field active col s12">
          <input
              id="status"
              type="text"
              v-model="userInfo.status"
          >
          <label for="phone" :class="userInfo.status ? 'active': '' ">Статус</label>
          <span class="helper-text invalid" v-if="!userInfo.status">Введите ваш статус</span>
        </div>

        <button class="btn waves-effect waves-light col" :class="width" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </div>

    </form>
  </div>
</template>
<script>
import {ref, onMounted, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import Loader from '../components/ui/Loader'

export default {
  setup(){
    const store = useStore()
    const route = useRoute()

    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD'
    })
    let userInfo = ref({})
    const width = ref('')
    const loading = ref(false)
    const file = ref()
    const invalidPhoto = ref(false)

    onMounted(async ()=>{
      if(window.innerWidth <= 450) width.value = 's12'
      loading.value = true
      try {
        const req = await store.dispatch('user/loadUserInfo')
        userInfo.value = await req
      }
      catch (e) {
        userInfo.value.name = 'Пользователь'
      }
      loading.value = false
    })

    const addInfo = async () => {
      await store.dispatch('user/setUserInfo', userInfo.value)
      store.dispatch('toast', 'Информация успешно обновлена')
    }

    const uploadPhoto = async () => {
      if (!file.value.files[0]) invalidPhoto.value = true
      else{
        await store.dispatch('user/addPhoto', [route.params.id, file.value.files[0]])
        store.dispatch('toast', 'Фотография успешно загружена')
      }
    }

    return{
      userInfo, loading, addInfo, modelConfig, width, uploadPhoto, file, invalidPhoto
    }
  },
  components: {Loader}
}
</script>
<style scoped>
.p{
  padding-bottom: 20px;
}
</style>