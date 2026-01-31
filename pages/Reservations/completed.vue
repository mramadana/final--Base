<template>
  <div>
    <OrdersCardReservation :items="filteredReservations" :loading="loading" link-to="/reservation" />
  </div>
</template>

<script setup>

definePageMeta({
    name: 'sideMenu.completed_reservations'
})

  import { useI18n } from 'vue-i18n';
  const { t } = useI18n({ useScope: 'global' });

// Axios
const axios = useApi();

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

  const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("sideMenu.completed_reservations"));
globalStore.title = pageHeadTitle.value;


// Inject context from parent
const context = inject('reservationContext');

// Loading state
const loading = ref(false);

// Set page title and load data
onMounted(async () => {
  context.setPageTitle('reservations.view_completed_orders');
  // Register fetch callback for pagination
  context.fetchDataCallback.value = getCompletedReservations;
  // Reset pagination when entering this page
  context.totalPage.value = 0;
  context.pageLimit.value = 10;
  await getCompletedReservations();
});

// Reservations data - reactive for API
const reservations = ref([]);

// Get completed reservations from API
const getCompletedReservations = async (page = 1) => {
    loading.value = true;
    try {
        // Build query string from filters + status=completed
        const queryString = context.buildApiQuery();
        const baseUrl = `provider/reservations?status=completed`;
        const apiUrl = queryString ? `${baseUrl}&${queryString}&page=${page}` : `${baseUrl}&page=${page}`;
        
        const res = await axios.get(apiUrl, config.value);
        if (res.data.key === 'success') {
            const data = res.data.data;
            
            // Update parent context for paginator from API response
            if (data.pagination) {
                context.totalPage.value = data.pagination.total_items;
                context.pageLimit.value = data.pagination.per_page;
            }
            
            // Map reservations data to component format
            if (data.data && Array.isArray(data.data)) {
                reservations.value = data.data.map(item => ({
                    id: item.id,
                    reservationNum: item.reservation_num,
                    metaTime: item.created_at,
                    title: item.name,
                    dateRange: item.date,
                    customerName: item.user_name,
                    imageSrc: '/_nuxt/assets/images/Logo.svg',
                    status: item.status,
                    statusText: item.status_text
                }));
            }
        }
    } catch (error) {
        console.error("Get completed reservations error:", error);
        errorToast('حصل خطأ في تحميل الحجوزات المكتملة');
    } finally {
        loading.value = false;
    }
};

// Watch for filter changes and refetch data
watch(() => context.filtersTrigger.value, () => {
    getCompletedReservations(1);
});

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة! 
const filteredReservations = computed(() => {
  return reservations.value; // API already filtered with status=completed
});

</script>