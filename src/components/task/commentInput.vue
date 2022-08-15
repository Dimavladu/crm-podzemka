<template>
  <div class="input-field flex">
    <form ref="form" class="file-field input-field">
      <div class="waves-effect waves-light btn-flat">
        <i class="material-icons">attach_file</i>
        <input type="file" ref="file" @change="uploadFile" />
      </div>
    </form>
    <input
      v-model="comment"
      id="comment"
      type="text"
      class="validate"
      placeholder="Введите комментарий"
    />
    <a class="btn-large" @click="$emit('addComment', comment)">
      <i class="material-icons">send</i>
    </a>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  props: ["comment", "name", "staff", "main"],
  emits: ["addComment"],
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const file = ref();
    const uploadFile = async () => {
      await store.dispatch("task/addPhoto", [
        route.params.id,
        file.value.files[0],
        props.name,
        props.staff,
        props.main,
      ]);
      store.dispatch("toast", "Фото успешно прикреплено");
      if (route.meta.layout === "admin") router.push({ name: "tasksAdmin" });
      else if (route.meta.layout === "main") router.push({ name: "tasks" });
    };
    return { uploadFile, file };
  },
};
</script>

<style scoped>
</style>