<template>
    <div class="layout-form">
  
      <h1 class="main-title md mb-4">{{ $t('tables.table_status') }}</h1>
  
      <!-- Filter Component -->
      <ReservationFilter 
        v-if="!loading && filteredTables?.length > 0" 
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
        
      <!-- ***** datatable ***** -->
      <div v-if="!loading">
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
      </div>

      <!-- ***** datatable skeleton ***** -->
      <div v-if="loading">
        <DatatableSkelton :SkeletonProducts="SkeletonProducts" />
      </div>

      <!--***** Paginator *****-->
      <div class="paginate-parent mt-4" v-if="showPaginate">
        <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" dir="ltr" />
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

  // Axios
  const axios = useApi();

  // Toast
  const { successToast, errorToast } = toastMsg();

  // pinia store
  const store = useAuthStore();
  const { token } = storeToRefs(store);

  // config
  const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
  }));

  const globalStore = useGlobalStore();

  const pageHeadTitle = ref(t("Sidebar.tables"));
  
  // Loading state
  const loading = ref(true);
  
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
    { id: 3, name: t('tables.reserved') }
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

  // Skeleton products for loading state
  const SkeletonProducts = new Array(tableColumns.value.length);
  
  // Tables data - reactive for API
  const tables = ref([]);
  
  // Handle filter events with debounce
  let searchTimeout = null;
  
  const handleSearch = (value) => {
    // Clear previous timeout if user is still typing
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for 3 seconds
    searchTimeout = setTimeout(() => {
      filterValues.value.search = value;
      getData(1); // Refetch data with filters
    }, 1000);
  };
  
  const handleSelectChange = (value) => {
    filterValues.value.select = value;
    getData(1); // Refetch data with filters
  };
  
  const handleDateChange = (value) => {
    filterValues.value.date = value;
    getData(1); // Refetch data with filters
  };

  // Computed: Filtered Tables (API handles filtering)
  const filteredTables = computed(() => {
    return tables.value; // API already filtered the data
  });
  
  // Paginator
  const currentPage = ref(1);
  const pageLimit = ref();
  const totalPage = ref();
  
  // Paginate Function
  const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    getData();
  };
  
  /******************* Computed *******************/
  let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value
  });

  // Get Data Function (API Call)
  const getData = async (page = 1) => {
    loading.value = true;
    
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      params.append('page', page);
      
      if (filterValues.value.search) {
        params.append('table_code', filterValues.value.search); // Search by table code
      }
      
      if (filterValues.value.select && filterValues.value.select !== 1) {
        const statusMap = {
          2: 'available',
          3: 'reserved'
        };
        params.append('status', statusMap[filterValues.value.select]);
      }
      
      if (filterValues.value.date) {
        params.append('date_at', filterValues.value.date);
      }
      
      const apiUrl = `provider/tables?${params.toString()}`;
      
      const res = await axios.get(apiUrl, config.value);
      
      if (res.data.key === 'success') {
        const data = res.data.data;
        
        // Update pagination
        if (data.pagination) {
          totalPage.value = data.pagination.total_items || 0;
          pageLimit.value = data.pagination.per_page || 20;
        }
        
        // Map tables data to component format
        if (data.data && Array.isArray(data.data)) {
          tables.value = data.data.map(item => ({
            id: item.id,
            image: item.image || '/_nuxt/assets/images/Logo.svg',
            tableNumber: item.code,
            numberOfPeople: `${item.people_number} أفراد`,
            bookingPrice: `${item.price} ${item.currency}`,
            bookingDate: item.created_at || '-',
            reservations: 'الحجوزات', // You might need to get this from API
            // status: item.status === 'available' ? 'متاحة' : item.status === 'reserved' ? 'محجوزة' : 'مغلقة',
            status: item.is_reserved == true ? 'محجوزة' : item.is_reserved == false ? 'متاحة' : 'مغلقة',
            statusBadge: item.is_reserved,
            // Keep original data for reference
            originalData: item
          }));
        }
      }
      
    } catch (err) {
      console.error('Get tables error:', err);
      errorToast('حصل خطأ في تحميل الطاولات');
    } finally {
      loading.value = false;
    }
  };

  // Fetch Tables Data (API Call)
  const fetchTablesData = async () => {
    await getData();
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
      // API Call to delete table
      const res = await axios.delete(`provider/tables/${itemToDelete.value}`, config.value);
      
      if (res.data.key === 'success') {
        // Success - remove from local array
        const index = tables.value.findIndex(item => item.id === itemToDelete.value);
        if (index > -1) {
          tables.value.splice(index, 1);
        }
        
        // Close dialog and reset
        showDeleteDialog.value = false;
        itemToDelete.value = null;
        
        successToast('تم حذف الطاولة بنجاح');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      errorToast('حدث خطأ أثناء حذف الطاولة');
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

  // OnMounted - Get data on page load
  onMounted(async () => {
    await getData();
  });
  </script>

  <style scoped lang="scss">

  :deep(.status-false) {
    background: rgba(255, 255, 255, 0.25);
    color: white !important;
  }

  :deep(.status-true) {
    background: #305539;
    color: white !important;
  }
  
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