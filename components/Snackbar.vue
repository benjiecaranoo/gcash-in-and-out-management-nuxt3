<script setup lang="ts">
const { visibility, message, list, color, icon, timer, clearSnackbar } = useSnackbar();

const hasList = computed(() => list.value.length > 0);
const hasIcon = computed(() => !!icon.value);
</script>
<template>
  <v-snackbar
    :model-value="visibility"
    :color="color"
    :timeout="timer"
    rounded
    class="global-snackbar"
    @update:modelValue="clearSnackbar()"
  >
    <div class="global-snackbar__border d-flex">
      <div class="global-snackbar__content">
        {{ message }}
      </div>
      <div v-if="hasIcon" class="global-snackbar__icon">
        <v-icon :icon="icon" />
      </div>
    </div>
  </v-snackbar>
</template>
<style lang="scss">
.global-snackbar {
  &__content {
    flex-grow: 1;
  }

  &__content,
  &__list {
    font-weight: 500;
  }

  &__list {
    padding-top: 3px;
    color: inherit;
    opacity: 1;
  }
}
</style>
