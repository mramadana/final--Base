<template>
    <div>
        <!-- start to order content  -->
        <div v-if="!loading">
            <!-- order Card  -->
            <div v-if="orders.length">
                <OrdersCardOrder :orders="orders" :additionalClasses="['background-color-card']" :isNew="isNew" />
            </div>

            <!-- if no order show this  -->
            <GlobalNoData :noData_text="$t('Global.no_products')" v-if="!orders.length" />
        </div>

        <!-- start to loading -->
        <div v-if="loading">
            <OrdersOrderSkeleton />
        </div>

        <!--***** Paginator *****-->
        <div class="paginate-parent" v-if="showPaginate">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-4" dir="ltr" />
        </div>
    </div>
</template>

<script setup>
import { debounce } from 'lodash';

const props = defineProps({
    ordersName: {
        type: String,
        required: true
    },
    noData: {
        type: String,
        required: true
    },
    isNew: {
        type: Boolean,
        default: false
    }
});

// Toast
const { errorToast } = toastMsg();

/******************* Data *******************/

const { token } = storeToRefs(useAuthStore());

// config
const config = computed(() => {
    return { headers: { Authorization: `Bearer ${token.value}` } }
});

// loading
const loading = ref(true);

// orders
const orders = ref([]);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

const getOrdersData = debounce(async () => {
    loading.value = true;

    const { data: result } = await useApiFetch(`${props.ordersName}?page=${currentPage.value}`, {
        ...config.value
    });

    if (result.value?.data) {
        orders.value = result.value?.data?.data;
        totalPage.value = result.value?.data?.pagination?.total_items;
        pageLimit.value = result.value?.data?.pagination?.per_page;
    }
    loading.value = false;
}, 300);

// Paginate Function
const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    getOrdersData();
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value;
});

/******************* Mounted *******************/
onMounted(async () => {
    await getOrdersData(); 
});
</script>
