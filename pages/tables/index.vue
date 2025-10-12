<template>
    <div class="layout-form">
  
      <h1 class="main-title md mb-4">{{ $t('tables.table_status') }}</h1>
  
      <!-- Filter Component -->
      <ReservationFilter 
        v-if="tables?.length > 0" 
        v-model="filterValues" 
        :show-search="true" 
        :show-select="true" 
        :show-calendar="true"
        :search-placeholder="$t('reservations.search_table')" 
        :select-options="statusOptions"
        :select-placeholder="$t('tables.table_status')" 
        option-label="name" 
        option-value="id"
        :calendar-placeholder="$t('reservations.choose_date')" 
        calendar-mode="single" 
        @search="handleSearch"
        @select-change="handleSelectChange" 
        @date-change="handleDateChange" 
      />
        
      <!-- Data Table -->
      <DatatableTable
        v-if="filteredTables?.length > 0"
        :products="filteredTables"
        :columns="tableColumns"
        :rows="10"
        :sortable="false"
        :showImage="true"
        :routeTable="{
          header: $t('tables.actions'),
          path: '/tables',
          id: 'id'
        }"
        @deleteItem="handleDeleteItem"
        @refreshData="fetchTablesData"
        @editItem="handleEditItem"
        @viewItem="handleViewItem"
      />

      <!-- No Data -->
      <div v-else class="no-data-message">
        <p>{{ $t('noData.no_reservations') }}</p>
      </div>
  
    </div>
  </template>
  
  <script setup>
  
  definePageMeta({
      name: 'Sidebar.tables'
  })

  import { useI18n } from 'vue-i18n';
  const { t } = useI18n({ useScope: 'global' });

  const globalStore = useGlobalStore();

  const pageHeadTitle = ref(t("Sidebar.tables"));
  
  // Filter values
  const filterValues = ref({
    search: '',
    select: null,
    date: null
  });
  
  // Status options for select
  const statusOptions = ref([
    { id: 1, name: t('tables.all') },
    { id: 2, name: t('tables.available') },
    { id: 3, name: t('tables.reserved') },
    { id: 4, name: t('tables.closed') }
  ]);

  // Table Columns (من اليمين لليسار حسب الصورة)
  const tableColumns = ref([
    { field: 'image', header: t('tables.table_image') },
    { field: 'id', header: t('tables.table_number') },
    { field: 'numberOfPeople', header: t('tables.number_of_people') },
    { field: 'bookingPrice', header: t('tables.booking_price') },
    { field: 'bookingDate', header: t('tables.booking_date') },
    { field: 'reservations', header: t('tables.reservations') },
    { field: 'status', header: t('tables.table_status') }
  ]);
  
  // Fake Data for Tables
  const tables = ref([
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'متاحة',
      statusBadge: 'available'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'متاحة',
      statusBadge: 'available'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'محجوزة',
      statusBadge: 'reserved'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'محجوزة',
      statusBadge: 'reserved'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'متاحة',
      statusBadge: 'available'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'متاحة',
      statusBadge: 'available'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'محجوزة',
      statusBadge: 'reserved'
    },
    {
      id: 'T698',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      tableNumber: '١٠',
      numberOfPeople: '٥ أفراد',
      bookingPrice: '١٠ ر.س',
      bookingDate: '١١/٢/٢٠٢٥',
      reservations: 'الحجوزات',
      status: 'محجوزة',
      statusBadge: 'reserved'
    }
  ]);
  
  // Handle filter events
  const handleSearch = (value) => {
    filterValues.value.search = value;
  };
  
  const handleSelectChange = (value) => {
    filterValues.value.select = value;
  };
  
  const handleDateChange = (value) => {
    filterValues.value.date = value;
  };

  // Computed: Filtered Tables
  const filteredTables = computed(() => {
    let filtered = tables.value;

    // Filter by search (table number)
    if (filterValues.value.search) {
      filtered = filtered.filter(item =>
        item.tableNumber?.includes(filterValues.value.search)
      );
    }

    // Filter by status
    if (filterValues.value.select && filterValues.value.select !== 1) {
      const statusMap = {
        2: 'available',
        3: 'reserved',
        4: 'closed'
      };
      filtered = filtered.filter(item =>
        item.statusBadge === statusMap[filterValues.value.select]
      );
    }

    // Filter by date (if needed)
    if (filterValues.value.date) {
      // Add date filtering logic here
    }

    return filtered;
  });
  
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

  // Fetch Tables Data (API Call)
  const fetchTablesData = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await $fetch('/api/tables');
      // tables.value = response.data;
      
      // For now, using static data - refresh will keep current data
      console.log('Refreshing tables data...');
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  // Handle Delete Item (local removal)
  const handleDeleteItem = (id) => {
    // Remove from local array after successful API delete
    const index = tables.value.findIndex(item => item.id === id);
    if (index > -1) {
      tables.value.splice(index, 1);
    }
  };

  // Handle Edit Item
  const handleEditItem = (id) => {
    console.log('Edit item:', id);
    // Navigate to edit page or open edit dialog
    // navigateTo(`/tables/edit/${id}`);
  };

  // Handle View Item
  const handleViewItem = (id) => {
    console.log('View item:', id);
    // Navigate to view page
    // navigateTo(`/tables/${id}`);
  };

  // Set global store
  globalStore.title = pageHeadTitle.value;
  globalStore.titleIcon = null;
  globalStore.titleLink = null;
  globalStore.subtitle = null;
  </script>

  <style scoped lang="scss">
  .no-data-message {
    text-align: center;
    padding: 40px;
    color: #888;
    font-size: 16px;
  }
  </style>