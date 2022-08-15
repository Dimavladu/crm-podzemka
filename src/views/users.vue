<template>
  <div class="page-title">
    <h3>Сотрудники</h3>
    <button class="waves-effect waves-light btn" @click.prevent="reload">
      <i class="material-icons">autorenew</i>
    </button>
  </div>

  <Loader v-if="loadingUsers"></Loader>
  <usersList v-else />
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

import usersList from "../components/user/usersList";
import Loader from "../components/ui/Loader";

export default {
  setup() {
    const store = useStore();
    const loadingUsers = ref(false);

    onMounted(async () => {
      loadingUsers.value = true;
      await store.dispatch("user/getUsersInfo");
      loadingUsers.value = false;
    });
    const reload = async () => {
      loadingUsers.value = true;
      await store.dispatch("user/getUsersInfo");
      loadingUsers.value = false;
    };

    return { loadingUsers, reload };
  },
  components: { Loader, usersList },
};
</script>

<style scoped>
</style>