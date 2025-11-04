<template>
  <div>
    <OrdersCardReservation :items="filteredReservations" link-to="/reservation" />
  </div>
</template>

<script setup>

definePageMeta({
    name: 'sideMenu.completed_reservations'
})

  import { useI18n } from 'vue-i18n';
  const { t } = useI18n({ useScope: 'global' });

  const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("sideMenu.completed_reservations"));
globalStore.title = pageHeadTitle.value;


// Inject context from parent
const context = inject('reservationContext');

// Set page title
onMounted(() => {
  context.setPageTitle('reservations.view_completed_orders');
});

// Reservations data (completed only) - بيانات بس!
const reservations = [
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
    id: 12551,
    metaTime: 'م 04:00 - 08/12/2024',
    title: 'مطعم البيك طاوله رقم T5',
    dateRange: 'م 12:00 - 02:00',
    customerName: 'محمد الدوسري',
    imageSrc: '/_nuxt/assets/images/Logo.svg',
    status: 'confirmed',
    statusText: 'مؤكد'
  }
];

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة! 🎯
const filteredReservations = computed(() => {
  return context.applyFilters(reservations);
});

</script>