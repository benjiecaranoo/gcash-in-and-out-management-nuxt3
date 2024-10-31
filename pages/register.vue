<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import RegistrationForm from '~/components/RegistrationForm.vue'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form.value)
    router.push('/')
  } catch (err: any) {
    if (err.errors) {
      // Handle validation errors
      error.value = Object.values(err.errors)[0] as string
    } else {
      error.value = err.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'guest'
})
</script>

<template>
  <RegistrationForm
    v-model:form="form"
    :loading="loading"
    :error="error"
    @submit="handleRegister"
  >
    <template #login-link>
      <div class="text-center mt-6">
        <p class="text-medium-emphasis">
          Already have an account?
          <v-btn
            variant="text"
            color="primary"
            class="px-2 font-weight-bold"
            to="/login"
          >
            Sign In
          </v-btn>
        </p>
      </div>
    </template>
  </RegistrationForm>
</template> 