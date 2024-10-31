<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="auth-wrapper">
    <transition name="fade" mode="out-in">
      <div :key="route.path">
        <slot />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.auth-wrapper {
  min-height: 100vh;
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

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 