<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('bar')">
          <i class="material-icons black-text">dehaze</i>
        </a>
      </div>

      <ul class="right">
        <li>
          <a
              class="dropdown-trigger black-text"
              href="#"
              data-target="dropdown"
              ref="dropdown"
          >
            {{ name ? name.name : ''}}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id='dropdown' class='dropdown-content'>
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>Профиль
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>


</template>

<script>
import {onMounted, onBeforeUnmount, ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

export default {
  emits:['bar'],
  setup() {
    const router = useRouter()
    const store = useStore()

    onMounted(async () => {
      await store.dispatch('user/loadUserInfo')
    })
    const name = computed(() => store.getters['user/userInfo'])

    onBeforeUnmount( async () =>{

    })
    return {
      logout: () => {
        store.dispatch('auth/logout')
        router.push('/login')
      },
      name
    }
  },
  mounted() {
   this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false
    })
  },
  onBeforeUnmount() {
    clearInterval(this.interval)
    if(this.dropdown && this.dropdown.destroy){
      this.dropdown.destroy()
    }
    console.log('Before destroy')
  }
}
</script>
<style scoped>


</style>