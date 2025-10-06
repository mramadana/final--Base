<template>
  <div class="container py-5">
    <h1 class="main-title mb-4">الحجوزات</h1>
    
    <!-- <OrdersCardReservation :items="reservations" link-to="/reservations" /> -->
    <OrdersCardReservation :items="reservations" />

    <!--***** Paginator *****-->
    <div class="paginate-parent" v-if="showPaginate">
      <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4" dir="ltr" />
    </div>
  </div>
</template>

<script setup>

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

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

// Paginate Function
const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    // fetchReservations();
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
});

</script>

<style scoped>
.main-title {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}
</style>
