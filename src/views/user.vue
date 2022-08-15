<template>
  <Loader v-if="loading"></Loader>
  <div v-else class="">
    <div class="page-title">
      <h3 :class="user.role === 'ADMIN' ? 'red-text' : ''">
        {{ user.info?.name }} {{ user.info?.lastName }} {{ user.info?.midName }}
      </h3>
    </div>
    <div class="row">
      <div class="col">
        <div v-if="!user.url" class="border">
          <Loader></Loader>
        </div>
        <img
          v-else-if="user.url"
          :src="user.url"
          width="160"
          class="border"
          alt=""
        />
      </div>
      <div class="col">
        <div class="flow-text">{{ user.info.birthday }}</div>
        <div class="flow-text">
          {{ user.info.position }}
          <a @click.prevent="copyText(user.info.phone)" href="">{{
            user.info.phone
          }}</a>
        </div>
        <div class="flow-text">
          <a @click.prevent="copyText(user.info.email)" href="">{{
            user.info.email
          }}</a>
        </div>
        <blockquote class="col12">{{ user.info.status }}</blockquote>
      </div>
    </div>

    <table class="centered highlight" v-if="tasks.length">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Дата</th>
          <th>Время</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in tasks" :key="i">
          <td>{{ r.name }}</td>
          <td>{{ r.date.fullDate }}</td>
          <td>{{ r.date.dateString }}</td>
          <td :class="r.color + '-text'">{{ r.status }}</td>
        </tr>
      </tbody>
    </table>
    <div class="center-align" v-else>Задач пока нет</div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

import Loader from "../components/ui/Loader";
import TheTask from "../components/task/TheTask";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const loading = ref(true);

    const user = ref();

    onMounted(async () => {
      loading.value = true;
      user.value = await store.dispatch(
        "user/loadAllUserInfo",
        route.params.id
      );
      await store.dispatch("task/loadTasks", route.params.id);
      loading.value = false;
    });

    const copyText = (text) => {
      navigator.clipboard.writeText(text);
      store.dispatch("toast", "Скопировано");
    };

    const tasks = computed(() => store.state.task.tasks);

    return {
      loading,
      user,
      copyText,
      tasks,
    };
  },
  components: { Loader, TheTask },
  mounted() {
    this.img = M.Materialbox.init(this.$refs.img);
  },
  unmounted() {
    if (this.img && this.img.destroy) this.img.destroy();
  },
};
</script>

<style scoped>
.border {
  border: solid;
  border-radius: 10px;
}
.mt {
  margin-top: 10px;
}
</style>