<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '~/components/Navbar.vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Fetch user data on component mount
const fetchUser = async () => {
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('Error fetching user:', error)
    if (error.response?.status === 401) {
      await authStore.logout()
      router.push('/login')
    }
  }
}

fetchUser()
</script>
<template>
  <v-layout>
    <v-main>
      <Navbar />
      <NuxtPage />
    </v-main>
  </v-layout>
</template>

<style>
.v-application {
  background: transparent !important;
}
</style>