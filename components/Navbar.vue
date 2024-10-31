<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { HomeIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth'],
})

const authStore = useAuthStore()
const isDrawerOpen = ref(false)
const router = useRouter()
const toggleDrawer = () => isDrawerOpen.value = !isDrawerOpen.value

isDrawerOpen.value = authStore.isAuthenticated

const authRoutes = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Manage GCASH', href: '/gcash', icon: ChartBarIcon },
  // { name: 'Projects', href: '/projects', icon: FolderIcon },
  // { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  // { name: 'Documents', href: '/documents', icon: InboxIcon },
  // { name: 'Reports', href: '/reports', icon: ChartBarIcon },
]

const userLogout = async () => {

  await authStore.logout()
  router.push('/login')
}
</script>
<template>
  <div>
    <v-app-bar flat elevation="0" v-if="isAuthenticated" color="primary" class="">
      <v-app-bar-nav-icon @click="toggleDrawer" v-if="$vuetify.display.smAndDown" />
      <!-- <v-app-bar-nav-icon>
        <v-img src="../logo.png" width="48px" height="48px" class="mb-12" /> -->
      <v-toolbar-title class="text-center">Gcash In and Out Tracker</v-toolbar-title>
    </v-app-bar>
      <v-navigation-drawer
        v-if="isAuthenticated"
        v-model="isDrawerOpen"
        :permanent="$vuetify.display.mdAndUp"
        :temporary="$vuetify.display.smAndDown"
        color="primary"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            :title="authStore.user?.name || 'User'"
            :subtitle="authStore.user?.email || 'user@example.com'"
          />
        </v-list>

        <v-divider />
        <v-list nav>
          <v-list-item 
            v-for="route in authRoutes" 
            :key="route.name" 
            :prepend-icon="route.icon" 
            :title="route.name" 
            :to="route.href" 
          />
        </v-list>
        <v-spacer/>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block prepend-icon="mdi-logout" flat @click="userLogout()">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-toolbar__content) {
  max-width: 1440px;
  margin: auto;
}
</style>
