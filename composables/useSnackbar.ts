import useSnackbarStore from '@/stores/snackbar';
import { storeToRefs } from 'pinia';

export default function useSnackbar() {
  const snackbarStore = useSnackbarStore();
  const { showSnackbar, clearSnackbar } = useSnackbarStore();
  const { visibility, message, color, icon, list, timer } = storeToRefs(snackbarStore);

  return {
    visibility,
    message,
    color,
    list,
    timer,
    icon,
    showSnackbar,
    clearSnackbar,
  };
}
