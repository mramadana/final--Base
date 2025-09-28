export default defineNuxtRouteMiddleware((to, from) => {

    const { isLoggedIn } = storeToRefs(useAuthStore());

  if(to.path === '/myorders' || to.path === '/myorders/newOrders') {
    if(to.path !== '/myorders/newOrders/merchantRequest') {
     return navigateTo('/myorders/newOrders/merchantRequest')
    }
  }

    // Toast
    const { errorToast } = toastMsg();
  
    // get i18n t
    const nuxtApp = useNuxtApp();
    const t = nuxtApp.vueApp.config.globalProperties.$t;
  
    // if (isLoggedIn.value === false && to.meta.middleware == "auth") {

    //   errorToast(t("validation.requiresAuth"));

    //   return navigateTo("/")
    // }
})