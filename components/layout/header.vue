<template>
    <div class="defaultLayout auth-padding main-header" :class="{'active': isActive }">
        <header class="header" :class="[headerClass, {'headerAdded': isScrolled}]">
            <div class="inner-header">
                <div class="right-side d-flex align-items-center gap-4 flex-wrap">
                    <div class="navbar-btn"  @click="toggleActive">
                        <i class="fas fa-bars"></i>
                    </div>
                    <h3 class="main-title bold md mb-0">
                        <div v-if="globalStore?.title">{{ globalStore.title }}</div>
                        <template v-else>{{ $t("Global.welcome") }} {{ user?.name }} 😊</template>
                    </h3>

                </div>
                <div class="d-flex align-items-center">
                    <div class="with_br">
                        <NuxtLink v-if="isLoggedIn" to="/Notifications" class="notification">
                            <div class="notif-icon">
                                <i class="fas fa-bell"></i>
                                <div class="nof-cont" v-if="notifCount" :data-number="notifCount"></div>
                            </div>
                        </NuxtLink>
                    </div>
                    <nuxt-link to="/profile" class="with_br d-flex align-items-center gap-2">
                        <div class="profile-hint resp-icon ">
                            <img :src="user?.image" class="user-img" alt="user-image" loading="lazy" v-if="user?.image">
                        </div>
                        <div class="hints">
                            <p class="title" v-if="user?.name">{{ user.name }} </p>
                            <!-- <p class="desc">{{ $t('Home.general_director') }}</p> -->
                            <p class="desc">{{ $t('Global.provider') }}</p>
                        </div>
                    </nuxt-link>

                    <GlobalLang :color-lang="true" />

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

<script>

export default {
    data() {
        return {
            htmlLang: "",
            navBtnActive: false,
            navLinksActive: false,
            navOverlayShow: false,
            // isActive: false,
        };
    },

    methods: {
        // logout() {
        //     localStorage.clear();
        //     this.logoutDialog = false;
        //     this.$router.push("/Auth/login");
        // },


        chageDir(dir) {
            let element = document.querySelector(".html_direction");
            element.setAttribute("lang", dir);
            if (dir === "ar") {
                element.setAttribute("dir", "rtl");
                this.htmlLang = dir;
            }
            if (dir === "en") {
                element.setAttribute("dir", "ltr");
                this.htmlLang = dir;
            }
        },
        switchLang(newLang) {
            const lang = useCookie('lang')
            if (newLang !== localStorage.getItem("locale")) {
                lang.value = newLang
                localStorage.setItem("locale", newLang);
                location.reload();
            }
        },

        handleClick() {
            this.navBtnActive = true;
            this.navLinksActive = true;
            this.navOverlayShow = true;
        },

        handleOverlayClick() {
            this.navBtnActive = false;
            this.navLinksActive = false;
            this.navOverlayShow = false;
        },
    },

    watch: {
    // Watch for changes in the route
    
    $route(to, from) {
      // Handle the event here
      this.handleOverlayClick();
    },
  },

    async mounted() {
        let sessionKey = localStorage.getItem("locale");

        window.sessionKey = localStorage.getItem("locale");
        if (sessionKey) {
            this.chageDir(localStorage.getItem("locale"));
        }
    },

    computed: {
        headerClass() {
            return {
                "auth-padding": this.shouldAddMarginBottom,
            };
        },
        shouldAddMarginBottom() {
            // Check if the current route is not the home page
            return this.$route.path.includes("Auth") === true;
        },
    },
};
</script>

<style lang="scss">
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
    &.headerAdded {
        transform: translateY(10px);
    }
}
</style>
