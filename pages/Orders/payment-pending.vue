<template>
    <div>
        <OrdersCardReservation
            :items="filteredReservations"
            :loading="loading"
            link-to="/reservation"
        />
    </div>
</template>

<script setup>

// Images
import Logo from '@/assets/images/Logo.svg';

definePageMeta({
    name: "orders.payment_pending",
});

import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

// Axios
const axios = useApi();

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` },
}));

const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.pending_payment"));
globalStore.title = pageHeadTitle.value;

// Inject context from parent
const context = inject("reservationContext", null);

// Loading state
const loading = ref(false);

// Set page title and load data
onMounted(async () => {
    if (context) {
        context.setPageTitle("orders.payment_pending_orders");
        // Register fetch callback for pagination
        context.fetchDataCallback.value = getPaymentPendingOrders;
        // Reset pagination when entering this page
        context.totalPage.value = 0;
        context.pageLimit.value = 10;
    }
    await getPaymentPendingOrders();
});

// Orders data - reactive for API
const reservations = ref([]);

// Get payment pending orders from API
const getPaymentPendingOrders = async (page = 1) => {
    loading.value = true;
    try {
        // Build query string from filters + status=payment_pending
        const queryString = context?.buildApiQuery() || '';
        const baseUrl = `provider/reservations?status=pending_user_confirmation`;
        const apiUrl = queryString
            ? `${baseUrl}&${queryString}&page=${page}`
            : `${baseUrl}&page=${page}`;

        const res = await axios.get(apiUrl, config.value);
        if (res.data.key === "success") {
            const data = res.data.data;

            // Update parent context for paginator from API response
            if (data.pagination && context) {
                context.totalPage.value = data.pagination.total_items;
                context.pageLimit.value = data.pagination.per_page;
            }

            // Map orders data to component format
            if (data.data && Array.isArray(data.data)) {
                reservations.value = data.data.map((item) => ({
                    id: item.id,
                    orderNum: item.order_num,
                    metaTime: item.created_at,
                    title: item.restaurant_name || "طلب في انتظار الدفع",
                    dateRange: item.date,
                    customerName: item.customer_name,
                    imageSrc: Logo,
                    status: item.status,
                    statusText: item.status_text,
                }));
            }
        }
    } catch (error) {
        console.error("Get payment pending orders error:", error);
        errorToast("حصل خطأ في تحميل الطلبات في انتظار الدفع");
    } finally {
        loading.value = false;
    }
};

// Watch for filter changes and refetch data
watch(
    () => context?.filtersTrigger?.value,
    () => {
        if (context) {
            context.currentPage.value = 1; // Reset to first page
            getPaymentPendingOrders(1);
        }
    },
);

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة!
const filteredReservations = computed(() => {
    return reservations.value; // API already filtered with status=payment_pending
});
</script>
