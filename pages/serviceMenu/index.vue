<template>
  <div class="layout-form">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>{{ $t('menu.loading_services') }}</p>
    </div>

    <div v-else>

      <!-- Filter Component -->
      <ReservationFilter 
        v-if="!loading && showFilter" 
        v-model="filterValues" 
        :show-search="true" 
        :show-calendar="true"
        :show-select="false" 
        :search-placeholder="$t('menu.search_service')" 
        :calendar-placeholder="$t('menu.menu_date')" 
        calendar-mode="single" 
        @search="handleSearch"
        @date-change="handleDateChange"
      />
        
      <!-- Data Table -->
      <DatatableTable
        v-if="filteredServices?.length > 0"
        :products="filteredServices"
        :columns="serviceColumns"
        :rows="10"
        :sortable="false"
        :showImage="true"
        :actionsHeader="$t('menu.actions')"
        @refreshData="fetchServicesData"
      >
        <template #actions="{ data }">
          <div class="table-actions-group">
            <button class="table-action-btn btn-view" @click="handleViewItem(data.id)">
              <i class="fas fa-eye"></i>
              {{ $t('menu.view') }}
            </button>
            <button class="table-action-btn btn-edit" @click="handleEditItem(data.id)">
              {{ $t('menu.edit') }}
            </button>
            <button class="table-action-btn btn-delete" @click="openDeleteDialog(data.id)">
              {{ $t('menu.delete_service') }}
            </button>
          </div>
        </template>
      </DatatableTable>


        <!-- No Data -->
        <div v-else class="no-data-message">
          <p>{{ $t('menu.no_services') }}</p>
        </div>
    </div>

      <!--***** Paginator *****-->
      <div class="paginate-parent mt-4" v-if="showPaginate">
        <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" dir="ltr" />
      </div>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:visible="showDeleteDialog" modal :draggable="false" class="custum_dialog_width without-close" :style="{ width: '500px' }">
        <div class="delete-content">
          <img src="@/assets/images/alert.gif" loading="lazy" alt="check-img" class="lgg mb-4">
          <h3 class="main-title md mb-0">{{ $t('menu.delete_service_confirm') }}</h3>
          <div class="delete-actions">
            <button @click="showDeleteDialog = false" class="btn-cancel" :disabled="isDeleting">
              {{ $t('menu.cancel') }}
            </button>
            <button @click="confirmDelete" class="btn-confirm-delete" :disabled="isDeleting">
              <i v-if="isDeleting" class="fas fa-spinner fa-spin"></i>
              <span v-else>{{ $t('menu.confirm_delete') }}</span>
            </button>
          </div>
        </div>
      </Dialog>
  
    </div>
</template>
  
<script setup>
  
definePageMeta({
    name: 'Sidebar.service_list',
    middleware: 'auth'
})


import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

// Pinia store for authentication
const store = useAuthStore();
const { token } = storeToRefs(store);

// Axios config with authentication
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// Axios
const axios = useApi(config);

// Toast
const { successToast, errorToast } = toastMsg();

// Loading state
const loading = ref(false);

// Menu Title
const menuTitle = ref(t("Sidebar.service_list"));
  
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
  
const hasFiltersActive = computed(() => {
  return !!filterValues.value.search || !!filterValues.value.date;
});

const showFilter = computed(() => {
  return !loading.value && (totalPage.value > 0 || hasFiltersActive.value);
});



// Service Columns
const serviceColumns = ref([
  { field: 'image', header: t('menu.service_image') },
  { field: 'nameAr', header: t('menu.meal_name_ar') },
  { field: 'nameEn', header: t('menu.meal_name_en') },
  { field: 'price', header: t('menu.price') }
]);
  
// Services data from API
const services = ref([]);
const pagination = ref({});
const currency = ref('SAR');
  
// Handle filter events with debounce
let searchTimeout = null;

const handleSearch = (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    filterValues.value.search = value;
    fetchServicesData();
  }, 1000);
};
  
const handleDateChange = (value) => {
  filterValues.value.date = value;
  fetchServicesData();
};


// Computed: Filtered Services (API handles filtering)
const filteredServices = computed(() => {
  return services.value;
});
  
// Paginator
const currentPage = ref(1);
const pageLimit = ref(10);
const totalPage = ref(0);
  
// Paginate Function
const onPaginate = (e) => {
  loading.value = true;
  currentPage.value = e.page + 1;
  window.scrollTo(0, 0);
  fetchServicesData(currentPage.value);
};
  
/******************* Computed *******************/
let showPaginate = computed(() => {
  return totalPage.value > pageLimit.value
});


// Fetch Services Data from API
const fetchServicesData = async (page = 1) => {
  try {
    loading.value = true;
    
    // Build query string from filters
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (filterValues.value.search) {
      params.append('name', filterValues.value.search);
    }
    
    if (filterValues.value.date) {
      params.append('created_at', filterValues.value.date);
    }
    
    const apiUrl = `provider/services?${params.toString()}`;
    const response = await axios.get(apiUrl, config.value);
    
    if (response.data.key === 'success') {
      // Map API response to table format
      services.value = response.data.data.data.map(service => ({
        id: service.id,
        image: service.image,
        nameAr: service.name_ar,
        nameEn: service.name_en,
        price: `${service.price} ${response.data.data.currency}`
      }));
      
      pagination.value = response.data.data.pagination;
      currency.value = response.data.data.currency;
      totalPage.value = response.data.data.pagination.total_items;
      pageLimit.value = response.data.data.pagination.per_page;
      
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    errorToast(t('menu.error_loading_services'));
  } finally {
    loading.value = false;
  }
};


// Open delete dialog
const openDeleteDialog = (serviceId) => {
  itemToDelete.value = serviceId;
  showDeleteDialog.value = true;
};


// Confirm delete
const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    // API Call to delete service
    const response = await axios.delete(`provider/services/${itemToDelete.value}/destroy`, config.value);
    
    if (response.data.key === 'success') {
      // Success - remove from local array
      const index = services.value.findIndex(item => item.id === itemToDelete.value);
      if (index > -1) {
        services.value.splice(index, 1);
      }
      
      // Close dialog and reset
      showDeleteDialog.value = false;
      itemToDelete.value = null;
      
      successToast(response.data.msg);
    } else {
      errorToast(response.data.msg || t('menu.error_deleting_service'));
    }
    
  } catch (error) {
    console.error('Delete error:', error);
    errorToast(t('menu.error_deleting_service'));
  } finally {
    isDeleting.value = false;
  }
};


// Handle Edit Item
const handleEditItem = (serviceId) => {
  console.log('Edit service:', serviceId);
  navigateTo({
    path: '/serviceMenu/editService',
    query: { id: serviceId }
  });
};


// Handle View Item
const handleViewItem = (serviceId) => {
  console.log('View service:', serviceId);
  navigateTo({
    path: '/serviceMenu/viewService',
    query: { id: serviceId }
  });
};


// Fetch data on component mount
onMounted(() => {
  fetchServicesData();
});

// Set global store
globalStore.title = menuTitle.value;
globalStore.titleIcon = null;
globalStore.titleLink = null;
globalStore.subtitle = null;
</script>


<style scoped lang="scss">
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    border: 0.25em solid #f3f3f3;
    border-top: 0.25em solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  p {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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