<template>
  <loader v-show="loading" />
  <ul v-show="!loading" class="collapsible" ref="div">
    <li>
      <div class="collapsible-header">
        <i class="material-icons">assignment_ind</i>
        Запросы на регистрацию
        <span class="badge">{{ users.length }}</span>
      </div>

      <div class="collapsible-body">
        <table class="striped responsive-table centered" v-if="users.length">
          <thead>
            <tr>
              <th></th>
              <th>E-mail</th>
              <th>Имя</th>
              <th>Дата запроса</th>
              <th>Комментарий</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, i) in users" :key="i">
              <td>
                <a
                  class="btn-floating btn-small waves-effect waves-light green"
                  @click.prevent="registerUser(user)"
                >
                  <i class="material-icons">add</i>
                </a>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.date }}</td>
              <td>{{ user.comment }}</td>
              <td>
                <a
                  class="btn-floating btn-small waves-effect waves-light"
                  @click.prevent="refuseUser(user.id)"
                >
                  <i class="material-icons red">backspace</i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="">Запросов пока нет</div>
      </div>
    </li>
  </ul>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Loader from "../../ui/Loader";

export default {
  emits: ["reload"],
  setup(_, context) {
    const store = useStore();
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      await store.dispatch("user/loadUnregisteredUsers");
      // console.log(...users.value)
      loading.value = false;
    });

    const refuseUser = async (id) => {
      await store.dispatch("auth/refuseUser", id);
      store.dispatch("toast", "Пользователь отклонен");
    };

    const reload = async () => {
      loading.value = true;
      await store.dispatch("user/loadUnregisteredUsers");
      context.emit("reload");
      loading.value = false;
    };

    const registerUser = async (user) => {
      await store.dispatch("auth/registerUser", user);
      reload();
    };
    const users = computed(() => store.state.user.unregisteredUsers);
    return { loading, refuseUser, users, registerUser };
  },

  components: { Loader },

  mounted() {
    this.div = M.Collapsible.init(this.$refs.div);
  },
  unmounted() {
    if (this.div && this.div.destroy) this.div.destroy();
  },
};
</script>

<style scoped>
</style>