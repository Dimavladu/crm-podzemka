import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'


const routes = [
  {
    path: '/tasks',
    name: 'tasks',
    meta: {
      layout: 'main',
      auth: true
    },
    component: () => import('../views/tasks')
  },
  {
    path: '/tasks/self/:id',
    name: 'self',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('../views/task'),
  },
  {
    path: '/tasks/worker/:id',
    name: 'worker',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('../views/userTask'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'empty' },
    component: () => import('../views/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: { layout: 'empty' },
    component: () => import('../views/register')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: { layout: 'empty' },
    component: () => import('../views/forget')
  },
  {
    path: '/client',
    name: 'client',
    meta: { layout: 'empty' },
    component: () => import('../views/client')
  },
  {
    path: '/clients',
    name: 'clients',
    meta: {
      layout: 'main',
      auth: true
    },
    component: () => import('../views/clients')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: 'main',
      auth: true
    },
    component: () => import('../views/profile')
  },
  {
    path: '/calendar',
    name: 'calendar',
    alias: '/',
    meta: {
      layout: 'main',
      auth: true
    },
    component: () => import('../views/calendar')
  },
  {
    path: '/createTask',
    name: 'createTask',
    meta: {
      layout: 'main',
      auth: true
    },
    component: () => import('../views/createTask')
  },
  {
    path: '/users',
    name: 'users',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('../views/users')
  },
  {
    path: '/users/:id',
    name: 'user',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('../views/user')
  },
  {
    path: '/calendarAdmin/:id',
    name: 'meet',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/Meet')
  },
  {
    path: '/usersAdmin',
    name: 'usersAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/users')
  },
  {
    path: '/usersAdmin/:id',
    name: 'userAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/user')
  },
  {
    path: '/profileAdmin',
    name: 'profileAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/profile')
  },
  {
    path: '/tasksAdmin',
    name: 'tasksAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/tasks'),
  },
  {
    path: '/tasksAdmin/self/:id',
    name: 'selfAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true,
    },
    component: () => import('../views/task'),
  },
  {
    path: '/tasksAdmin/main/:id',
    name: 'mainAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true,
    },
    component: () => import('../components/admin/views/userTask'),
  },
  {
    path: '/tasksAdmin/worker/:id',
    name: 'workerAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true,
    },
    component: () => import('../views/userTask'),
  },
  {
    path: '/createTaskAdmin',
    name: 'createTaskAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/createTask')
  },
  {
    path: '/calendarAdmin',
    name: 'calendarAdmin',
    meta: {
      layout: 'admin',
      auth: true,
      admin: true
    },
    component: () => import('../components/admin/views/calendar')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.meta.auth
  const requireAdmin = to.meta.admin
  if (requireAuth && store.getters['auth/isAuthenticated']) {
    await store.dispatch('auth/setUpdated')
    if (requireAdmin && store.state.auth.admin) {
      await store.dispatch('auth/checkAdmin')
      next()
    }
    else if (requireAdmin && !store.state.auth.admin) next('login?message=admin')
    else next()
  }
  else if (requireAuth && !store.getters['auth/isAuthenticated']) next('login?message=auth')
  else next()
})

export default router
