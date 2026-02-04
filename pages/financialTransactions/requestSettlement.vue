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
  middleware: 'auth'
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

// Settlement Columns (من اليمين لليسار حسب الصورة - نفس currentSettlement)
const settlementColumns = ref([
  { field: 'number', header: t('financial.request_number') },
  { field: 'total_due_amount', header: t('financial.drinks_value') },
  { field: 'vat_amount', header: t('financial.added_value') },
  { field: 'total_price', header: t('financial.total_amount') },
  { field: 'date', header: t('tables.booking_date') },
  { field: 'time', header: t('financial.time') },
  { field: 'status_text', header: t('financial.request_status') },
]);

// Skeleton products for loading state
const SkeletonProducts = new Array(settlementColumns.value.length);

// Settlements data
const settlements = ref([]);

// Get Settlement Data from API (نفس شكل الـ response: data.settlements.{ data, pagination })
const getData = async () => {
  loading.value = true;
  
  try {
    const res = await axios.get('provider/settlements/finished', config.value);
    
    if (res.data.key === 'success') {
      const data = res.data.data;
      
      // Update pagination
      if (data.settlements?.pagination) {
        totalPage.value = data.settlements.pagination.total_items || 0;
        pageLimit.value = data.settlements.pagination.per_page || 20;
      }
      
      // Map settlements data to component format (نفس الـ mapping بتاع currentSettlement)
      if (data.settlements?.data) {
        settlements.value = data.settlements.data.map(settlement => ({
          id: settlement.id,
          number: settlement.number,
          status: settlement.status,
          status_text: settlement.status_text,
          total_due_amount: `${settlement.total_due_amount} ${settlement.currency}`,
          vat_amount: `${settlement.vat_amount} ${settlement.currency}`,
          total_price: `${settlement.total_price} ${settlement.currency}`,
          currency: settlement.currency,
          date: settlement.date,
          time: settlement.time
        }));
      }
    }
    
    loading.value = false;
  } catch (error) {
    console.error("Get settlement error:", error);
    errorToast('حصل خطأ في تحميل بيانات التسوية');
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
