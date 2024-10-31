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
  'update:form': [form: { name: string; email: string; password: string; password_confirmation: string }]
  submit: []
}>()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const rules = {
  name: {
    required: validations.required('Name'),
    minLength: validations.minLength('Name', 3)
  },
  email: {
    required: validations.required('Email'),
    email: validations.email()
  },
  password: {
    required: validations.required('Password'),
    minLength: validations.minLength('Password', 6)
  },
  password_confirmation: {
    required: validations.required('Password confirmation'),
    sameAsPassword: validations.sameAs('Password confirmation', 'password')
  }
}

const v$ = useVuelidate(rules, form, { $autoDirty: true })

const handleSubmit = async () => {
  if (!(await v$.value.$validate())) return
  emit('submit')
}

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
</script>

<template>
  <div class="login-wrapper">
    <div class="login-page">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
            <v-card class="login-card mx-auto" elevation="8">
              <!-- Logo/Brand Section -->
              <div class="text-center pt-16 pb-8">
                <v-avatar color="primary" size="96" class="mb-6">
                  <v-icon size="56" color="white">mdi-account-plus</v-icon>
                </v-avatar>
                <h1 class="text-h3 font-weight-bold primary--text mb-3">
                  Create Account
                </h1>
                <p class="text-h6 text-medium-emphasis">
                  Sign up to get started
                </p>
              </div>

              <!-- Registration Form -->
              <v-card-text class="pt-8 px-6">
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
                    v-model="form.name"
                    :error-messages="v$.name.$errors.map(e => e.$message)"
                    label="Full Name"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    required
                    class="mb-2"
                    @update:modelValue="$emit('update:form', { ...form, name: $event })"
                  />

                  <v-text-field
                    v-model="form.email"
                    :error-messages="v$.email.$errors.map(e => e.$message)"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    required
                    autocomplete="email"
                    class="mb-2"
                    @update:modelValue="$emit('update:form', { ...form, email: $event })"
                  />

                  <v-text-field
                    v-model="form.password"
                    :error-messages="v$.password.$errors.map(e => e.$message)"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    required
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    class="mb-2"
                    @update:modelValue="$emit('update:form', { ...form, password: $event })"
                  />

                  <v-text-field
                    v-model="form.password_confirmation"
                    :error-messages="v$.password_confirmation.$errors.map(e => e.$message)"
                    label="Confirm Password"
                    prepend-inner-icon="mdi-lock-check"
                    :append-inner-icon="showPasswordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    required
                    :type="showPasswordConfirmation ? 'text' : 'password'"
                    @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
                    class="mb-2"
                    @update:modelValue="$emit('update:form', { ...form, password_confirmation: $event })"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="mt-6 login-btn"
                  >
                    Create Account
                  </v-btn>

                  <!-- Use slot for login link -->
                  <slot name="login-link"></slot>
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
  padding: 0 32px 32px;
  max-width: 580px;
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

@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    padding: 0 20px 24px;
  }
  
  :deep(.text-h3) {
    font-size: 2rem !important;
  }
  
  :deep(.text-h6) {
    font-size: 1rem !important;
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