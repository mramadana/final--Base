<template>
  <div class="layout-form">

    <h1 class="main-title md mb-4">{{ $t('users.users_management') }}</h1>

    <!-- Filter Component -->
    <ReservationFilter 
      v-if="users?.length > 0" 
      v-model="filterValues" 
      :show-search="true" 
      :show-select="false" 
      :show-calendar="true"
      :search-placeholder="$t('users.search_user')" 
      :calendar-placeholder="$t('menu.menu_date')" 
      calendar-mode="single" 
      @search="handleSearch"
      @date-change="handleDateChange"
    />

    <!-- ***** datatable ***** -->
    <div v-if="!loading">
      <DatatableTable
        v-if="filteredUsers?.length > 0"
        :products="filteredUsers"
        :columns="userColumns"
        :rows="10"
        :sortable="false"
        :showImage="false"
        :actionsHeader="$t('tables.actions')"
      >
        <template #actions="{ data }">
          <div class="table-actions-group">
            <button class="table-action-btn btn-view" @click="viewUser(data.id)">
              <i class="fas fa-eye"></i>
              {{ $t('tables.view') }}
            </button>
            <button class="table-action-btn btn-edit" @click="editUser(data.id)">
              {{ $t('tables.edit') }}
            </button>
            <button class="table-action-btn btn-delete" @click="deleteUser(data.id)">
              {{ $t('tables.delete') }}
            </button>
          </div>
        </template>
      </DatatableTable>

      <!-- No Data -->
      <div v-else class="no-data-message">
        <p>{{ $t('users.no_users_data') }}</p>
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
            {{ $t('menu.cancel') }}
          </button>
          <button @click="confirmDelete" class="btn-confirm-delete" :disabled="isDeleting">
            <i v-if="isDeleting" class="fas fa-spinner fa-spin"></i>
            <span v-else>{{ $t('Auth.confirmation') }}</span>
          </button>
        </div>
      </div>
    </Dialog>

  </div>
</template>

<script setup>

definePageMeta({
  name: 'users.users',
  layout: 'default'
})

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

// Loading state
const loading = ref(true);

const showDeleteDialog = ref(false);
const isDeleting = ref(false);
const itemToDelete = ref(null);

// Filter values
const filterValues = ref({
  search: '',
  date: null
});

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

// User Columns (من اليمين لليسار حسب الصورة)
const userColumns = ref([
  { field: 'name', header: t('users.user_name') },
  { field: 'countryCode', header: t('users.country_code') },
  { field: 'phone', header: t('users.phone') },
  { field: 'createdAtDisplay', header: t('users.created_at') },
  { field: 'permission', header: t('users.permissions') }
]);

// Skeleton products for loading state
const SkeletonProducts = new Array(userColumns.value.length);

// Fake Data for Users (حسب الصورة)
const users = ref([
  {
    id: '1',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل'
  },
  {
    id: '2',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل'
  },
  {
    id: '3',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل'
  },
  {
    id: '4',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  },
  {
    id: '5',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  },
  {
    id: '6',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  },
  {
    id: '7',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  },
  {
    id: '8',
    name: 'محمد سعود',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  },
  {
    id: '9',
    name: 'سيد',
    countryCode: '+966',
    phone: '915084213',
    createdAt: '2025-05-11',
    createdAtDisplay: '11/05/2025',
    permission: 'تعديل',
  }
]);

// Filtering function
const filteredUsers = computed(() => {
  let filtered = [...users.value];

  // Filter by search
  if (filterValues.value.search) {
    filtered = filtered.filter(item =>
      item.name?.includes(filterValues.value.search) ||
      item.phone?.includes(filterValues.value.search)
    );
  }

  // Filter by date
  if (filterValues.value.date) {
    filtered = filtered.filter(item =>
      item.createdAt === filterValues.value.date
    );
  }

  return filtered;
});

// Handle filter events
const handleSearch = (value) => {
  console.log('Search:', value);
};

const handleDateChange = (value) => {
  console.log('Date changed:', value);
};

// Open delete dialog
const deleteUser = (userId) => {
  itemToDelete.value = userId;
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
    const index = users.value.findIndex(item => item.id === itemToDelete.value);
    if (index > -1) {
      users.value.splice(index, 1);
      console.log("ddddddd");
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

// Get Data Function (API Call)
const getData = async () => {
  loading.value = true;
  
  try {
    // استبدل هذا بـ API call الحقيقي
    // const axios = useApi();
    // const config = { headers: { Authorization: `Bearer ${token}` } };
    // const res = await axios.get(`users?page=${currentPage.value}`, config);
    // users.value = res.data.data.users;
    // totalPage.value = res.data.data.pagination.total_items;
    // pageLimit.value = res.data.data.pagination.per_page;
    
    // محاكاة API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    totalPage.value = users.value.length;
    
    loading.value = false;
  } catch (err) {
    console.log(err);
    loading.value = false;
  }
};

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

// Action handlers
const viewUser = (id) => {
  console.log('View user:', id);
  navigateTo(`/users/showUser?id=${id}`);
};

const editUser = (id) => {
  console.log('Edit user:', id);
  navigateTo(`/users/editUser?id=${id}`);
};

// Set global store
globalStore.title = t('users.users');
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/users';
globalStore.subtitle = t('sideMenu.view_users');

// OnMounted - Get data on page load
onMounted(async () => {
  await getData();
});

// Watch filtered users to update pagination
watch(filteredUsers, (val) => {
  totalPage.value = val.length;
}, { immediate: true });

</script>

<style scoped lang="scss">
.no-data-message {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}

.table-actions-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.table-action-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  text-decoration: none;
  color: #fff;
  
  i {
    font-size: 14px;
  }
  
  &.btn-view, &.btn-edit {
    background-color: #1e1e1e;
    color: #fff;
    
    &:hover {
      background-color: #2a2a2a;
    }
  }
  
  &.btn-delete {
    background-color: #d6003d;
    color: #fff;
    
    &:hover {
      background-color: #ed1c5f;
    }
  }
}

</style>

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
