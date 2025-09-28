<template>
    <div class="custom-height">
      <div class="container">
          <div class="layout-form custom-width lg">
              <h1 class="main-title bold lg mb-5 position-relative">
                {{ $t("Global.notifications") }}
                
                <button type="button" class="deleteAll-btn" @click="deleteAll" v-if="notifications.length">
                    <i class="far fa-trash-alt trash-icon" v-if="!deleteLoading"></i>
                    <span class="spinner-border spinner-border-sm m-0" v-if="deleteLoading" role="status" aria-hidden="true"></span>
                    <div class="resp-text">
                        {{ $t("Global.delete_all") }}
                    </div>
                </button>
            </h1>

            <transition-group name="fade" v-if="!loading">
                
                <div v-for="(result, index) in notifications" :key="result.index">
                    <div class="layout-form sm" v-if="notifications.length">
                    <div class="notificatin-card">
                        <div class="d-flex">
                            <img src="@/assets/images/logo.svg" loading="lazy" alt="notificatin-img" class="notificatin-img">
                            <div class="text text-start">
                                <h1 class="main-title normal wrap_text"> {{ result.body }}</h1>
                                <div class="d-flex align-items-center gap-2">
                                    <i class="far fa-clock main-disc"></i>
                                    <div>
                                        <span class="main-disc sm">{{ $t("order.since") }} : {{ result.created_at }}</span>
                                        &nbsp;
                                        <span class="main-disc sm">{{ result.time }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="delete-btn">
                            <i class="far fa-trash-alt trash-icon" v-if="!deleteLoading" @click="removenotifation(index)"></i>
                            <span class="spinner-border spinner-border-sm m-0" v-if="deleteLoading" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                    </div>
                </div>
    
                <div v-if="!notifications.length">
                    {{ $t("Global.no_notifications") }}
                </div>
                
            </transition-group>

            <div v-if="loading">
                <div class="notification-items">
                    <div class="not-item d-flex" v-for="i in 5" :key="i">
                        <div class="right">
                            <Skeleton shape="circle" size="4rem"></Skeleton>
                            <div class="not_body">
                                <div class="time mb-3">
                                    <Skeleton height=".6rem" width="4rem"></Skeleton>
                                </div>
                                <Skeleton height=".6rem" width="14rem"></Skeleton>
                            </div>
                        </div>
                        <Skeleton height="1.2rem" width=".8rem"></Skeleton>
                    </div>

                </div>
            </div>

            <div v-if="showPaginate">
                <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-5" dir="ltr" />
            </div>
          </div>
      </div>
    </div>
  </template>

<script setup>

// success response
const { response } = responseApi();

// Axios
const axios = useApi();

// toast
const { successToast, errorToast } = toastMsg();

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// loading
const loading = ref(true);

// delete loading
const deleteLoading = ref(false);

// notifications
const notifications = ref([]);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};


/**** Methods ****/

// Get notifications
const getNotifications = async () => {
    loading.value = true;
    await axios.get(`notifications?page=${currentPage.value}`, config).then(res => {
        if (response(res) == "success") {
            notifications.value = res.data.data.notifications.data;
            totalPage.value = res.data.data.notifications.pagination.total_items;
            pageLimit.value = res.data.data.notifications.pagination.per_page;
        }
        loading.value = false;
    }).catch(err => {
        console.error(err);
    });
}

// Paginate Function
const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    getNotifications();
};

// Remove Single Notification
const removenotifation = async (index) => {
    loading.value = true;
    await axios.delete(`delete-notification/${notifications.value[index].id}`, config).then(res => {
        if (response(res) == "success") {
            notifications.value.splice(index, 1);
            successToast(res.data.msg);
        } else {
            errorToast(res.data.msg);
        }
        loading.value = false;
    }).catch(err => {
        console.error(err);
    });
}

// // Delete All Notifications

const deleteAll = async () => {
    loading.value = true;
    await axios.delete(`delete-notifications`, config).then(res => {
        if (response(res) == "success") {
            notifications.value = [];
            successToast(res.data.msg);
        } else {
            errorToast(res.data.msg);
        }
        loading.value = false;
    }).catch(err => {
        console.error(err);
    });
}

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
});


/******************* Watch *******************/

/******************* Mounted *******************/
onMounted(async () => {
    await getNotifications();
});

/******************* Required Auth *******************/
definePageMeta({
    name: "Global.notifications",
    middleware: 'auth'
});

</script>


<style lang="scss">
    .wrap_text {
        word-break: break-word;
    }
    .delete-btn {
        background-color: transparent;
    }
    .main-disc {
        &.sm {
            font-size: 13px;
            font-weight: 400;
        }
    }
    .notificatin-card {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        .notificatin-img {
            width: 65px;
            height: 45px;
            object-fit: cover;
            margin-inline-end: 15px;
            border-radius: 3px;
        }

        .trash-icon {
            font-size: 17px;
            color: #EC2F2F;
            cursor: pointer;
        }

    }
    .custom-height {
        min-height: 310px;
        @media (max-width: 1024px) {
            min-height: 100%;
        }
    }

    .not-item {
        justify-content: space-between;
        padding: 10px 15px;
        border-radius: 10px;
        border: 1px solid rgba($color: #dcdcdc, $alpha: 0.56);
        margin-bottom: 15px;

    .right {
        display: flex;
        align-items: center;
        gap: 15px;

        .logo {
        max-width: 60px;
        flex-shrink: 0;
        }

        .not_body {
        .time {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: green;

            i {
            animation: bell-animation 4s infinite ease-in-out;
            }
        }
        }
    }

    &:last-child {
        margin-bottom: 0;
    }
    }
</style>
  
