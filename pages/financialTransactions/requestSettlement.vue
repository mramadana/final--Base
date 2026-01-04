<template>
  <div class="layout-form">

    <h1 class="main-title md mb-4">{{ $t('financial.settlement_request') }}</h1>

    <!-- ***** datatable ***** -->
    <div v-if="!loading">
      <DatatableTable
        v-if="settlements?.length > 0"
        :products="settlements"
        :columns="settlementColumns"
        :rows="10"
        :sortable="false"
        :showImage="false"
        :actionsHeader="$t('tables.actions')"
      >
        <template #actions="{ data }">
          <div class="table-actions-group">
            <NuxtLink class="table-action-btn btn-view" :to="`/financialTransactions/${data.id}`">
              <i class="fas fa-eye"></i>
              {{ $t('financial.request_details') }}
            </NuxtLink>
          </div>
        </template>
      </DatatableTable>

      <!-- No Data -->
      <div v-else class="no-data-message">
        <p>{{ $t('financial.no_settlements') }}</p>
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
  name: 'sideMenu.finished_settlement',
  layout: 'default'
})

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

// Axios
const axios = useApi();

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
import { useAuthStore } from '~/stores/auth';
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

const globalStore = useGlobalStore();

// Loading state
const loading = ref(true);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref(); // إجمالي عدد العناصر

// Settlement Columns (من اليمين لليسار حسب الصورة)
const settlementColumns = ref([
  { field: 'order_num', header: t('financial.request_number') },
  { field: 'trip_price', header: t('financial.booking_value') },
  { field: 'time', header: t('financial.booking_date') },
  { field: 'admin_commission_amount', header: t('financial.added_value') },
  { field: 'total', header: t('financial.total_amount') },
  { field: 'status_text', header: t('financial.request_status') }
]);

// Skeleton products for loading state
const SkeletonProducts = new Array(settlementColumns.value.length);

// Settlements data
const settlements = ref([]);

// Summary data
const summaryData = ref({
  total_orders: 0,
  total_company_dues: 0,
  total_admin_commission: 0,
  total_vat: 0,
  currency: '﷼'
});

// Settlement status
const settlementStatus = ref({
  id: null,
  image: '',
  status: '',
  status_text: ''
});

// Get Finished Settlement Data from API
const getData = async () => {
  loading.value = true;
  
  try {
    const res = await axios.get('provider/settlements/finished', config.value);
    
    if (res.data.key === 'success') {
      const data = res.data.data;
      
      // Update settlement status
      settlementStatus.value = {
        id: data.id,
        image: data.image,
        status: data.status,
        status_text: data.status_text
      };
      
      // Update summary data
      if (data.summary) {
        summaryData.value = {
          total_orders: data.summary.total_orders || 0,
          total_company_dues: data.summary.total_company_dues || 0,
          total_admin_commission: data.summary.total_admin_commission || 0,
          total_vat: data.summary.total_vat || 0,
          currency: data.summary.currency || '﷼'
        };
      }
      
      // Update pagination
      if (data.orders?.pagination) {
        totalPage.value = data.orders.pagination.total_items || 0;
        pageLimit.value = data.orders.pagination.per_page || 20;
      }
      
      // Map orders data to settlements format
      if (data.orders?.data) {
        settlements.value = data.orders.data.map(order => ({
          id: order.id,
          order_num: order.order_num,
          time: order.time,
          status: order.status,
          status_text: order.status_text,
          trip_price: `${order.trip_price} ${order.currency}`,
          admin_commission_amount: `${order.admin_commission_amount} ${order.currency}`,
          vat_amount: `${order.vat_amount} ${order.currency}`,
          total: `${order.total} ${order.currency}`,
          statusBadge: order.status // For styling purposes
        }));
      }
    }
    
    loading.value = false;
  } catch (error) {
    console.error("Get finished settlement error:", error);
    errorToast('حصل خطأ في تحميل بيانات التسويات المنتهية');
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
const pageHeadTitle = ref(t('Sidebar.financial_transactions'));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/financialTransactions';
globalStore.subtitle = t('sideMenu.finished_settlement');

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
