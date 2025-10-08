<template>
    <div class="layout-form">

        <h1 class="main-title lg mb-4">الحجوزات</h1>

        <!-- Filter Component -->
        <ReservationFilter 
            v-model="filterValues"
            :show-search="true"
            :show-select="true"
            :show-calendar="true"
            search-placeholder="ابحث عن حجز..."
            search-label="البحث"
            :select-options="statusOptions"
            select-placeholder="حالة الحجز"
            select-label="الحالة"
            option-label="name"
            option-value="id"
            calendar-placeholder="اختر التاريخ"
            calendar-label="التاريخ"
            calendar-mode="single"
            @search="handleSearch"
            @select-change="handleSelectChange"
            @date-change="handleDateChange"
        />
        
        <OrdersCardReservation :items="filteredReservations" link-to="/reservations" />
    
        <!--***** Paginator *****-->
        <div class="paginate-parent" v-if="showPaginate">
          <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4" dir="ltr" />
        </div>

    </div>
</template>
  
<script setup>

// Filter values
const filterValues = ref({
  search: '',
  select: null,
  date: null
});

// Status options for select
const statusOptions = ref([
  { id: 1, name: 'الكل' },
  { id: 2, name: 'مؤكد' },
  { id: 3, name: 'قيد التأكيد' },
  { id: 4, name: 'ملغي' }
]);

// Handle filter events
const handleSearch = (value) => {
  console.log('Search:', value);
};

const handleSelectChange = (value) => {
  console.log('Select changed:', value);
};

const handleDateChange = (value) => {
  console.log('Date changed:', value);
};

// Reservations data
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

// Computed filtered reservations
const filteredReservations = computed(() => {
  let filtered = reservations.value;

  // Filter by search
  if (filterValues.value.search) {
    filtered = filtered.filter(item => 
      item.title.includes(filterValues.value.search) ||
      item.customerName.includes(filterValues.value.search)
    );
  }

  // Filter by status
  if (filterValues.value.select && filterValues.value.select !== 1) {
    const statusMap = {
      2: 'confirmed',
      3: 'pending',
      4: 'canceled'
    };
    filtered = filtered.filter(item => 
      item.status === statusMap[filterValues.value.select]
    );
  }

  return filtered;
});

// Paginator
const currentPage = ref(1);
const pageLimit = ref(10);
const totalPage = ref(40);

// Paginate Function
const onPaginate = (e) => {
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    // fetchReservations();
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
});

</script>