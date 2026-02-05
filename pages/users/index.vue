<template>
    <div class="layout-form">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p>{{ $t("users.loading_users") }}</p>
        </div>

        <div v-else>
            <h1 class="main-title md mb-4">
                {{ $t("users.users_management") }}
            </h1>

            <!-- Filter Component -->
            <ReservationFilter
                v-if="showFilter"
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
                    @refreshData="fetchUsersData"
                >
                    <template #actions="{ data }">
                        <div class="table-actions-group">
                            <button
                                class="table-action-btn btn-view"
                                @click="viewUser(data.id)"
                            >
                                <i class="fas fa-eye"></i>
                                {{ $t("tables.view") }}
                            </button>
                            <button
                                class="table-action-btn btn-edit"
                                @click="editUser(data.id)"
                            >
                                {{ $t("tables.edit") }}
                            </button>
                            <button
                                class="table-action-btn btn-delete"
                                @click="deleteUser(data.id)"
                            >
                                {{ $t("tables.delete") }}
                            </button>
                        </div>
                    </template>
                </DatatableTable>

                <!-- No Data -->
                <div v-else class="no-data-message">
                    <p>{{ $t("users.no_users_data") }}</p>
                </div>
            </div>

            <!-- ***** datatable skeleton ***** -->
            <div v-if="loading">
                <DatatableSkelton :SkeletonProducts="SkeletonProducts" />
            </div>

            <!--***** Paginator *****-->
            <div class="paginate-parent mt-4" v-if="showPaginate">
                <Paginator
                    :rows="pageLimit"
                    @page="onPaginate"
                    :totalRecords="totalPage"
                    dir="ltr"
                />
            </div>

            <!-- Delete Confirmation Dialog -->
            <Dialog
                v-model:visible="showDeleteDialog"
                modal
                :draggable="false"
                class="custum_dialog_width without-close"
                :style="{ width: '500px' }"
            >
                <div class="delete-content">
                    <img
                        src="@/assets/images/alert.gif"
                        loading="lazy"
                        alt="check-img"
                        class="lgg mb-4"
                    />
                    <h3 class="main-title md mb-0">
                        {{ $t("tables.delete_user_confirmation") }}
                    </h3>
                    <div class="delete-actions">
                        <button
                            @click="showDeleteDialog = false"
                            class="btn-cancel"
                            :disabled="isDeleting"
                        >
                            {{ $t("menu.cancel") }}
                        </button>
                        <button
                            @click="confirmDelete"
                            class="btn-confirm-delete"
                            :disabled="isDeleting"
                        >
                            <i
                                v-if="isDeleting"
                                class="fas fa-spinner fa-spin"
                            ></i>
                            <span v-else>{{ $t("Auth.confirmation") }}</span>
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    name: "users.users",
    layout: "default",
    middleware: 'auth'
});

import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const globalStore = useGlobalStore();

// Pinia store for authentication
const store = useAuthStore();
const { token } = storeToRefs(store);

// Axios config with authentication
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` },
}));

// Axios
const axios = useApi(config);

// Toast
const { successToast, errorToast } = toastMsg();

// success response
const { response } = responseApi();

// Loading state
const loading = ref(false);

const showDeleteDialog = ref(false);
const isDeleting = ref(false);
const itemToDelete = ref(null);

// Filter values
const filterValues = ref({
    search: "",
    date: null,
});

const hasFiltersActive = computed(() => {
    return !!filterValues.value.search || !!filterValues.value.date;
});

const showFilter = computed(() => {
    return !loading.value && (totalPage.value > 0 || hasFiltersActive.value);
});

// Paginator
const currentPage = ref(1);
const pageLimit = ref(20);
const totalPage = ref(0);

// User Columns
const userColumns = ref([
    { field: "name", header: t("users.user_name") },
    { field: "country_code", header: t("users.country_code") },
    { field: "phone", header: t("users.phone") },
    { field: "created_at", header: t("users.created_at") },
]);

// Skeleton products for loading state
const SkeletonProducts = new Array(userColumns.value.length);

// Users data from API
const users = ref([]);
const pagination = ref({});

// Computed: Filtered Users (API handles filtering)
const filteredUsers = computed(() => {
    return users.value; // API already filtered the data
});

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
        currentPage.value = 1; // Reset to first page
        fetchUsersData(); // Refetch data with filters
    }, 1000);
};

const handleDateChange = (value) => {
    filterValues.value.date = value;
    currentPage.value = 1; // Reset to first page
    fetchUsersData(); // Refetch data with filters
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
        // API Call to delete user
        const res = await axios.delete(
            `provider/admins/${itemToDelete.value}/destroy`,
            config.value,
        );

        if (response(res) === "success") {
            // Success - remove from local array
            const index = users.value.findIndex(
                (item) => item.id === itemToDelete.value,
            );
            if (index > -1) {
                users.value.splice(index, 1);
                totalPage.value = totalPage.value - 1;
            }

            // Close dialog and reset
            showDeleteDialog.value = false;
            itemToDelete.value = null;

            successToast(res?.data?.msg);

            // Refetch data if no items left on current page
            if (users.value.length === 0 && currentPage.value > 1) {
                currentPage.value = currentPage.value - 1;
                fetchUsersData();
            }
        } else {
            errorToast(res.msg || t("users.error_deleting_user"));
        }
    } catch (error) {
        console.error("Delete error:", error);
        errorToast(t("users.error_deleting_user"));
    } finally {
        isDeleting.value = false;
    }
};

// Fetch Users Data from API
const fetchUsersData = async (page = 1) => {
    try {
        loading.value = true;

        // Build query string from filters
        const params = new URLSearchParams();
        params.append("page", page);

        if (filterValues.value.search) {
            params.append("name", filterValues.value.search); // Search by user name
        }

        if (filterValues.value.date) {
            params.append("date_at", filterValues.value.date);
        }

        const apiUrl = `provider/admins?${params.toString()}`;
        const res = await axios.get(apiUrl, config.value);

        if (response(res) === "success") {
            // Map API response to table format
            users.value = res.data.data.data.map((user) => ({
                id: user.id,
                name: user.name,
                country_code: user.country_code,
                phone: user.phone,
                created_at: user.created_at,
            }));

            pagination.value = res.data.data.pagination;
            totalPage.value = res.data.data.pagination.total_items;
            pageLimit.value = res.data.data.pagination.per_page;
        } else {
            errorToast(res.msg || t("users.error_loading_users"));
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        errorToast(t("users.error_loading_users"));
    } finally {
        loading.value = false;
    }
};

// Paginate Function
const onPaginate = (e) => {
    loading.value = true;
    currentPage.value = e.page + 1;
    window.scrollTo(0, 0);
    fetchUsersData(currentPage.value);
};

/******************* Computed *******************/
let showPaginate = computed(() => {
    return totalPage.value > pageLimit.value;
});

// Action handlers
const viewUser = (id) => {
    console.log("View user:", id);
    navigateTo(`/users/showUser?id=${id}`);
};

const editUser = (id) => {
    console.log("Edit user:", id);
    navigateTo(`/users/editUser?id=${id}`);
};

// Set global store
globalStore.title = t("users.users");
globalStore.titleIcon = "fa-solid fa-angle-left";
globalStore.titleLink = "/users";
globalStore.subtitle = t("sideMenu.view_users");

// Fetch data on component mount
onMounted(() => {
    fetchUsersData();
});
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
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

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

    &.btn-view,
    &.btn-edit {
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
        background: #dc2626;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &:hover:not(:disabled) {
            background: #b91c1c;
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
