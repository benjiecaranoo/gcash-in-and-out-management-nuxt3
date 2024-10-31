import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // If the user is not authenticated and trying to access a protected route
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If the user is authenticated and trying to access the login page
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})