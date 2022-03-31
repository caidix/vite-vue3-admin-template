import { ref } from "vue";

export function LoadingHook() {
  const loadingRef = ref(false);
  const loading = () => {
    loadingRef.value = true;
  };
  const loaded = () => {
    loadingRef.value = false;
  };
  return {
    loadingRef,
    loading,
    loaded
  };
}
