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

              <!-- Loop through menu items -->
              <template v-for="(item, index) in menuItems" :key="index">
                  
                  <!-- Menu item with children (collapsible) -->
                  <div v-if="item.children" class="menu-item-wrapper">
                      <div 
                          class="link parent-link" 
                          @click="toggleCollapse(index)"
                          :class="{ 'active': openMenus[index] }"
                      >
                          <div class="hint-img">
                              <img :src="item.icon" :alt="item.label">
                          </div>
                          <span>{{ $t(item.label) }}</span>
                          <i class="fas fa-chevron-left collapse-icon" :class="{ 'rotated': openMenus[index] }"></i>
                      </div>
                      
                      <!-- Submenu -->
                      <transition name="collapse">
                          <div v-show="openMenus[index]" class="submenu">
                              <nuxt-link 
                                  v-for="(child, childIndex) in item.children" 
                                  :key="childIndex"
                                  class="link sub-link" 
                                  :to="child.to"
                                  :class="{ 'active': isActiveLink(child.to) }"
                              >
                                  <div v-if="child.icon" class="hint-img">
                                      <img :src="child.icon" :alt="child.label">
                                  </div>
                                  {{ $t(child.label) }}
                              </nuxt-link>
                          </div>
                      </transition>
                  </div>

                  <!-- Regular menu item (no children) -->
                  <nuxt-link 
                      v-else
                      class="link" 
                      :to="item.to"
                      :class="{ 'active': isActiveLink(item.to) }"
                  >
                      <div class="hint-img">
                          <img :src="item.icon" :alt="item.label">
                      </div>
                      {{ $t(item.label) }}
                  </nuxt-link>

              </template>

              <!-- Logout button -->
              <button class="link w-100" @click="logoutDialog = true">
                  <div class="hint-img">
                      <img src="@/assets/images/sidebar/logout.svg" alt="hint-img">
                  </div>
                  {{ $t('Sidebar.logout') }}
              </button>
          </div>

        <!-- logout Dialog -->
        <Dialog v-model:visible="logoutDialog" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <h1 class="main-title bold md mb-4">{{ $t('Sidebar.sure_logout')}}</h1>
                <div class="section-btns mt-5">
                    <button type="button" class="custom-btn d-inline-flex" @click="logoutDialog = false">{{ $t('Auth.retreat') }}</button>
                    <button type="button" class="custom-btn logout d-inline-flex" @click="logout">
                        {{ $t('Sidebar.out') }}
                        <span class="spinner-border-sm" v-if="logoutLoading">
                            <i class="fa-solid fa-spinner fa-spin fz-16"></i>
                        </span>
                    </button>
                </div>
            </div>
        </Dialog>

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

const logoutDialog = ref(false);
const logoutLoading = ref(false);

// Collapse state
const openMenus = ref({});

