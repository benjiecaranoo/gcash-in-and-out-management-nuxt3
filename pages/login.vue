<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import LoginForm from '~/components/LoginForm.vue'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/')
  } catch (err: any) {
    if (err.error_code === 'INVALID_CREDENTIALS') {
      error.value = 'Invalid email or password'
    } else {
      error.value = err.message || 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
  try {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`)
  } catch (err: any) {
    error.value = `${provider} login failed. Please try again.`
  }
}

definePageMeta({
  layout: 'guest'
})
</script>

<template>
  <LoginForm
    v-model:form="form"
    :loading="loading"
    :error="error"
    @submit="handleLogin"
    @social-login="handleSocialLogin"
  >
    <template #register-link>
      <div class="text-center mt-6">
        <p class="text-medium-emphasis">
          Don't have an account?
          <v-btn
            variant="text"
            color="primary"
            class="px-2 font-weight-bold"
            to="/register"
          >
            Sign Up
          </v-btn>
        </p>
      </div>
    </template>
  </LoginForm>
</template>
