<template>
  <loader v-if="loading"></loader>
  <div v-else-if="!loading">
    <div class="page-title">
      <h3 :class="req.color === 'white' ? 'black-text': req.color + '-text'">
        <strong>{{ req.name }} {{ req.format }}</strong>
      </h3>
    </div>
      <form @submit.prevent="onSubmit" class="">
        <div class="row">

          <icon-input s="4" icon="account_circle" labelName="Заказчик" for="name">
            <input v-model="req.name" id="name" type="text" class="validate">
          </icon-input>

          <icon-input s="4" icon="label" labelName="Формат" for="format">
            <input v-model="req.format" id="format" type="tel" class="validate">
          </icon-input>

          <icon-input s="4" icon="local_phone" labelName="Телефон" for="phone">
            <input v-model="req.phone" id="phone" type="tel" class="validate">
          </icon-input>

          <div class="input-field col m4 s12 ">
            <v-date-picker
                v-model="req.dateStart"
                mode="dateTime"
                :minute-increment="5"
                :model-config="modelConfig"
                is24hr >
              <template v-slot="{ inputValue, inputEvents }">
                <i class="material-icons prefix pt-25">date_range</i>
                <label>Начало мероприятия</label>
                <input
                    class="bg-white border px-2 py-1 rounded"
                    :value="inputValue"
                    v-on="inputEvents"
                />
              </template>
            </v-date-picker>
          </div>
          <div class="input-field col m4 s12">
            <v-date-picker
                v-model="req.dateEnd"
                mode="dateTime"
                :minute-increment="5"
                :model-config="modelConfig"
                is24hr >
              <template v-slot="{ inputValue, inputEvents }">
                <i class="material-icons prefix pt-25">arrow_forward</i>
                <label>Конец мероприятия</label>
                <input
                    class="bg-white border px-2 py-1 rounded"
                    :value="inputValue"
                    v-on="inputEvents"
                />
              </template>
            </v-date-picker>
          </div>
          <div class="input-field col m4 s12" >
            <v-date-picker
                v-model="req.dateContract"
                mode="dateTime"
                :minute-increment="5"
                :model-config="modelConfig"
                is24hr >
              <template v-slot="{ inputValue, inputEvents }">
                <i class="material-icons prefix pt-25">create</i>
                <label>Дата подписания договора</label>
                <input
                    class="bg-white border px-2 py-1 rounded"
                    :value="inputValue"
                    v-on="inputEvents"
                />
              </template>
            </v-date-picker>
          </div>

          <Upload
              span="Договор"
              placeholder="Загрузите договор"
              :url="req.urlfileNameContract"
              :name="req.fileNameContract"
              v-if="isVisible "
              @load="load"
              folder="contract"
              fieldName="fileNameContract"
          ></Upload>
          <Upload
              span="Рассадка"
              placeholder="Загрузите рассадку"
              :url="req.urlfileNameRoom"
              :name="req.fileNameRoom"
              v-if="isVisible"
              @load="load"
              folder="room"
              fieldName="fileNameRoom"
          ></Upload>
          <icon-input s="6" icon="assignment" labelName="Договор" for="contract">
            <input v-model="req.contract" id="contract" type="text" class="validate">
          </icon-input>

          <div class="input-field col m6 s12">
            <i class="material-icons prefix">room</i>
            <select v-model="req.choice" ref="select">
              <option value="Концертный">Концертный</option>
              <option value="Особенный">Особенный</option>
              <option value="Правда">Правда</option>
            </select>
            <label>Выберите зал</label>
          </div>

          <icon-input s="6" icon="people_outline" labelName="Ожидаемое количество людей" for="people">
            <input id="people" type="number" class="validate" v-model.number="req.people">
          </icon-input>

          <icon-input s="6" icon="attach_money" labelName="Предоплата" for="prePaid">
            <input id="prePaid" type="number" class="validate" v-model="req.prePaid">
          </icon-input>

          <icon-input s="6" icon="attach_money" labelName="Общая сумма" for="Cost">
             <input id="Cost" type="number" class="validate" v-model.number="req.cost">
          </icon-input>

          <icon-input s="6" icon="money_off" labelName="Остаток по оплате" for="resPaid">
            <input disabled id="resPaid" type="number" class="validate" :value="req.resPaid">
          </icon-input>

          <icon-input s="12" icon="comment" labelName="Комментарий" for="comment">
            <textarea v-model="req.comment" id="comment" class="validate materialize-textarea"/>
          </icon-input>

        </div>
        <button
            class="waves-effect waves-light" :class="!isVisible ? 'btn-small' : 'btn'"
            type="submit">
          <i class="material-icons left ">cloud</i>Изменить
        </button>

        <button
            class="waves-effect waves-light red right" :class="!isVisible ? 'btn-small' : 'btn'"
            @click="remove">
          <i class="material-icons right ">delete_forever</i>Удалить
        </button>
      </form>

    </div>
</template>

<script>
import {ref, watch, onMounted, onUpdated} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'

import Loader from '../../ui/Loader'
import Upload from '../Meet/upload'
import IconInput from '../Meet/MeetIconInput'

export default {
  setup(){
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const modelConfig = ref({
      type: 'string',
      mask: 'YYYY-MM-DD, HH:mm'
    })

    const loading = ref(true)
    const req = ref({})
    const width = ref(0)
    const isVisible = ref(true)
    let select = ref('')

    const checkResize = () => {
      width.value = window.innerWidth
      if (width.value <= 600) isVisible.value = false
      else isVisible.value = true
    }
    window.addEventListener('resize', checkResize)
    checkResize()

    const onSubmit = async () => {
      if (req.value.urlfileNameRoom || req.value.urlfileNameContract) {
        delete req.value.urlfileNameRoom
        delete req.value.urlfileNameContract
      }
      await store.dispatch('request/change', [req.value, route.name, route.params.id])
      load()
    }

    const remove = async () =>{
      await store.dispatch('request/remove', [route.name, route.params.id])
      router.push({name: 'calendarAdmin'})
    }

    onMounted( async () => await load())
    onUpdated(() => select.value = M.FormSelect.init(select.value))

    const load = async () => {
      loading.value = true
      req.value = await store.dispatch('request/loadOne', [route.name, route.params.id])
      loading.value = false
    }

    return { modelConfig, onSubmit, req, remove,
      loading, select, width, load, isVisible }
  },
  unmounted(){
    window.removeEventListener('resize', this.handleResize)
    if(this.select && this.select.destroy){
      this.select.destroy()
    }
  },
  components: {Loader, Upload, IconInput}
}
</script>

<style scoped>
.pt-25{
  padding-top: 25px;
}
.ml{
  margin-left: 50px;
}
.mr{
  margin-right: 10px;
}
.mb{
  margin-bottom: 25px;
}
</style>