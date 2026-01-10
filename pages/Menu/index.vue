<template>
    <div class="menu-page layout-form">
        <!-- Header Section -->
        <div class="header-section">
            <h1 class="main-title bold md">{{ $t('menu.my_menus') }}</h1>
            <NuxtLink to="/Menu/addMenu" class="add-menu-btn">
                <i class="fas fa-plus"></i>
                {{ $t('menu.add_new_menu') }}
            </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('Table.Loading') }}</span>
            </div>
            <p class="loading-text">{{ $t('Table.Loading') }}</p>
        </div>

        <!-- Menu Cards Section -->
        <div v-else-if="menus.length > 0" class="menu-cards-container">
            <!-- Menu Card Loop -->
            <div class="menu-card" v-for="menu in menus" :key="menu.id">
                <h2 class="menu-card-title">{{ menu.name }}</h2>
                <div class="menu-card-image">
                    <img 
                        :src="menu.image" 
                        :alt="menu.name"
                        @error="handleImageError"
                    />
                </div>
                <NuxtLink :to="`/Menu/${menu.id}`" class="custom-btn w-100">
                    {{ $t('menu.view_details') }}
                </NuxtLink>
            </div>
        </div>

        <!-- No Data State -->
        <div v-else class="no-data-container">
            <div class="no-data-content">
                <i class="fas fa-utensils no-data-icon"></i>
                <h3 class="no-data-title">{{ $t('menu.no_menus') }}</h3>
                <p class="no-data-text">{{ $t('menu.no_menus_description') }}</p>
                <NuxtLink to="/Menu/addMenu" class="custom-btn">
                    <i class="fas fa-plus"></i>
                    {{ $t('menu.add_new_menu') }}
                </NuxtLink>
            </div>
        </div>

        <div v-if="showPaginate" class="paginate-parent">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-5" dir="ltr" />
        </div>
    </div>
</template>

<script setup>

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.my_menus');

// Pinia store for authentication
const store = useAuthStore();
const { token } = storeToRefs(store);

// Axios config with authentication
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// Axios instance
const axios = useApi();

// Toast notifications
const { successToast, errorToast } = toastMsg();

// State management
const loading = ref(false);
const menus = ref([]);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
});
// Handle image error (fallback)
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/500x300?text=Menu+Image';
};

// Fetch menus from API
const fetchMenus = async (page = 1) => {
    loading.value = true;
    try {
        const response = await axios.get(`provider/menus?page=${page}`, config.value);
        
        if (response.data.key === 'success') {
            menus.value = response.data.data.data;
            totalPage.value = response.data.data.pagination.total_items;
            pageLimit.value = response.data.data.pagination.per_page;
        }
    } catch (error) {
        console.error('Error fetching menus:', error);
        errorToast(t('menu.error_loading_menus'));
    } finally {
        loading.value = false;
    }
};

// Call on component mount
onMounted(() => {
    fetchMenus();
});

// Page meta

definePageMeta({
    name: "menu.my_menus",
    layout: "default",
});
</script>

<style lang="scss" scoped>
    .header-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;

        .main-title {
            margin: 0;
            color: #fff;
        }

        .add-menu-btn {
            background-color: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 8px;
            color: #fff;
            padding: 12px 24px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;

            i {
                font-size: 14px;
            }

            &:hover {
                background-color: #3a3a3a;
                border-color: var(--main-color, #ff6b35);
                color: var(--main-color, #ff6b35);
            }
        }
    }

    .menu-cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .menu-card {
        background-color: #1a1a1a;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #2a2a2a;
        transition: all 0.3s ease;
        padding: 15px;

        &:hover {
            border-color: #3a3a3a;
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .menu-card-title {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            text-align: center;
            margin-bottom: 20px;
        }

        .menu-card-image {
            width: 100%;
            height: 320px;
            overflow: hidden;
            position: relative;
            border-radius: 8px;
            margin-bottom: 20px;

            @media (max-width: 550px) {
                height: 200px;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
                transition: transform 0.4s ease;
            }

            &:hover img {
                transform: scale(1.05);
            }
        }

        .view-details-btn {
            width: 100%;
            background-color: #f5f5f5;
            border: none;
            color: #1a1a1a;
            padding: 18px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background-color: var(--main-color, #ff6b35);
                color: #fff;
            }
        }
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;

        .spinner-border {
            width: 3rem;
            height: 3rem;
            margin-bottom: 20px;
        }

        .loading-text {
            color: #fff;
            font-size: 16px;
            margin: 0;
        }
    }

    .no-data-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        padding: 40px 20px;

        .no-data-content {
            text-align: center;
            max-width: 400px;

            .no-data-icon {
                font-size: 64px;
                color: #666;
                margin-bottom: 24px;
            }

            .no-data-title {
                color: #fff;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 16px;
            }

            .no-data-text {
                color: #999;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 32px;
            }

            .custom-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background-color: var(--main-color, #ff6b35);
                color: #fff;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;

                &:hover {
                    background-color: var(--main-color-dark, #e55a2b);
                    transform: translateY(-2px);
                }
            }
        }
    }
</style>
