<template>
  <div class="app-main-layout">
    <nav-bar @bar="isOpen = !isOpen" />

    <side-bar @bar="isOpen = !isOpen" :isOpen="isOpen" />

    <main class="app-content" :class="{ full: !isOpen }">
      <div class="app-page">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from "vue";

import NavBar from "@/components/admin/app/navbar";
import SideBar from "@/components/admin/app/sidebar";

export default {
  setup() {
    const isOpen = ref(false);

    return { isOpen };
  },
  name: "admin-layout",
  components: {
    NavBar,
    SideBar,
  },
};
</script>
<style scoped>
</style>