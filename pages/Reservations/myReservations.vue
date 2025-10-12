
<template>
    <div>
      <OrdersCardReservation :items="filteredReservations" link-to="/reservation" />
    </div>
  </template>

<script setup>

definePageMeta({
    name: 'sideMenu.my_reservations'
})

// Inject context from parent
const context = inject('reservationContext');

// Set page title
onMounted(() => {
  context.setPageTitle('reservations.view_reservations');
});

// Reservations data - البيانات بس!
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
];

// استخدام الـ function من الصفحة الرئيسية - مكتوبة مرة واحدة! 🎯
const filteredReservations = computed(() => {
  return context.applyFilters(reservations);
});

</script>