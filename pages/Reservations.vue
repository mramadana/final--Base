<template>
    <div class="layout-form">
  
      <h1 class="main-title md mb-4">{{ $t(pageTitle) }}</h1>
  
      <!-- Filter Component -->
      <ReservationFilter v-if="reservations?.length > 0" v-model="filterValues" :show-search="true" :show-select="true" :show-calendar="true"
        :search-placeholder="$t(authStore.userType === 'service' ? 'reservations.search_service' : 'reservations.search_table')" :select-options="statusOptions"
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

  import { useAuthStore } from '~/stores/auth';
  const authStore = useAuthStore();

  // const globalStore = useGlobalStore();
  // const pageHeadTitle = ref(t("Sidebar.tables"));
  // // Set global store
  // globalStore.title = pageHeadTitle.value;
  // globalStore.titleIcon = 'fa-solid fa-angle-left';
  // globalStore.titleLink = '/tables';
  // globalStore.subtitle = t('sideMenu.add_new_table');
  
  // Filter values
  const filterValues = ref({
    search: '',
    select: null,
    date: null
  });
  
  const debouncedSearch = ref('');
  let searchTimer = null;
  
  watch(
    () => filterValues.value.search,
    (val) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        debouncedSearch.value = (val || '').trim();
        currentPage.value = 1; // Reset to first page when search stabilizes
      }, 1000);
    }
  );
  
  onBeforeUnmount(() => {
    clearTimeout(searchTimer);
  });
  
  // Status options for select
  const statusOptions = ref([
    { id: 'all', name: 'الكل' },
    { id: 'waiting_list', name: 'قائمة الانتظار' },
    { id: 'pending', name: 'قيد الانتظار' },
    { id: 'pending_user_confirmation', name: 'في انتظار تأكيد المستخدم' },
    { id: 'scheduled', name: 'مجدول' },
    { id: 'in_progress', name: 'قيد التنفيذ' },
    { id: 'completed', name: 'مكتمل' },
    { id: 'cancelled', name: 'ملغي' }
  ]);
  
  // Handle filter events
  const handleSearch = (value) => {
    filterValues.value.search = value;
    fetchFilteredReservations();
  };
  
  const handleSelectChange = (value) => {
    filterValues.value.select = value;
    fetchFilteredReservations();
  };
  
  const handleDateChange = (value) => {
    filterValues.value.date = value;
    fetchFilteredReservations();
  };
  
  // Dummy data to show filter
  const reservations = ref([{ id: 1 }]);

  // Page title state
  const pageTitle = ref('Sidebar.my_reservation');

  // Function to set page title from child pages
  const setPageTitle = (title) => {
    pageTitle.value = title;
  };

  // Fetch filtered reservations from API
  const fetchFilteredReservations = async () => {
    // This will be called by child pages
    // The actual API call will be in child pages with their axios instance
  };

  // Build API query string based on filters
  const buildApiQuery = () => {
    const params = new URLSearchParams();
    
    if (debouncedSearch.value) {
      params.append('table_code', debouncedSearch.value);
    }
    
    if (filterValues.value.select && filterValues.value.select !== 'all') {
      params.append('status', filterValues.value.select);
    }
    
    if (filterValues.value.date) {
      params.append('date_at', filterValues.value.date);
    }
    
    return params.toString();
  };

  const filtersTrigger = computed(() => {
    return JSON.stringify({
      search: debouncedSearch.value,
      select: filterValues.value.select,
      date: filterValues.value.date
    });
  });

  // Filtering function - now just returns data (API handles filtering)
  const applyFilters = (data) => {
    return data; // API already filtered the data
  };
  
  // Paginator
  const currentPage = ref(1);
  const pageLimit = ref(10);
  const totalPage = ref(0);
  
  // Callback for child pages to register their fetch function
  const fetchDataCallback = ref(null);
  
  // Paginate Function
  const onPaginate = (e) => {
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    // Call child page fetch function if registered
    if (fetchDataCallback.value) {
      fetchDataCallback.value(currentPage.value);
    }
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
    applyFilters,
    buildApiQuery,
    filtersTrigger,
    setPageTitle,
    currentPage,
    pageLimit,
    totalPage,
    onPaginate,
    showPaginate,
    fetchDataCallback
  });
  
  </script>