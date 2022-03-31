import { useRouter as Router } from "vue-router";

export function useRouter() {
  const router = Router();
  function routeTo(
    url = "" //  params = {}, query = {}
  ) {
    router.push(url);
  }
  return {
    routeTo
  };
}
