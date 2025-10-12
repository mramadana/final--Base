<template>
    <div class="layout-form">
  
      <h1 class="main-title md mb-4">{{ $t(pageTitle) }}</h1>
  
      <!-- Filter Component -->
      <ReservationFilter v-if="reservations?.length > 0" v-model="filterValues" :show-search="true" :show-select="true" :show-calendar="true"
        :search-placeholder="$t('reservations.search_table')" :select-options="statusOptions"
        :select-placeholder="$t('reservations.status')" option-label="name" option-value="id"
        :calendar-placeholder="$t('reservations.choose_date')" calendar-mode="single" @search="handleSearch"
        @select-change="handleSelectChange" @date-change="handleDateChange" />
  
        <!-- Child pages will display their own content with transitions -->
        <NuxtPage />
  
      <!--***** Paginator *****-->
      <div class="paginate-parent" v-if="showPaginate">
        <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4" dir="ltr" />
      </div>
  
    </div>
  </template>
  
  <script setup>
  
  definePageMeta({
      name: 'Sidebar.my_reservation'
  })

  import { useI18n } from 'vue-i18n';
  const { t } = useI18n({ useScope: 'global' });

  const globalStore = useGlobalStore();


  // Page title - يتغير من الصفحات الفرعية
  const pageTitle = ref('reservations.view_reservations');

  const pageHeadTitle = ref(t("reservations.reservations"));
  
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
  
  // Dummy data to show filter
  const reservations = ref([{ id: 1 }]);

  // Function to set page title from child pages
  const setPageTitle = (title) => {
    pageTitle.value = title;
  };

  // Filtering function - مكتوب مرة واحدة بس هنا! 🎯
  const applyFilters = (data) => {
    let filtered = data;

    // Filter by search
    if (filterValues.value.search) {
      filtered = filtered.filter(item =>
        item.title?.includes(filterValues.value.search) ||
        item.customerName?.includes(filterValues.value.search)
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
  };
  
  // Paginator
  const currentPage = ref(1);
  const pageLimit = ref(10);
  const totalPage = ref(0);
  
  // Paginate Function
  const onPaginate = (e) => {
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
  };
  
  /******************* Computed *******************/
  let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
  });

  // Provide filter function and values to child pages
  provide('reservationContext', {
    filterValues,
    statusOptions,
    handleSearch,
    handleSelectChange,
    handleDateChange,
    applyFilters,  // الـ function بس، مش البيانات!
    setPageTitle,  // لتغيير الـ title
    currentPage,
    pageLimit,
    totalPage,
    onPaginate,
    showPaginate
  });
  
  globalStore.title = pageHeadTitle.value;
    globalStore.titleIcon = null;
    globalStore.titleLink = null;
    globalStore.subtitle = null;
  </script>