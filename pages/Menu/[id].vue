<template>
  <div class="layout-form">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p>{{ $t('menu.loading_meals') }}</p>
    </div>

    <div v-else>
      <h1 class="main-title md mb-4">{{ menuTitle }}</h1>

      <!-- Filter Component -->
      <ReservationFilter 
        v-if="!loading && showFilter" 
        v-model="filterValues" 
        :show-search="true" 
        :show-calendar="true"
        :show-select="false" 
        :search-placeholder="$t('menu.search_meal')" 
        :calendar-placeholder="$t('menu.menu_date')" 
        calendar-mode="single" 
        @search="handleSearch"
        @date-change="handleDateChange"
      />
        
      <!-- Data Table -->
      <DatatableTable
        v-if="filteredMeals?.length > 0"
        :products="filteredMeals"
        :columns="mealColumns"
        :rows="10"
        :sortable="false"
        :showImage="true"
        :actionsHeader="$t('menu.actions')"
        @refreshData="fetchMealsData"
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
              {{ $t('menu.delete_meal') }}
            </button>
          </div>
        </template>
      </DatatableTable>


        <!-- No Data -->
        <div v-else class="no-data-message">
          <p>{{ $t('menu.no_meals') }}</p>
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
          <h3 class="main-title md mb-0">{{ $t('menu.delete_confirmation') }}</h3>
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
    name: 'Sidebar.menu_list',
    layout: 'default'
})


import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const route = useRoute();
const id = route.params.id;

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
const menuTitle = ref(t("Sidebar.menu_list"));
  
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
  return !!filterValues.value.search || !!filterValues.value.date; // (+ select لو بتستخدمه)
});

const showFilter = computed(() => {
  // totalPage عندك هو total_items من الـ API
  return !loading.value && (totalPage.value > 0 || hasFiltersActive.value);
});



// Meal Columns (من اليمين لليسار حسب الصورة)
const mealColumns = ref([
  { field: 'image', header: t('menu.meal_image') },
  { field: 'type', header: t('menu.type') },
  { field: 'nameAr', header: t('menu.meal_name_ar') },
  { field: 'nameEn', header: t('menu.meal_name_en') },
  { field: 'category', header: t('Global.category') },
  { field: 'price', header: t('menu.price') }
]);
  
// Meals data from API
const meals = ref([]);
const pagination = ref({});
const currency = ref('SAR');
  
// Handle filter events with debounce
let searchTimeout = null;

const handleSearch = (value) => {
  // Clear previous timeout if user is still typing
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Set new timeout for 1 second
  searchTimeout = setTimeout(() => {
    filterValues.value.search = value;
    fetchMealsData(); // Refetch data with filters
  }, 1000);
};
  
const handleDateChange = (value) => {
  filterValues.value.date = value;
  fetchMealsData(); // Refetch data with filters
};


// Computed: Filtered Meals (API handles filtering)
const filteredMeals = computed(() => {
  return meals.value; // API already filtered the data
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
  fetchMealsData(currentPage.value);
};
  
/******************* Computed *******************/
let showPaginate = computed(() => {
  return totalPage.value > pageLimit.value
});


// Fetch Meals Data from API
const fetchMealsData = async (page = 1) => {
  try {
    loading.value = true;
    
    // Build query string from filters
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (filterValues.value.search) {
      params.append('search', filterValues.value.search); // Search by meal name
    }
    
    if (filterValues.value.date) {
      params.append('date', filterValues.value.date);
    }
    
    const apiUrl = `provider/menus/${id}/meals?${params.toString()}`;
    const response = await axios.get(apiUrl, config.value);
    
    if (response.data.key === 'success') {
      // Map API response to table format
      meals.value = response.data.data.data.map(meal => ({
        id: meal.id,
        image: meal.image,
        type: meal.menu_type,
        nameAr: meal.name_ar,
        nameEn: meal.name_en,
        category: meal.menu_name,
        price: `${meal.price} ${response.data.data.currency}`
      }));
      
      pagination.value = response.data.data.pagination;
      currency.value = response.data.data.currency;
      totalPage.value = response.data.data.pagination.total_items;
      pageLimit.value = response.data.data.pagination.per_page;
      
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    errorToast(t('menu.error_loading_meals'));
  } finally {
    loading.value = false;
  }
};


// Open delete dialog
const openDeleteDialog = (mealId) => {
  itemToDelete.value = mealId;
  showDeleteDialog.value = true;
};


// Confirm delete
const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    // API Call to delete meal
    const response = await axios.delete(`provider/meals/${itemToDelete.value}/destroy`, config.value);
    
    if (response.data.key === 'success') {
      // Success - remove from local array
      const index = meals.value.findIndex(item => item.id === itemToDelete.value);
      if (index > -1) {
        meals.value.splice(index, 1);
      }
      
      // Close dialog and reset
      showDeleteDialog.value = false;
      itemToDelete.value = null;
      
      successToast(t('menu.meal_deleted_successfully'));
    } else {
      errorToast(response.data.msg || t('menu.error_deleting_meal'));
    }
    
  } catch (error) {
    console.error('Delete error:', error);
    errorToast(t('menu.error_deleting_meal'));
  } finally {
    isDeleting.value = false;
  }
};


// Handle Edit Item
const handleEditItem = (mealId) => {
  console.log('Edit meal:', mealId);
  navigateTo({
    path: '/Menu/editMeal',
    query: { id: mealId }
  });
};


// Handle View Item
const handleViewItem = (mealId) => {
  console.log('View meal:', mealId);
  navigateTo({
    path: '/Menu/viewMeal',
    query: { id: mealId }
  });
};


// Fetch data on component mount
onMounted(() => {
  fetchMealsData();
});

// Set global store
globalStore.title = menuTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('sideMenu.my_menus');
globalStore.subTitleIcon = 'fa-solid fa-angle-left';
globalStore.subSubTitle = t('menu.meals_menu');
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
