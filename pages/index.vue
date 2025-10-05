<template>
    <div>

        <!-- start to Home chart  -->

        <HomeStaticCard v-if="!loading" :items="items"/>

        <SkeltonStaticCard v-else/>

        <HomeCardInfo/>
        <div class="row">
            <div class="col-12 col-lg-4">
                <HomeChart />
            </div>
            <div class="col-12 col-lg-8">
                <OrdersCardReservation :orders="orders" />
            </div>
        </div>

        <div class="index-page">
            <h1 class="main-title bold md mb-5">{{ $t("order.new_orders") }}</h1>
            <OrdersCardOrder :orders="orders" :additionalClasses="['background-color-card']" />
        </div>

    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const globalStore = useGlobalStore();
const pageTilte = ref(t("Titles.home"));

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
const items = ref([
    {
        title: 'الحجوزات الحالية',
        number: '١٢ حجز ضي لان',
        icon: '/_nuxt/assets/images/home-img/current-reservations.svg',
        link: '/reservations/current',
        buttonText: 'عرض جميع الحجوزات',
        dateText: 'اخر تحديث اليوم'
    },
    {
        title: 'الحجوزات الواردة',
        number: '٧ حجز واردة',
        icon: '/_nuxt/assets/images/home-img/incoming-reservations.svg',
        link: '/reservations/incoming',
        buttonText: 'عرض جميع الواردة',
        dateText: 'اخر تحديث اليوم'
    },
    {
        title: 'الحجوزات المكتملة',
        number: '٣٢ حجز مكتمل',
        icon: '/_nuxt/assets/images/home-img/completed-reservations.svg',
        link: '/reservations/completed',
        buttonText: 'عرض الحجوزات المكتملة',
        dateText: 'اخر تحديث اليوم'
    },
    {
        title: 'الحجوزات الملغية',
        number: '٢ حجز ملغي ضي لان',
        icon: '/_nuxt/assets/images/home-img/cancelled-reservations.svg',
        link: '/reservations/cancelled',
        buttonText: 'عرض الحجوزات الملغية',
        dateText: 'اخر تحديث اليوم'
    },
    {
        title: 'طلبات قائمة الانتظار',
        number: '٣ صفر في قائمة الانتظار',
        icon: '/_nuxt/assets/images/sidebar/timer.svg',
        link: '/waiting-list',
        buttonText: 'عرض الحجوزات الملغية',
        dateText: 'اخر تحديث اليوم'
    }
]);
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
globalStore.titleIcon = null;
globalStore.titleLink = null;
globalStore.subtitle = null;
</script>


<style lang="scss" scoped>
.index-page {
    :deep(.background-color-card) {
        background-color: #fff !important;
    }
}
</style>
