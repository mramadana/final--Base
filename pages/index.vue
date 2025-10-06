<template>
    <div>

        <!-- start to Home chart  -->

        <HomeStaticCard v-if="!loading" :items="items" />

        <SkeltonStaticCard v-else />

        <HomeCardInfo />

        <div class="row mb-5 equal-height-row">
            <div class="col-12 col-lg-4 equal-height-col">
                <HomeChart class="h-100" />
            </div>
            <div class="col-12 col-lg-8 equal-height-col">
                <div class="layout-form sm-radius h-100">
                    <div class="header-reservations">
                        <h3 class="main-title mb-0">{{ t("reservations.today_reservations") }}</h3>
                        <nuxt-link class="order-link" to="/reservations">
                            {{ t("reservations.all_reservations") }}
                            <i class="fa-solid fa-chevron-left fz-13 mr-1"></i>
                        </nuxt-link>
                    </div>
                    <OrdersCardReservation :items="reservations" :colClasses="['col-12 col-md-6']" />
                </div>
            </div>
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

    const loading = ref(false);
    const reservations = ref([
        {
            id: 12548,
            metaTime: 'م 01:25 - 05/12/2024',
            title: 'مطعم البيك طاوله رقم T10',
            dateRange: 'م 09:00 - 05/12/2025',
            customerName: 'فراس القمطاني',
            imageSrc: '/_nuxt/assets/images/Logo.svg',
            status: 'confirmed',
            statusText: 'مؤكد'
        },
        {
            id: 12549,
            metaTime: 'م 02:30 - 06/12/2024',
            title: 'مطعم البيك طاوله رقم T15',
            timeRange: 'م 07:30 - 09:30',
            customerName: 'سالم العتيبي',
            imageSrc: '/_nuxt/assets/images/Logo.svg',
            status: 'pending',
            statusText: 'قيد التأكيد'
        },
        {
            id: 12550,
            metaTime: 'م 03:15 - 07/12/2024',
            title: 'مطعم البيك طاوله رقم T20',
            dateRange: 'م 06:00 - 08:00',
            customerName: 'أحمد الشمري',
            imageSrc: '/_nuxt/assets/images/Logo.svg',
            status: 'canceled',
            statusText: 'ملغي'
        },
        {
            id: 12551,
            metaTime: 'م 04:00 - 08/12/2024',
            title: 'مطعم البيك طاوله رقم T5',
            dateRange: 'م 12:00 - 02:00',
            customerName: 'محمد الدوسري',
            imageSrc: '/_nuxt/assets/images/Logo.svg',
            status: 'confirmed',
            statusText: 'مؤكد'
        }
    ]);

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

    globalStore.title = pageTilte.value;
    globalStore.titleIcon = null;
    globalStore.titleLink = null;
    globalStore.subtitle = null;
</script>

<style lang="scss" scoped>
    .equal-height-row {
        display: flex;
        flex-wrap: wrap;
    }

    .equal-height-col {
        display: flex;
        flex-direction: column;
    }

    .header-reservations {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #444444;
        padding-bottom: 10px;
        .order-link {
            color: #F8F8F8CC;
            font-size: 14px;
            margin-bottom: 0;
        }
    }
</style>
