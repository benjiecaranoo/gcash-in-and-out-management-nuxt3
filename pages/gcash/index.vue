<script setup lang="ts">
import { definePageMeta } from '#imports'
import GcashListing from '~/components/GcashListing.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <v-container>
    <!-- <h1 class="text-h4 mb-4">GCASH Management</h1> -->
    <GcashListing />
  </v-container>
</template>
