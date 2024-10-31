<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useValidation } from '~/composables/useValidation'

const { validations } = useValidation()

const props = defineProps<{
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  'update:form': [form: { email: string; password: string }]
  submit: []
  'social-login': [provider: 'google' | 'facebook' | 'github']
}>()

const form = ref({
  email: '',
  password: ''
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
    emit('update:form', { ...form.value, email: value })
  }
})

const password = computed({
  get: () => form.value.password,
  set: (value) => {
    form.value.password = value
    emit('update:form', { ...form.value, password: value })
  }
})

const errors = computed<Record<string, string | undefined>>(() => {
  return Object.keys(form.value).reduce((prev, curr) => {
    prev[curr] = v$.value[curr]?.$errors[0]?.$message
    return prev
  }, {} as Record<string, string | undefined>)
})

const handleSubmit = async () => {
  if (!(await v$.value.$validate())) return
  emit('submit')
}

const showPassword = ref(false)
</script>

<template>
  <div class="login-wrapper">
    <div class="login-page">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4" class="mx-auto">
            <v-card class="login-card mx-auto" elevation="8">
              <!-- Logo/Brand Section -->
              <div class="text-center pt-12 pb-6">
                <v-avatar color="primary" size="80" class="mb-4">
                  <v-icon size="48" color="white">mdi-wallet</v-icon>
                </v-avatar>
                <h1 class="text-h4 font-weight-bold primary--text mb-2">
                  Welcome Back
                </h1>
                <p class="text-body-1 text-medium-emphasis">
                  Sign in to continue to your account
                </p>
              </div>

              <!-- Login Form -->
              <v-card-text class="pt-6">
                <v-form @submit.prevent="handleSubmit" class="login-form">
                  <v-slide-y-transition>
                    <v-alert
                      v-if="error"
                      type="error"
                      variant="tonal"
                      closable
                      class="mb-4"
                    >
                      {{ error }}
                    </v-alert>
                  </v-slide-y-transition>

                  <v-text-field
                    v-model="email"
                    :error-messages="errors.email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    required
                    autocomplete="email"
                    class="mb-2"
                  />

                  <v-text-field
                    v-model="password"
                    :error-messages="errors.password"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    required
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    autocomplete="current-password"
                    class="mb-2"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="mt-6 login-btn"
                  >
                    Sign In
                  </v-btn>

                  <!-- Social Login Divider -->
                  <div class="social-divider my-6">
                    <span class="social-divider-text">or continue with</span>
                  </div>

                  <!-- Social Login Buttons -->
                  <div class="social-buttons">
                    <v-btn
                      variant="outlined"
                      class="social-btn"
                      @click="$emit('social-login', 'google')"
                    >
                      <v-icon start color="error">mdi-google</v-icon>
                      Google
                    </v-btn>

                    <v-btn
                      variant="outlined"
                      class="social-btn"
                      @click="$emit('social-login', 'facebook')"
                    >
                      <v-icon start color="blue">mdi-facebook</v-icon>
                      Facebook
                    </v-btn>

                    <v-btn
                      variant="outlined"
                      class="social-btn"
                      @click="$emit('social-login', 'github')"
                    >
                      <v-icon start>mdi-github</v-icon>
                      GitHub
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-primary), 0.03) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    opacity: 0.4;
  }
}

.login-page {
  width: 100%;
  padding: 20px;
  position: relative;
}

.login-card {
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(var(--v-theme-primary), 0.15),
    0 2px 8px rgba(var(--v-theme-primary), 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5) !important;
  padding: 0 24px 24px;
  max-width: 460px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: inherit;
  }

  .v-avatar {
    box-shadow: 
      0 8px 32px rgba(var(--v-theme-primary), 0.2),
      inset 0 -2px 8px rgba(0, 0, 0, 0.1),
      inset 0 2px 8px rgba(255, 255, 255, 0.3);
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 1) 0%,
      rgba(var(--v-theme-primary), 0.8) 100%
    ) !important;
  }
}

.login-form {
  max-width: 360px;
  margin: 0 auto;
  position: relative;
}

:deep {
  .v-field {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(var(--v-theme-primary), 0.1);
    transition: all 0.3s ease;

    &:hover, &:focus-within {
      background: rgba(255, 255, 255, 1) !important;
      border-color: rgba(var(--v-theme-primary), 0.3);
      box-shadow: 
        0 4px 12px rgba(var(--v-theme-primary), 0.1),
        inset 0 2px 4px rgba(255, 255, 255, 0.5);
    }
  }

  .v-field__input {
    padding: 16px 16px 16px 12px !important;
  }

  .v-field__prepend-inner {
    padding-inline-start: 12px !important;
  }
}

.login-btn {
  text-transform: none;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  font-weight: 500;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 1) 0%,
    rgba(var(--v-theme-primary), 0.9) 100%
  ) !important;
  box-shadow: 
    0 4px 12px rgba(var(--v-theme-primary), 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 6px 16px rgba(var(--v-theme-primary), 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.2);
  }
}

.social-divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 60px);
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(var(--v-theme-primary), 0.05) 0%,
      rgba(var(--v-theme-primary), 0.2) 50%,
      rgba(var(--v-theme-primary), 0.05) 100%
    );
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  &-text {
    background: rgba(255, 255, 255, 0.9);
    padding: 0 16px;
    color: rgba(var(--v-theme-primary), 0.7);
    font-size: 0.875rem;
    position: relative;
  }
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  .social-btn {
    text-transform: none;
    font-weight: 500;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(var(--v-theme-primary), 0.1);
    box-shadow: 
      0 2px 8px rgba(var(--v-theme-primary), 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 
        0 4px 12px rgba(var(--v-theme-primary), 0.15),
        inset 0 1px 2px rgba(255, 255, 255, 0.4);
    }

    .v-icon {
      margin-right: 8px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }
}

@media (max-width: 600px) {
  .social-buttons {
    grid-template-columns: 1fr;
  }

  .social-divider {
    &::before,
    &::after {
      width: calc(50% - 80px);
    }
  }

  .login-card {
    margin: 16px;
    padding: 0 16px 16px;
  }
}

/* Animation keyframes */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.v-avatar {
  animation: float 6s ease-in-out infinite;
}

/* Transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
