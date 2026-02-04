export default defineNuxtRouteMiddleware((to, from) => {

    const { isLoggedIn } = storeToRefs(useAuthStore());

  if(to.path === '/myorders' || to.path === '/myorders/newOrders') {
    if(to.path !== '/myorders/newOrders/merchantRequest') {
     return navigateTo('/myorders/newOrders/merchantRequest')
    }
  }

  if (to.path === '/settings') {
  
    return '/settings/editProfile';
    
  };

    // Toast
    const { errorToast } = toastMsg();
  
    // get i18n t
    const nuxtApp = useNuxtApp();
    const t = nuxtApp.vueApp.config.globalProperties.$t;
  
  if (!isLoggedIn.value && to.meta.middleware == "auth") {
      setTimeout(() => {
        return navigateTo("/auth/login");
        }, 100);
    }

    if (to.path == from.path && isLoggedIn.value == true && to.meta.middleware == "auth") {
        setTimeout(() => {
          return navigateTo({
            path: from.path,
            query: to.query
          });
        }, 100);
      }
})