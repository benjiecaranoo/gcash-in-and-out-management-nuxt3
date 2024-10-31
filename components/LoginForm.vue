<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { useAuthStore } from '~/stores/auth'
  import { useValidation } from '~/composables/useValidation'

  const { validations } = useValidation();

  const authStore = useAuthStore()
  const loginError = ref<string | null>(null)

  const form = ref({
    email: 'ghill@example.net',
    password: 'password',
  })

  const rules = {
    email: {
      required: validations.required('Email'),
    },
    password: {
      required: validations.required('Password'),
      minLength: validations.minLength('Password', 6),
    },
  }
  const v$ = useVuelidate(rules, form, { $autoDirty: true })
  
  const email = computed({
    get: () => form.value.email,
    set: (value) => {
      form.value.email = value
    }
  })
  const password = computed({
    get: () => form.value.password,
    set: (value) => {
      form.value.password = value
    }
  })

  
  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) return;
    try {
      await authStore.login(email.value, password.value)

      navigateTo('/', { replace: true })
    } catch (error) {
      console.log(error)
      if (error.error_code === 'INVALID_CREDENTIALS') {
        loginError.value = 'Invalid email or password'
      }
    }
  }

  const errors = computed<Record<string, string | undefined>>(() => {
    loginError.value = ''
    return Object.keys(form.value).reduce((prev, curr) => {
      prev[curr] = v$.value[curr]?.$errors[0]?.$message;
      return prev;
    }, {} as Record<string, string | undefined>);
  })

</script>
<template>
  <v-container class="align-center py-8" width="50%">
    <v-form @submit.prevent="handleSubmit" class="space-y-4 mx-auto max-w-md">
      <v-img src="../assets/img/logo.png" width="48px" height="48px" class="mb-12 mx-auto" />
      <v-row no-gutters>
        <v-col>
        <v-text-field 
          v-model="email" 
          type="email" 
          id="email"
          required
          :error-messages="errors.email"
          class="mt-1"
          label="Email"
        />
        </v-col>
      </v-row>
      <v-row no-gutters>
      <v-col>
          <v-text-field 
            v-model="password"
            type="password"
            required
            :error-messages="errors.password || loginError"
            class="mt-1"
            label="Password"
            />
        </v-col>
      </v-row>
      <div class="text-center">
        <v-btn type="submit" class="mt-4">Log in</v-btn>
      </div>
    </v-form>
  </v-container>
</template>
