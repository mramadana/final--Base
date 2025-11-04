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
        :actionsHeader="$t('tables.actions')"
        @refreshData="fetchTablesData"
      >
        <template #actions="{ data }">
          <div class="table-actions-group">
            <button class="table-action-btn btn-view" @click="handleViewItem(data.id)">
              <i class="fas fa-eye"></i>
              {{ $t('tables.view') }}
            </button>
            <button class="table-action-btn btn-edit" @click="handleEditItem(data.id)">
              {{ $t('tables.edit') }}
            </button>
            <button class="table-action-btn btn-delete" @click="openDeleteDialog(data.id)">
              {{ $t('tables.delete_table') }}
            </button>
          </div>
        </template>
      </DatatableTable>

      <!-- No Data -->
      <div v-else class="no-data-message">
        <p>{{ $t('noData.no_reservations') }}</p>
      </div>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:visible="showDeleteDialog" modal :draggable="false" class="custum_dialog_width without-close" :style="{ width: '500px' }">
        <div class="delete-content">
          <img src="@/assets/images/alert.gif" loading="lazy" alt="check-img" class="lgg mb-4">
          <h3 class="main-title md mb-0">{{ $t('tables.delete_confirmation') }}</h3>
          <div class="delete-actions">
            <button @click="showDeleteDialog = false" class="btn-cancel" :disabled="isDeleting">
              {{ $t('tables.cancel') }}
            </button>
            <button @click="confirmDelete" class="btn-confirm-delete" :disabled="isDeleting">
              <i v-if="isDeleting" class="fas fa-spinner fa-spin"></i>
              <span v-else>{{ $t('tables.confirm_delete') }}</span>
            </button>
          </div>
        </div>
      </Dialog>
  
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
  
  // Delete dialog state
  const showDeleteDialog = ref(false);
  const itemToDelete = ref(null);
  const isDeleting = ref(false);
  
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
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
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
      id: '7',
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
      id: '8',
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

  // Open delete dialog
  const openDeleteDialog = (id) => {
    itemToDelete.value = id;
    showDeleteDialog.value = true;
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!itemToDelete.value) return;
    
    isDeleting.value = true;
    
    try {
      // API Call - replace with your actual endpoint
      const response = await $fetch(`/api/tables/${itemToDelete.value}`, {
        method: 'DELETE'
      });
      
      // Success - remove from local array
      const index = tables.value.findIndex(item => item.id === itemToDelete.value);
      if (index > -1) {
        tables.value.splice(index, 1);
      }
      
      // Close dialog and reset
      showDeleteDialog.value = false;
      itemToDelete.value = null;
      
      // Optional: Show success message
      // useToast().success('تم حذف الطاولة بنجاح');
      
    } catch (error) {
      console.error('Delete error:', error);
      // Optional: Show error message
      // useToast().error('حدث خطأ أثناء حذف الطاولة');
    } finally {
      isDeleting.value = false;
    }
  };

  // Handle Edit Item
  const handleEditItem = (id) => {
    console.log('Edit item:', id);
    navigateTo({
      path: '/tables/editTable',
      query: { id: id }
    });
  };

  // Handle View Item
  const handleViewItem = (id) => {
    console.log('View item:', id);
    navigateTo({
      path: '/tables/viewTable',
      query: { id: id }
    });
  };

  // Set global store
  globalStore.title = pageHeadTitle.value;
  globalStore.titleIcon = 'fa-solid fa-angle-left';
  globalStore.titleLink = null;
  globalStore.subtitle = t('sideMenu.my_tables');
  </script>

  <style scoped lang="scss">
  .no-data-message {
    text-align: center;
    padding: 40px;
    color: #888;
    font-size: 16px;
  }

  .delete-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }

  .delete-actions {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-top: 8px;
    
    button {
      flex: 1;
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-cancel {
      background: #fff;
      color: #1a1a1a;
      
      &:hover:not(:disabled) {
        background: #f0f0f0;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    
    .btn-confirm-delete {
      background: #DC2626;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      &:hover:not(:disabled) {
        background: #B91C1C;
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      i.fa-spinner {
        font-size: 16px;
      }
    }
  }
  </style>