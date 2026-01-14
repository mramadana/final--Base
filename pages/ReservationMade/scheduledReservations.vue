<template>
  <div>
    <OrdersCardReservation :items="filteredReservations" :loading="loading" link-to="/reservation" />
  </div>
</template>

<script setup>

definePageMeta({
    name: 'sideMenu.scheduled_reservations'
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
const pageHeadTitle = ref(t("sideMenu.scheduled_reservations"));
globalStore.title = pageHeadTitle.value;

// Inject context from parent
const context = inject('reservationContext');

// Loading state
const loading = ref(false);

// Set page title and load data
onMounted(async () => {
  context.setPageTitle('reservations.scheduled_reservations');
  await getScheduledReservations();
});

// Reservations data - reactive for API
const reservations = ref([]);

// Pagination data
const pagination = ref({
    totalItems: 0,
    currentPage: 1,
    perPage: 20,
    totalPages: 1
});

// Get scheduled reservations from API
const getScheduledReservations = async (page = 1) => {
    loading.value = true;
    try {
        // Build query string from filters + status=scheduled
        const queryString = context.buildApiQuery();
        const baseUrl = `provider/reservations?status=scheduled`;
        const apiUrl = queryString ? `${baseUrl}&${queryString}&page=${page}` : `${baseUrl}&page=${page}`;
        
        const res = await axios.get(apiUrl, config.value);
        if (res.data.key === 'success') {
            const data = res.data.data;
            
            // Update pagination
            if (data.pagination) {
                pagination.value = {
                    totalItems: data.pagination.total_items || 0,
                    currentPage: data.pagination.current_page || 1,
                    perPage: data.pagination.per_page || 20,
                    totalPages: data.pagination.total_pages || 1
                };
            }
            
            // Map reservations data to component format
            if (data.data && Array.isArray(data.data)) {
                reservations.value = data.data.map(item => ({
                    id: item.id,
                    orderNum: item.order_num,
                    metaTime: item.created_at,
                    title: item.name || 'حجز مجدول',
                    dateRange: item.date,
                    customerName: item.customer_name,
                    imageSrc: '/_nuxt/assets/images/Logo.svg',
                    status: item.status,
                    statusText: item.status_text
                }));
            }
        }
    } catch (error) {
        console.error("Get scheduled reservations error:", error);
        errorToast('حصل خطأ في تحميل الحجوزات المجدولة');
    } finally {
        loading.value = false;
    }
};

// Watch for filter changes and refetch data
watch(
  () => context.filtersTrigger.value,
  () => {
    getScheduledReservations(1);
  }
);

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة! 
const filteredReservations = computed(() => {
  return reservations.value; // API already filtered with status=scheduled
});

</script>