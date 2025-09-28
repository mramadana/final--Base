<template>
  <div>

      <div class="sidebar" :class="{ 'active': isActive }">

          <!-- ***** close icon to close sidebar ***** -->
          <div class="colse-icon" @click="$emit('toggle-active')"><i class="fas fa-times"></i></div>

          <!-- ***** sidebar logo ***** -->
          <div class="sidebar-logo">
              <nuxt-link to="" class="logo">
                  <img src="@/assets/images/logo.svg" loading="lazy" alt="logo" class="logo-img">
              </nuxt-link>
          </div>
          
          <div ref="linksList" class="links" @scroll="saveScrollPosition">

              <nuxt-link class="link" to="/aboutSite" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/home.svg" class="colored-svg" alt="hint-img">
                  </div>
                  {{ $t('Home.home') }}
              </nuxt-link>

              <nuxt-link class="link" to="/myorders" :class="{ 'active': isActiveLink('/myorders') || route.path.startsWith('/orders/orderDetails/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/box.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.orders') }}
              </nuxt-link>

              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/message.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.chats') }}
              </nuxt-link>


              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/moneys.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.my_packages') }}
              </nuxt-link>


              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/moneys.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.packages') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/coin.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.financial_transactions') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/personalcard.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.my_ads') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/star.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.specializations') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/profile.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.profile') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/setting.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.settings') }}
              </nuxt-link>
              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/messages.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.contact_us') }}
              </nuxt-link>

              <nuxt-link class="link" to="/" :class="{ 'active': isActiveLink('/') }">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/category-2.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.static_pages') }}
              </nuxt-link>

              <button class="link w-100 logout-text" @click="logout">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/logout.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.logout') }}
                </button>
          </div>

      </div>

      <div class="overlay-sidebar" @click="$emit('toggle-active')" :class="{ 'show': isActive }"></div>
  </div>
</template>

<script setup>

const props = defineProps({
isActive: Boolean,
});

const scrollPosition = ref(0);
const linksList = ref(null);
const router = useRouter();
const route = useRoute();

const isActiveLink = (path) => {
if (path === '/') {
  return route.path === path;
}
return route.path.startsWith(path);
};

const emit = defineEmits(['toggle-active']);

  // Toast
  const { successToast, errorToast } = toastMsg();

  // Axios
  const axios = useApi();
  
  // store
  const store = useAuthStore();


const { token } = storeToRefs(store);

const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

  const { response } = responseApi();

  const { logoutHandler } = store;
  const logout = async () => {
        const res = await logoutHandler();
        res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
        localStorage.clear();
    }



// Scroll to the middle of the previously clicked link on mount
const scrollToClickedLink = () => {
const clickedLinkPath = localStorage.getItem('clickedLinkPath');
if (clickedLinkPath) {
  const target = linksList.value.querySelector(`.link[to='${clickedLinkPath}']`);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
};

const saveScrollPosition = () => {
if (linksList.value) {
  scrollPosition.value = linksList.value.scrollTop;
  localStorage.setItem('sidebarScrollPosition', scrollPosition.value);
}
};

const restoreScrollPosition = () => {
const savedPosition = localStorage.getItem('sidebarScrollPosition');
if (linksList.value && savedPosition !== null) {
  smoothScrollTo(savedPosition);
}
};

// Smooth scroll function
const smoothScrollTo = (position) => {
if (linksList.value) {
  linksList.value.scrollTo({
    top: position,
    behavior: 'smooth',
  });
}
};

const handleRouteChange = () => {
console.log('Route changed:', router);
if (window.innerWidth <= 1250) {
  emit('toggle-active');
  handleResize();
}
};

watch(router, handleRouteChange);

router.afterEach((to, from) => {
      if (window.innerWidth <= 1250) {
        emit('toggle-active');
        handleResize();
      }
});

onMounted(() => {
restoreScrollPosition();
scrollToClickedLink();
});

</script>
