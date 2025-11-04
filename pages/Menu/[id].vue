<template>
    <div class="layout-form">
  
      <h1 class="main-title md mb-4">{{ menuTitle }}</h1>
  
      <!-- Filter Component -->
      <ReservationFilter 
        v-if="meals?.length > 0" 
        v-model="filterValues" 
        :show-search="true" 
        :show-select="true" 
        :show-calendar="true"
        :search-placeholder="$t('menu.search_meal')" 
        :select-options="categoryOptions"
        :select-placeholder="$t('Global.category')" 
        option-label="name" 
        option-value="id"
        :calendar-placeholder="$t('menu.menu_date')" 
        calendar-mode="single" 
        @search="handleSearch"
        @select-change="handleSelectChange" 
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
  
// Category options for select
const categoryOptions = ref([
  { id: 1, name: t('menu.all') },
  { id: 2, name: t('menu.meals') },
  { id: 3, name: t('menu.drinks') },
  { id: 4, name: t('menu.desserts') }
]);


// Meal Columns (من اليمين لليسار حسب الصورة)
const mealColumns = ref([
  { field: 'image', header: t('menu.meal_image') },
  { field: 'type', header: t('menu.type') },
  { field: 'nameAr', header: t('menu.meal_name_ar') },
  { field: 'nameEn', header: t('menu.meal_name_en') },
  { field: 'category', header: t('Global.category') },
  { field: 'price', header: t('menu.price') }
]);
  
// Fake Data for Meals
const meals = ref([
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    type: 'وجبات',
    nameAr: 'شاورما دجاج',
    nameEn: 'Chicken Shawarma',
    category: 'مشويات',
    price: '15 ر.س'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    type: 'وجبات',
    nameAr: 'كبسة لحم',
    nameEn: 'Lamb Kabsa',
    category: 'مشويات',
    price: '30 ر.س'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    type: 'وجبات',
    nameAr: 'شوربة عدس',
    nameEn: 'Lentil Soup',
    category: 'مشويات',
    price: '8 ر.س'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80',
    type: 'وجبات',
    nameAr: 'كباب لحم',
    nameEn: 'Beef Kebab',
    category: 'مشويات',
    price: '25 ر.س'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
    type: 'وجبات',
    nameAr: 'برجر لحم',
    nameEn: 'Beef Burger',
    category: 'مشويات',
    price: '20 ر.س'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    type: 'وجبات',
    nameAr: 'باستا كريمة',
    nameEn: 'Creamy Pasta',
    category: 'مشويات',
    price: '18 ر.س'
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    type: 'وجبات',
    nameAr: 'شاورما دجاج',
    nameEn: 'Chicken Shawarma',
    category: 'مشويات',
    price: '15 ر.س'
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    type: 'وجبات',
    nameAr: 'بيتزا مارجريتا',
    nameEn: 'Margherita Pizza',
    category: 'مشويات',
    price: '22 ر.س'
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


// Computed: Filtered Meals
const filteredMeals = computed(() => {
  let filtered = meals.value;


  // Filter by search (meal name)
  if (filterValues.value.search) {
    filtered = filtered.filter(item =>
      item.nameAr?.includes(filterValues.value.search) ||
      item.nameEn?.toLowerCase().includes(filterValues.value.search.toLowerCase())
    );
  }


  // Filter by category
  if (filterValues.value.select && filterValues.value.select !== 1) {
    // Add category filtering logic here
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


// Fetch Meals Data (API Call)
const fetchMealsData = async () => {
  try {
    // Replace with your actual API endpoint
    // const axios = useApi();
    // const response = await axios.get(`menus/${id.value}/meals`);
    // meals.value = response.data;
    
    // For now, using static data - refresh will keep current data
    console.log('Refreshing meals data...');
  } catch (error) {
    console.error('Error fetching meals:', error);
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
    // API Call - replace with your actual endpoint
    // const axios = useApi();
    // const response = await axios.delete(`menus/${id.value}/meals/${itemToDelete.value}`);
    
    // Success - remove from local array
    const index = meals.value.findIndex(item => item.id === itemToDelete.value);
    if (index > -1) {
      meals.value.splice(index, 1);
    }
    
    // Close dialog and reset
    showDeleteDialog.value = false;
    itemToDelete.value = null;
    
    // Optional: Show success message
    // useToast().success('تم حذف الوجبة بنجاح');
    
  } catch (error) {
    console.error('Delete error:', error);
    // Optional: Show error message
    // useToast().error('حدث خطأ أثناء حذف الوجبة');
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


// Set global store
globalStore.title = menuTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('sideMenu.my_menus');
globalStore.subTitleIcon = 'fa-solid fa-angle-left';
globalStore.subSubTitle = t('menu.meals_menu');
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