// Menu items structure
const menuItems = ref([
    {
        label: 'Sidebar.home',
        to: '/',
        icon: '/_nuxt/assets/images/sidebar/home.svg'
    },
    {
        label: 'Sidebar.orders',
        icon: '/_nuxt/assets/images/sidebar/tables.svg',
        children: [
            { label: 'Sidebar.my_orders', to: '/myorders', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.new_orders', to: '/orders/new', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.pending_orders', to: '/orders/pending', icon: '@/assets/images/sidebar/coin.svg' }
        ]
    },
    {
        label: 'Sidebar.my_wallet',
        icon: '/_nuxt/assets/images/sidebar/reservations.svg',
        children: [
            { label: 'Sidebar.my_orders', to: '/myorders', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.new_orders', to: '/orders/new', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.pending_orders', to: '/orders/pending', icon: '@/assets/images/sidebar/coin.svg' }
        ]
    },
    {
        label: 'Sidebar.menu_list',
        icon: '/_nuxt/assets/images/sidebar/menu-board.svg',
        children: [
            { label: 'Sidebar.my_orders', to: '/myorders', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.new_orders', to: '/orders/new', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.pending_orders', to: '/orders/pending', icon: '@/assets/images/sidebar/coin.svg' }
        ]
    },
    {
        label: 'Sidebar.new_requests',
        icon: '/_nuxt/assets/images/sidebar/new-order.svg',
        children: [
            { label: 'Sidebar.my_orders', to: '/myorders', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.new_orders', to: '/orders/new', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.pending_orders', to: '/orders/pending', icon: '@/assets/images/sidebar/coin.svg' }
        ]
    },
    {
        label: 'Sidebar.pending_payment',
        icon: '/_nuxt/assets/images/sidebar/money-time.svg',
        to: '/payment/pending',
    },
    {
        label: 'Sidebar.waiting_list',
        to: '/waiting',
        icon: '/_nuxt/assets/images/sidebar/timer.svg'
    },
    {
        label: 'Sidebar.reservations',
        icon: '/_nuxt/assets/images/sidebar/calendar-tick.svg',
        children: [
            { label: 'Sidebar.today_reservations', to: '/reservations/today', icon: '@/assets/images/sidebar/category-2.svg' },
            { label: 'Sidebar.upcoming_reservations', to: '/reservations/upcoming', icon: '@/assets/images/sidebar/category-2.svg' },
            { label: 'Sidebar.past_reservations', to: '/reservations/past', icon: '@/assets/images/sidebar/category-2.svg' }
        ]
    },
    {
        label: 'Sidebar.financial_transactions',
        icon: '/_nuxt/assets/images/sidebar/coin.svg',
        children: [
            { label: 'Sidebar.my_orders', to: '/myorders', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.new_orders', to: '/orders/new', icon: '@/assets/images/sidebar/box.svg' },
            { label: 'Sidebar.pending_orders', to: '/orders/pending', icon: '@/assets/images/sidebar/coin.svg' }
        ]
    },
    {
        label: 'Sidebar.ratings',
        icon: '/_nuxt/assets/images/sidebar/star.svg',
        to: '/ratings'
    },
    {
        label: 'Sidebar.users',
        icon: '/_nuxt/assets/images/sidebar/people.svg',
        children: [
            { label: 'Sidebar.all_users', to: '/users', icon: '@/assets/images/sidebar/profile.svg' },
            { label: 'Sidebar.active_users', to: '/users/active', icon: '@/assets/images/sidebar/profile.svg' },
            { label: 'Sidebar.blocked_users', to: '/users/blocked', icon: '@/assets/images/sidebar/profile.svg' }
        ]
    },
    {
        label: 'Sidebar.booking_form',
        to: '/booking-form',
        icon: '/_nuxt/assets/images/sidebar/document-text.svg'
    },
    {
        label: 'Sidebar.schedule',
        to: '/schedule',
        icon: '/_nuxt/assets/images/sidebar/wallet-money.svg'
    }
]);

// Toggle collapse
const toggleCollapse = (index) => {
    openMenus.value[index] = !openMenus.value[index];
};

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
    logoutLoading.value = true;
    const res = await logoutHandler();
    res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
    logoutDialog.value = false;
    localStorage.clear();
    logoutLoading.value = false;
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

<style lang="scss" scoped>
.menu-item-wrapper {
    margin-bottom: 0;
}

.parent-link {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .collapse-icon {
        margin-inline-start: auto;
        font-size: 12px;
        transition: transform 0.3s ease;
        
        &.rotated {
            transform: rotate(-90deg);
        }
    }
}

.submenu {
    padding-inline-start: 45px;
    overflow: hidden;
    
    .sub-link {
        padding: 8px 10px;
        font-size: 13px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .hint-img {
            max-width: 20px;
            max-height: 20px;
            
            img {
                width: 100%;
                height: 100%;
            }
        }
        
        &:last-child {
            margin-bottom: 15px;
        }
    }
}

// Collapse transition
.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
}

.collapse-enter-from,
.collapse-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>
