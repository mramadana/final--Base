export default defineNuxtPlugin((nuxtApp) => {
  const globalStore = useGlobalStore();
  const router = useRouter();

  // Reset header values before each route change
  router.beforeEach((to, from, next) => {
    globalStore.resetHeader();
    next();
  });
});
