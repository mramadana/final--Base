<template>
    <div>

        <div class="with-plus-btn">
            
            <div class="main-text mb-0">
                <h1 class="main-title">{{ $t('Home.branches') }}</h1>
                <p class="main-disc">{{ $t('Home.welcome') }} {{ user?.name }} ، {{ $t('Home.welcome_back') }}</p>
            </div>

            <div class="search-section">
                <div class="main_input with_icon search">
                    <input type="text" class="custum-input-icon" v-model="filters['global'].value" :placeholder="$t('Table.keywords')">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <nuxt-link to="/branches/addBranch" class="custom-btn plus sm"><i class="fas fa-plus"></i></nuxt-link>
            </div>
        </div>

        <!-- ***** datatable ***** -->
        <div v-if="!loading">
            <DatatableTable :products="products"
            :columns="columns"
            :rows="10"
            :sortable="true"
            :filters="filters"
            :showImage="true"
            :DropDownbranches="true"
            @deleteItem="deleteItem"
            @editItem="editItem"
            @viewItem="viewItem"
            />
        </div>

        <!-- ***** datatable skeleton ***** -->
        <div v-if="loading">
            <DatatableSkelton :SkeletonProducts="SkeletonProducts" />
        </div>

        <!--***** Paginator *****-->
        <div class="paginate-parent" v-if="showPaginate">
            <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" dir="ltr" />
        </div> 


        <!-- delete dialog -->

        <Dialog v-model:visible="deleteSuccessfully" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <h1 class="main-title bold mb-4">{{ $t('Branches.delete_branch') }}</h1>
                <!-- <img src="@/assets/images/delete.png" alt="check-img" class="check-img"> -->
                <div class="section-btns">
                    <button class="custom-btn sm bg-red d-inline-flex" @click="deleteSuccessfullyFun">
                        {{ $t('Global.yes') }}
                        <span class="spinner-border spinner-border-sm m-0" v-if="deleteLoading" role="status" aria-hidden="true"></span>
                    </button>
                    <button class="custom-btn sm d-inline-flex" @click="deleteSuccessfully = false">{{ $t('Global.no') }}</button>
                </div>
            </div>
        </Dialog>
        
    </div>
</template>


<script setup>

    // import FilterMatchMode to get input search work
    import { FilterMatchMode } from 'primevue/api';

    definePageMeta({
        name: "Home.branches",
        // middleware: ['auth', 'check'],
    });

    const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    // store
    const store = useAuthStore();
    const { token , user } = storeToRefs(store);

    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    // config
    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };

    const deleteSuccessfully = ref(false);

// success response
const { response } = responseApi();

// Axios
const axios = useApi();

const products = ref([]);

const loading = ref(true);

const branch_id = ref('');

const { successToast, errorToast } = toastMsg();

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

const columns = ref(
    [
        { field: 'id', header: t('Table.number') },
        { field: 'image', header: t('Table.branch_img') },
        { field: 'name', header: t('Cars.branch_name') },
        { field: 'phone', header: t('Table.phone') },
    ]
);

const SkeletonProducts = new Array(columns.value.length);

// delete item
const deleteItem = async (id) => {
    branch_id.value = id;
    deleteSuccessfully.value = true
}

// edit item
const editItem = async (id) => {
    branch_id.value = id;
    localStorage.setItem('edit_branch_id', branch_id.value);
}

// view item
const viewItem = async (id) => {
    branch_id.value = id;
    localStorage.setItem('view_branch_id', branch_id.value);
}

const deleteSuccessfullyFun = () => {
    deleteBranch()
}

const deleteBranch = async () => {
    loading.value = true;
    await axios.delete(`provider/delete-branch/${branch_id.value}`, config).then(res => {
        if (response(res) == "success") {
            successToast(res.data.msg);
            deleteSuccessfully.value = false;
            getData();
        } else {
            errorToast(res.data.msg);
        }
        loading.value = false;
    }).catch(err => console.log(err));
}

const getData = async () => {
    loading.value = true;
  await axios.get(`provider/branches?page=${currentPage.value}`, config).then(res => {
    if (response(res) == "success") {
      products.value = res.data.data.branches;
      totalPage.value = res.data.data.pagination.total_items;
      pageLimit.value = res.data.data.pagination.per_page;
    }
    loading.value = false;
  }).catch(err => console.log(err));
}

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


onMounted(async () => {
    // get datatable data
    await getData();

});

</script>

<style lang="scss" scoped>
    .section-btns {
        .custom-btn {
            font-size: 16px;
            border: 0;
        }
    }
</style>
