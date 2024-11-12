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
    <div class="login-container">
      <!-- Left side - Login Form -->
      <div class="form-section">
        <div class="form-content">
          <div class="text-center mb-8">
            <v-avatar color="primary" size="80" class="mb-4">
              <v-icon size="40" color="white">mdi-wallet</v-icon>
            </v-avatar>
            <h1 class="text-h4 font-weight-bold primary--text">Welcome Back</h1>
            <p class="text-body-1 text-medium-emphasis mt-1">Sign in to continue</p>
          </div>

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
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              class="login-btn mb-6"
            >
              Sign In
            </v-btn>

            <div class="social-divider">
              <span class="social-divider-text">or continue with</span>
            </div>

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

            <slot name="register-link"></slot>
          </v-form>
        </div>
      </div>

      <!-- Right side - Welcome Message -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2 class="text-h3 font-weight-bold text-white mb-4">
              GCASH Cash In, Cash Out And Load Tracker
            </h2>
            <p class="text-h6 text-white text-opacity-80">
              Manage your GCASH transactions with ease. Track your cash in, cash out, and load transactions all in one place.
            </p>
            <div class="mt-16">
              <v-icon size="120" color="white" class="welcome-icon" icon="mdi-wallet-outline"></v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%
  );
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(var(--v-theme-primary), 0.05);
}

.form-section {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  .form-content {
    width: 100%;
    max-width: 400px;
  }
}

.welcome-section {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 1) 0%,
    rgba(var(--v-theme-primary), 0.8) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 70% 30%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
  }

  .welcome-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 400px;
  }

  .welcome-icon {
    opacity: 0.9;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    animation: float 6s ease-in-out infinite;
  }
}

.login-form {
  max-width: 480px;
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

@media (max-width: 959px) {
  .login-container {
    flex-direction: column-reverse;
  }

  .welcome-section {
    padding: 40px 24px;
    
    .welcome-content {
      padding: 20px 0;
    }
  }

  .form-section {
    padding: 32px 24px;
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
