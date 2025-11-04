<template>
  <div>
    <OrdersCardReservation :items="filteredReservations" link-to="/reservation" />
  </div>
</template>

<script setup>

definePageMeta({
    name: 'Sidebar.waiting_list'
})

import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

// Global store
const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.waiting_list"));
globalStore.title = pageHeadTitle.value;

// Inject context from parent
const context = inject('reservationContext');

// Set page title
onMounted(() => {
  context.setPageTitle('orders.review_requests_waiting');
});

// Reservations data (cancelled only) - بيانات بس!
const reservations = [
  {
    id: 12550,
    metaTime: 'م 03:15 - 07/12/2024',
    title: 'مطعم البيك طاوله رقم T20',
    dateRange: 'م 06:00 - 08:00',
    customerName: 'أحمد الشمري',
    imageSrc: '/_nuxt/assets/images/Logo.svg',
    status: 'canceled',
    statusText: 'ملغي'
  }
];

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة! 🎯
const filteredReservations = computed(() => {
  return context.applyFilters(reservations);
});

</script>

