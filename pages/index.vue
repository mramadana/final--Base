<template>
    <div>

        <div class="sub-screption layout-form sm-radius">

            <div class="text d-flex align-items-center gap-3">
                <i class="fa-solid fa-stopwatch icon"></i>
                <h3 class="main-title bold mb-0">{{ $t("order.complete_order") }}</h3>
            </div>
            <NuxtLink to="" class="custom-btn sm">{{ $t("order.subscription") }}</NuxtLink>
        </div>

        <!-- start to home Slider  -->
        <HomeSlider class="mb-5" :slider="sliderHome" :loading="loading" :slider_title="true" />

        <!-- start to Home chart  -->
        <div class="mb-5">
            <h1 class="main-title bold md mb-5">{{ $t("Home.new_request_statistics") }}</h1>
            <div class="layout-form sm-radius mt-5">
                <HomeChart />
            </div>
        </div>

        <div class="index-page">
            <h1 class="main-title bold md mb-5">{{ $t("order.new_orders") }}</h1>
            <OrdersCardOrder :orders="orders" :additionalClasses="['background-color-card']"/>
        </div>

    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const globalStore = useGlobalStore();
const { user } = storeToRefs(useAuthStore());
const pageTilte = ref(t("Global.welcome") + " " + user?.value?.name + " 😊");

definePageMeta({
    name: "Titles.home",
});

const sliderHome = ref([
    {
        id: 1,
        image: "/_nuxt/assets/images/Logo.svg",
        title: "Home page",
        description: "Home page description",
    },
    {
        id: 2,
        image: "/_nuxt/assets/images/walletillustration.png",
        title: "Home page",
        description: "Home page description",
    },
    {
        id: 3,
        image: "/_nuxt/assets/images/walletillustration.png",
        title: "Home page",
        description: "Home page description",
    }
]);
const loading = ref(false);
const orders = ref([
    {
        id: 1,
        car_image: '/_nuxt/assets/images/Logo.svg',
        type: 'منتج',
        since: '35 ساعة',
        user_name: 'Toyota Camry',
        status_text: 'Pending',
        order_number: '#123456',
        isProduct: true
    },
    {
        id: 2,
        car_image: '/_nuxt/assets/images/Logo.svg',
        type: 'منتج',
        since: '35 ساعة',
        user_name: 'Honda Civic',
        status_text: 'Completed',
        order_number: '#123456',
        isProduct: false
    },
    {
        id: 3,
        car_image: '/_nuxt/assets/images/Logo.svg',
        type: 'منتج',
        since: '35 ساعة',
        user_name: 'Ford Mustang',
        status_text: 'In Progress',
        order_number: '#123456',
        isProduct: true
    },
    {
        id: 4,
        car_image: '/_nuxt/assets/images/Logo.svg',
        type: 'منتج',
        since: '35 ساعة',
        user_name: 'Chevrolet Malibu',
        status_text: 'Cancelled',
        order_number: '#123456',
        isProduct: true
    }
]);

globalStore.title = pageTilte.value;
</script>

<style scoped lang="scss">
    .sub-screption {
        background-color: rgba(195, 22, 22, 30%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 30px;
        @media (max-width: 550px) {
            flex-direction: column;
        }
        .icon {
            color: #C31616;
            font-size: 25px;
        }
    }
</style>

<style lang="scss" scoped>
.index-page {
    :deep(.background-color-card) {
        background-color: #fff !important;
    }
}
</style>
