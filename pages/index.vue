<template>
    <div>

        <!-- start to Home chart  -->

        <HomeStaticCard v-if="!loading" :items="items" />

        <SkeltonStaticCard v-else />

        <HomeCardInfo
        :notifications="homeData?.notifications || []"
        :subscription="homeData?.subscription || null"
        @delete-notification="handleDeleteNotification"
        />


        <div class="row mb-5 equal-height-row">
            <div class="col-12 col-lg-4 equal-height-col">
                <HomeChart 
                    class="h-100" 
                    :occupationPercentage="homeData?.occupation_percentage || { busy_tables_ratio: '0.00', free_tables_ratio: '0.00' }"
                />
            </div>
            <div class="col-12 col-lg-8 equal-height-col">
                <div class="layout-form sm-radius h-100">
                    <div class="header-reservations">
                        <h3 class="main-title mb-0">{{ t("reservations.today_reservations") }}</h3>
                        <nuxt-link class="order-link" to="/Reservations/myReservations">
                            {{ t("reservations.all_reservations") }}
                            <i class="fa-solid fa-chevron-left fz-13 mr-1"></i>
                        </nuxt-link>
                    </div>
                    <OrdersCardReservation :items="reservations" :colClasses="['col-12 col-md-6']" :loading="loading" />
                </div>
            </div>
        </div>

        <!-- Criteria Dialog -->

        <div class="Criteria_Dialog">
            <Dialog
                v-model:visible="showCriteriaDialog"
                modal
                class="custum_dialog_width lg"
                :draggable="false"
                appendTo=".Criteria_Dialog"
            >
                <div class="mb-4">
                    <h3 class="main-title md mb-0">
                    {{ t("Global.standards_title") }}
                    </h3>
                </div>
                <div class="layout-form mb-0">
                    <CommonCriteria ref="criteriaComponent" @close-dialog="showCriteriaDialog = false" />
                </div>
            </Dialog>
        </div>

    </div>
</template>

<script setup>
    import { useI18n } from 'vue-i18n';

    // Icons
    import currentReservationsIcon from '@/assets/images/home-img/current-reservations.svg';
    import incomingReservationsIcon from '@/assets/images/home-img/incoming-reservations.svg';
    import completedReservationsIcon from '@/assets/images/home-img/completed-reservations.svg';
    import cancelledReservationsIcon from '@/assets/images/home-img/cancelled-reservations.svg';
    import timerIcon from '@/assets/images/sidebar/timer.svg';

    const { t } = useI18n({ useScope: 'global' });
    const globalStore = useGlobalStore();
    const authStore = useAuthStore();
    // Toast
    const { successToast, errorToast } = toastMsg();
    const axios = useApi();
    const { response } = responseApi();
    const pageTilte = ref(t("Titles.home"));

    definePageMeta({
        name: "Titles.home",
        middleware: 'auth'
    });
    const countTextMap = {
        in_progress_reservations: 'reservations.in_progress_reservations',
        pending_reservations: 'reservations.pending_reservations',
        completed_reservations: 'reservations.completed_reservations',
        cancelled_reservations: 'reservations.cancelled_reservations',
        waiting_list_reservations: 'reservations.waiting_list_reservations'
    };


    const loading = ref(true);
    const showCriteriaDialog = ref(false);
    const criteriaComponent = ref(null);
    const reservations = ref([]);
    const homeData = ref(null);

    const items = ref([
        {
            title: t('home.current_reservations'),
            number: t('home.zero_reservations'),
            icon: currentReservationsIcon,
            link: '/Reservations/myReservations',
            buttonText: t('home.show_all_reservations'),
            dateText: t('home.last_updated_today')
        },
        {
            title: t('home.incoming_reservations'),
            number: t('home.zero_reservations'),
            icon: incomingReservationsIcon,
            link: '/orders/new',
            buttonText: t('home.show_all_incoming'),
            dateText: t('home.last_updated_today')
        },
        {
            title: t('home.completed_reservations'),
            number: t('home.zero_reservations'),
            icon: completedReservationsIcon,
            link: '/Reservations/completed',
            buttonText: t('home.show_completed_reservations'),
            dateText: t('home.last_updated_today')
        },
        {
            title: t('home.cancelled_reservations'),
            number: t('home.zero_reservations'),
            icon: cancelledReservationsIcon,
            link: '/reservations/cancelled',
            buttonText: t('home.show_cancelled_reservations'),
            dateText: t('home.last_updated_today')
        },
        {
            title: t('home.waiting_list_reservations'),
            number: t('home.zero_reservations'),
            icon: timerIcon,
            link: '/orders/waiting',
            buttonText: t('home.show_waiting_list'),
            dateText: t('home.last_updated_today')
        }
    ]);

    const handleDeleteNotification = async (id) => {
        try {
            const config = {
            headers: { Authorization: `Bearer ${authStore.token}` }
            };

            const res = await axios.delete(
            `provider/notifications/delete/${id}`,
            config
            );

            if (response(res) === 'success') {
                homeData.value.notifications =
                homeData.value.notifications.filter(n => n.id !== id);
                successToast(res?.data?.msg)
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Fetch home data from API
    const fetchHomeData = async () => {
        try {
            loading.value = true;
            const config = {
                headers: { Authorization: `Bearer ${authStore.token}` }
            };

            await axios.get("provider/home", config).then(res => {
                if (response(res) == "success") {
                    homeData.value = res.data.data;

                    // Update items with counts
                    if (res.data.data.counts) {
                        const counts = res.data.data.counts;
                        items.value[0].number = `${counts.in_progress_reservations} ${t(countTextMap.in_progress_reservations)}`;
                        items.value[1].number = `${counts.pending_reservations} ${t(countTextMap.pending_reservations)}`;
                        items.value[2].number = `${counts.completed_reservations} ${t(countTextMap.completed_reservations)}`;
                        items.value[3].number = `${counts.cancelled_reservations} ${t(countTextMap.cancelled_reservations)}`;
                        items.value[4].number = `${counts.waiting_list_reservations} ${t(countTextMap.waiting_list_reservations)}`;
                    }

                    // Transform reservations data
                    if (res.data.data.reservations && Array.isArray(res.data.data.reservations)) {
                        reservations.value = res.data.data.reservations.map(res => ({
                            id: res.id,
                            metaTime: res.created_at || '',
                            title: res.name || res.reservation_num || '',
                            dateRange: res.date || '',
                            customerName: res.user_name || '',
                            status: res.status || 'pending',
                            statusText: res.status_text || t('reservations.waiting_for_response'),
                            reservation_num: res.reservation_num || ''
                        }));
                    }

                    // Show criteria dialog if needed
                    if (res.data.data.has_choosen_standards === false) {
                        setTimeout(() => {
                            showCriteriaDialog.value = true;
                        }, 1000);
                    }
                }
            }).catch(err => {
                console.error("Error fetching home data:", err);
            }).finally(() => {
                loading.value = false;
            });
        } catch (error) {
            console.error("Error in fetchHomeData:", error);
            loading.value = false;
        }
    };

    onMounted(async () => {
        globalStore.title = pageTilte.value;
        globalStore.titleIcon = null;
        globalStore.titleLink = null;
        globalStore.subtitle = null;
        
        await fetchHomeData();
    });
</script>

<style lang="scss" scoped>

    .Criteria_Dialog {
        position: relative;
        :deep(.custum_dialog_width) {
            margin-inline-start: 200px !important;
            @media (max-width: 1200px) {
                margin-inline-start: 15px !important;
            }
        }
    }

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
