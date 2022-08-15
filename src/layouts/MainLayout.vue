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
import NavBar from "@/components/app/navbar";
import SideBar from "@/components/app/sidebar";

export default {
  name: "main-layout",
  data: () => ({
    isOpen: false,
  }),
  components: {
    NavBar,
    SideBar,
  },
};
</script>
<style scoped>
</style>