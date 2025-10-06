<template>
    <div class="defaultLayout auth-padding main-header" :class="{'active': isActive }">
        <header class="header" :class="[headerClass, {'headerAdded': isScrolled}]">
            <div class="inner-header">
                <div class="right-side d-flex align-items-center gap-4 flex-wrap">

                    <NuxtLink to="/settings" class="settings-link">
                        <i class="fa-solid fa-gear"></i>
                    </NuxtLink>

                    <div v-if="globalStore?.title">                        
                        <div class="d-flex align-items-center gap-2">

                            <NuxtLink v-if="globalStore?.titleLink" :to="globalStore.titleLink" class="main-title bold md mb-0" style="color: #fff; text-decoration: none;">
                                {{ globalStore.title }}
                            </NuxtLink>

                            <h3 v-else class="main-title bold md mb-0">{{ globalStore.title }}</h3>

                            <i v-if="globalStore?.titleIcon" class="mr-1" :class="globalStore.titleIcon" style="color: #fff;"></i>

                            
                            <div v-if="globalStore?.subtitle" style="font-size: 12px; color: #ccc; margin-top: 2px;">
                                {{ globalStore.subtitle }}
                            </div>
                        </div>
                    </div>

                </div>
                <div class="d-flex align-items-center">

                    <NuxtLink  to="/Notifications" class="notification ml-5">
                        <div class="notif-icon">
                            <!-- <i class="fas fa-bell"></i> -->
                             <img src="@/assets/images/notification-img.svg" alt="notification-img">
                            <div class="nof-cont" v-if="notifCount" :data-number="notifCount"></div>
                        </div>
                    </NuxtLink>

                    <div class="AuthLang">
                        <GlobalLang :color-lang="true" />

                    </div>

                    <div class="navbar-btn"  @click="toggleActive">
                        <i class="fas fa-bars"></i>
                    </div>

                </div>
            </div>
        </header>
    </div>
</template>


<script setup>
    
    // Toast
    const { successToast, errorToast } = toastMsg();

    // Axios
    const axios = useApi();
    
    // store
    const store = useAuthStore();
    const globalStore = useGlobalStore();

    const isActive = ref(false);

    const { user, isLoggedIn, token } = storeToRefs(store);

    const imageheader = ref(null);

    const { response } = responseApi();

    const { logoutHandler } = store;
    // notifications
    const notifCount = ref(null);
    const logoutDialog = ref(false);

    // config
    let config = {
        headers: {
            Authorization: `Bearer ${token.value}`
        }
    };
    const logout = async () => {
        
        // Get Returned Data From Store
        logoutDialog.value = false;
        const res = await logoutHandler();
        res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
        localStorage.clear();
    }

    const emit = defineEmits(['toggle-active']);

    const toggleActive = () => {
        isActive.value = !isActive.value;
        emit("toggle-active");
    };

    // get notifications Count
    const getNotificationsCount = async () => {
        await axios.get('manager/count-notifications', config).then(res => {
            if(response(res) == "success") {
                notifCount.value = res.data.data.count;
            }
        }).catch(err => {
            console.error(err);
        });
    };

    // watch token To Get The New User Data
    watch(token, async (newVal) => {
    if (newVal) {
        config = {
            headers: {
                Authorization: `Bearer ${newVal}`
            }
        }

        getNotificationsCount();
    } else {
        notifCount.value = 0;
    }
    });

    watch(notifCount, (newValue, oldValue) => {
      // If notifCount becomes empty or not 0, hide the element
      if (newValue == 0) {
        notifCount.value = null;
      }
    });

    const router = useRouter();

    router.afterEach(() => {
      getNotificationsCount();
      
    });



    onMounted( async () => {
       await getNotificationsCount();
    });

    onMounted(() => {
        store.user.image
        imageheader.value = user.value.image
    });
    
    const isScrolled = ref(false);

    const handleScroll = () => {
        isScrolled.value = window.scrollY > 50;
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

</script>


<style lang="scss">
.settings-link {
    width: 35px;
    height: 35px;
    background: #3a3a3a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
}
.add-margin {
    margin-bottom: 40px;
}
.defaultLayout {
    position: sticky;
    top: 0;
    z-index: 3333;
}
.header {
    transition: all 0.4s ease-in-out;
    border: 1px solid #191919;
    &.headerAdded {
        transform: translateY(10px);
        border-color: #fff;
        background-color: #191919;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    }
}
</style>
