<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
console.log(user.value)
// Fetch user data if not already available
if (!user.value) {
  authStore.fetchUser()
}
</script>
<template>
  <v-container class="pa-10">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>Welcome, {{ user?.name }}!</v-card-title>
          <v-card-text>
            <p>User Information</p>
            <p>Personal details and application.</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>User Details</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>Full name:</v-list-item-content>
                    <v-list-item-content>{{ user?.name }}</v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>Email address:</v-list-item-content>
                    <v-list-item-content>{{ user?.email }}</v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>User ID:</v-list-item-content>
                    <v-list-item-content>{{ user?.id }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
