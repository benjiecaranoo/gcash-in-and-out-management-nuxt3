<script setup lang="ts">
import { definePageMeta } from '#imports'
import GcashListing from '~/components/GcashListing.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="app-background-animated">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" class="mx-auto">
          <GcashListing />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.v-container {
  max-width: 1440px;
}
</style>
