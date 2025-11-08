<template>
  <div class="layout-form">

    <h1 class="main-title md mb-4">طلب تسوية</h1>

    <!-- ***** datatable ***** -->
    <div v-if="!loading">
      <DatatableTable
        v-if="settlements?.length > 0"
        :products="settlements"
        :columns="settlementColumns"
        :rows="10"
        :sortable="false"
        :showImage="false"
        :actionsHeader="'اجراء'"
      >
        <template #actions="{ data }">
          <div class="table-actions-group">
            <NuxtLink class="table-action-btn btn-view" :to="`/financialTransactions/${data.id}`">
              <i class="fas fa-eye"></i>
              تفاصيل الطلب
            </NuxtLink>
          </div>
        </template>
      </DatatableTable>

      <!-- No Data -->
      <div v-else class="no-data-message">
        <p>لا توجد طلبات تسوية</p>
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

  </div>
</template>

<script setup>

definePageMeta({
  name: 'requestSettlement',
  layout: 'default'
})

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

// Loading state
const loading = ref(true);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref(); // إجمالي عدد العناصر

// Settlement Columns (من اليمين لليسار حسب الصورة)
const settlementColumns = ref([
  { field: 'requestNumber', header: 'رقم الطلب' },
  { field: 'bookingValue', header: 'قيمة الحجز' },
  { field: 'drinksValue', header: 'قيمة الوجبات او المشروبات' },
  { field: 'bookingDate', header: 'تاريخ الحجز' },
  { field: 'addedValue', header: 'القيمة المضافة' },
  { field: 'totalAmount', header: 'اجمالى المبلغ' },
  { field: 'status', header: 'حالة الطلب' }
]);

// Skeleton products for loading state
const SkeletonProducts = new Array(settlementColumns.value.length);

// Fake Data for Settlements (حسب الصورة)
const settlements = ref([
  {
    id: '1',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مرفوضة',
    statusBadge: 'rejected'
  },
  {
    id: '2',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مقبول',
    statusBadge: 'accepted'
  },
  {
    id: '3',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مرفوضة',
    statusBadge: 'rejected'
  },
  {
    id: '4',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مقبول',
    statusBadge: 'accepted'
  },
  {
    id: '5',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مرفوضة',
    statusBadge: 'rejected'
  },
  {
    id: '6',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مقبول',
    statusBadge: 'accepted'
  },
  {
    id: '7',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مرفوضة',
    statusBadge: 'rejected'
  },
  {
    id: '8',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مقبول',
    statusBadge: 'accepted'
  },
  {
    id: '9',
    requestNumber: 'T598',
    bookingValue: '١٠٠ ر.س',
    drinksValue: '١٠٠ ر.س',
    bookingDate: '٢٠٢٥/٠٦/١٩',
    addedValue: '٥٠ ر.س',
    totalAmount: '٤٠٠ ر.س',
    status: 'مقبول',
    statusBadge: 'accepted'
  }
]);

// Get Data Function (API Call)
const getData = async () => {
  loading.value = true;
  
  try {
    // استبدل هذا بـ API call الحقيقي
    // const axios = useApi();
    // const config = { headers: { Authorization: `Bearer ${token}` } };
    // const res = await axios.get(`request-settlements?page=${currentPage.value}`, config);
    // settlements.value = res.data.data.settlements;
    // totalPage.value = res.data.data.pagination.total_items;
    // pageLimit.value = res.data.data.pagination.per_page;
    
    // محاكاة API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

// Set global store
globalStore.title = 'طلب تسوية';
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/financialTransactions';
globalStore.subtitle = 'المعاملات المالية';

// OnMounted - Get data on page load
onMounted(async () => {
  await getData();
});

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
  
  i {
    font-size: 14px;
  }
  
  &.btn-view {
    background-color: #1e1e1e;
    color: #fff;
    
    &:hover {
      background-color: #2a2a2a;
    }
  }
}
</style>
