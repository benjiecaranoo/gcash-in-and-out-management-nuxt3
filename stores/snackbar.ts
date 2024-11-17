import { defineStore } from 'pinia';

export default defineStore('snackbar', () => {
  const visibility = ref(false);
  const message = ref('');
  const list = ref([]);
  const timer = ref(-1);
  const color = ref<string | null>(null);
  const icon = ref<string | null>(null);

  const showSnackbar = (params: any = {}) => {
    const { text = '', items = [], state = null, sign = null, delay = 4000 } = params;

    visibility.value = true;
    message.value = text;
    list.value = items;
    timer.value = delay;

    if (typeof state === 'boolean') {
      color.value = state ? '#000' : 'error';
    } else if (state === null) {
      color.value = '#000';
    } else {
      color.value = state === 'success' ? '#000' : 'error';
    }

    if (sign) {
      icon.value = sign;
    } else {
      switch (state) {
        case 'success':
          icon.value = 'mdi-checkbox-marked-circle-outline';
          break;
        case 'warning':
          icon.value = 'mdi-alert-outline';
          break;
        case 'error':
          icon.value = 'mdi-close-circle-outline';
          break;
        case 'info':
          icon.value = 'mdi-information-outline';
          break;
        default:
          icon.value = sign;
          break;
      }
    }
  };

  const clearSnackbar = () => {
    visibility.value = false;
    message.value = '';
    list.value = [];
    timer.value = 4000;
    color.value = null;
    icon.value = null;
  };

  return { visibility, message, list, timer, color, icon, showSnackbar, clearSnackbar };
});
