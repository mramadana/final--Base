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
                          :class="{ 'active': openMenus[index] || hasActiveChild(item.children) }"
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
        label: 'Sidebar.tables',
        icon: '/_nuxt/assets/images/sidebar/tables.svg',
        children: [
            { label: 'sideMenu.my_tables', to: '/tables', icon: '/_nuxt/assets/images/sidebar/table-img.png' },
            { label: 'sideMenu.add_new_table', to: '/tables/addTable', icon: '/_nuxt/assets/images/sidebar/add.png' },
        ]
    },
    {
        label: 'Sidebar.my_reservation',
        icon: '/_nuxt/assets/images/sidebar/reservations.svg',
        children: [
            { label: 'sideMenu.my_reservations', to: '/Reservations/myReservations', icon: '/_nuxt/assets/images/sidebar/my-reservation-img.svg' },
            { label: 'sideMenu.completed_reservations', to: '/Reservations/completed', icon: '/_nuxt/assets/images/sidebar/completed-reservations.png' },
            { label: 'sideMenu.cancelled_reservations', to: '/Reservations/cancelled', icon: '/_nuxt/assets/images/sidebar/cancle-reservation.png' }
        ]
    },
    {
        label: 'Sidebar.menu_list',
        icon: '/_nuxt/assets/images/sidebar/menu-board.svg',
        children: [
            { label: 'sideMenu.my_menus', to: '/myorders', icon: '/_nuxt/assets/images/sidebar/folder-open.png' },
            { label: 'sideMenu.add_meal', to: '/orders/new', icon: '/_nuxt/assets/images/sidebar/folder-add.png' }
        ]
    },

    {
        label: 'Sidebar.new_orders',
        icon: '/_nuxt/assets/images/sidebar/new-order.svg',
        to: '/payment/pending',
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
            { label: 'sideMenu.active_reservations', to: '/reservations/today', icon: '/_nuxt/assets/images/sidebar/active-reservations.png' },
            { label: 'sideMenu.scheduled_reservations', to: '/reservations/upcoming', icon: '/_nuxt/assets/images/sidebar/scheduled-reservations.png' }
        ]
    },
    {
        label: 'Sidebar.financial_transactions',
        icon: '/_nuxt/assets/images/sidebar/coin.svg',
        children: [
            { label: 'sideMenu.due_amount', to: '/myorders', icon: '/_nuxt/assets/images/sidebar/money-change.png' },
            { label: 'sideMenu.current_settlement', to: '/orders/new', icon: '/_nuxt/assets/images/sidebar/money-time-new.png' },
            { label: 'sideMenu.finished_settlement', to: '/orders/new', icon: '/_nuxt/assets/images/sidebar/money-remove.png' },
            { label: 'sideMenu.financial_reports_profits', to: '/orders/new', icon: '/_nuxt/assets/images/sidebar/money-disscount.png' },
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
            { label: 'sideMenu.view_users', to: '/users', icon: '/_nuxt/assets/images/sidebar/user-tag.png' },
            { label: 'sideMenu.add_user', to: '/users/active', icon: '/_nuxt/assets/images/sidebar/user-add.png' },
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

// Toggle collapse - close all others and toggle the clicked one
const toggleCollapse = (index) => {
    // If the clicked menu is already open, just close it
    if (openMenus.value[index]) {
        openMenus.value[index] = false;
        return;
    }
    
    // Otherwise, close all menus first
    Object.keys(openMenus.value).forEach(key => {
        openMenus.value[key] = false;
    });
    // Then open the clicked menu
    openMenus.value[index] = true;
};

// Check if any child link is active
const hasActiveChild = (children) => {
    if (!children) return false;
    return children.some(child => isActiveLink(child.to));
};

const isActiveLink = (path) => {
    return route.path === path;
};

// Auto-open menu with active child on mount
const initializeActiveMenu = () => {
    // First, close all menus
    Object.keys(openMenus.value).forEach(key => {
        openMenus.value[key] = false;
    });
    
    // Then open only the menu with active child
    menuItems.value.forEach((item, index) => {
        if (item.children && hasActiveChild(item.children)) {
            openMenus.value[index] = true;
        }
    });
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

// Watch route changes to update active menu
watch(() => route.path, () => {
    initializeActiveMenu();
});

watch(router, handleRouteChange);

router.afterEach((to, from) => {
      if (window.innerWidth <= 1250) {
        emit('toggle-active');
        handleResize();
      }
});

onMounted(() => {
    initializeActiveMenu();
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
    padding-inline-start: 25px;
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
