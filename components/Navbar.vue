<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { HomeIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const isDrawerOpen = ref(false)
const router = useRouter()
const toggleDrawer = () => isDrawerOpen.value = !isDrawerOpen.value

const isAuthenticated = computed(() => authStore.isAuthenticated)

const authRoutes = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Manage GCASH', href: '/gcash', icon: ChartBarIcon },
]

const userLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Fetch user data on component mount
const fetchUser = async () => {
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('Error fetching user:', error)
    // Optionally handle error (e.g., redirect to login if unauthorized)
    if (error.response?.status === 401) {
      await userLogout()
    }
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUser()
  }
})
</script>

<template>
  <div>
    <!-- App Bar - Only show on mobile and tablet -->
    <v-app-bar 
      flat 
      elevation="0" 
      v-if="isAuthenticated && $vuetify.display.smAndDown" 
      color="primary" 
      class=""
    >
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title class="text-center">Gcash In and Out Tracker</v-toolbar-title>
    </v-app-bar>

    <!-- Navigation Drawer - Only show when authenticated -->
    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="isDrawerOpen"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
      color="primary"
      class="modern-drawer"
      :rail="$vuetify.display.lgAndUp"
      :rail-width="56"
    >
      <!-- User Profile Section -->
      <div class="px-4 py-4">
        <div class="d-flex align-center">
          <v-avatar size="42" class="mr-3">
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-medium text-white mb-n1">
              {{ authStore.user?.name || 'User' }}
            </div>
            <div class="text-caption text-white text-opacity-70">
              {{ authStore.user?.email || 'user@example.com' }}
            </div>
          </div>
        </div>
      </div>

      <v-divider class="border-opacity-10 my-2" />

      <!-- Navigation Links -->
      <v-list nav class="px-2 py-2">
        <v-list-item
          v-for="route in authRoutes"
          :key="route.name"
          :to="route.href"
          :prepend-icon="route.icon"
          :title="route.name"
          rounded="lg"
          class="mb-2"
          min-height="44"
          active-color="white"
          :class="{ 'active-route': $route.path === route.href }"
        >
          <template v-slot:prepend>
            <v-icon :icon="route.icon" size="22" class="ml-1" />
          </template>
        </v-list-item>
      </v-list>

      <!-- Logout List Item -->
      <div class="px-2 mt-auto">
        <v-divider class="border-opacity-10 mb-3" />
        <v-list-item
          @click="userLogout"
          rounded="lg"
          class="logout-item mb-2"
          min-height="44"
          active-color="white"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-logout" size="22" class="ml-1" />
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-toolbar__content) {
  max-width: 1440px;
  margin: auto;
}

.modern-drawer {
  border-right: 0 !important;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.v-navigation-drawer__content) {
    background: linear-gradient(180deg, rgba(var(--v-theme-primary), 1) 0%, rgba(var(--v-theme-primary), 0.95) 100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .v-list {
    flex: 1;

    .v-list-item {
      transition: all 0.3s ease;
      padding: 0 12px;

      &:not(.active-route) {
        background: transparent !important;
        color: rgba(255, 255, 255, 0.7) !important;

        .v-icon {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;

          .v-icon {
            color: white !important;
          }
        }
      }

      &.active-route {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        font-weight: 500;

        .v-icon {
          color: white !important;
        }
      }
    }
  }

  .logout-item {
    padding: 0 12px;
    opacity: 0.85;
    transition: all 0.3s ease;

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;

      .v-icon {
        color: white !important;
        transform: translateX(4px);
      }
    }

    .v-icon {
      transition: transform 0.3s ease;
    }
  }
}

.v-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
