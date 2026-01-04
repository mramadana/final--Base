<template>
    <div class="financial-transactions-page layout-form">
        
        <!-- Search and Settlement Button -->
        <div class="header-section mb-4">
            <div class="main_input">
                <input 
                    type="text" 
                    class="" 
                    :placeholder="$t('financial.search_placeholder')"
                    v-model="searchQuery"
                />
                <i class="fas fa-search search-icon"></i>
            </div>
            
            <!-- Settlement Button -->
            <button class="custom-btn" @click="requestSettlement" :disabled="settlementLoading">
                <span class="spinner-border spinner-border-sm ml-2" v-if="settlementLoading" role="status" aria-hidden="true"></span>
                {{ $t('financial.settlement') }}
            </button>
        </div>

        <!-- Statistics Section -->
        <div class="statistics-section mb-4">
            <h3 class="section-title">{{ $t('financial.total_dues_title') }}</h3>
            
            <div class="stats-card">
                <div class="stat-row">
                    <div class="stat-label">{{ $t('financial.total_reservations') }}</div>
                    <div class="stat-value">
                        {{ stats.totalReservations }}
                        <img src="@/assets/images/reyal.svg" alt="">
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-label">{{ $t('financial.vat_tax') }}</div>
                    <div class="stat-value">
                        {{ stats.vatTax }}
                        <img src="@/assets/images/reyal.svg" alt="">
                    </div>
                </div>
                
                <div class="stat-row highlight">
                    <div class="stat-label">{{ $t('financial.net_due') }}</div>
                    <div class="stat-value">
                        {{ stats.netDue }}
                        <img src="@/assets/images/reyal.svg" alt="">
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservations Section -->
        <div class="reservations-section layout-form mb-0">
            <h3 class="section-title mb-4">{{ $t('financial.due_reservations_title') }}</h3>
            
            <OrdersCardReservation 
                :items="filteredReservations" 
                :loading="loading"
            />
        </div>

    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

// Axios
const axios = useApi();

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// Page meta
definePageMeta({
    name: 'sideMenu.due_amount',
    layout: 'default',
});

// Global store
const globalStore = useGlobalStore();
const pageHeadTitle = ref(t('Sidebar.financial_transactions'));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/financialTransactions';
globalStore.subtitle = t('sideMenu.due_amount');

// Search query
const searchQuery = ref('');
const loading = ref(false);
const settlementLoading = ref(false);

// Statistics data
const stats = ref({
    totalReservations: '0.00',
    vatTax: '0.00',
    netDue: '0.00',
    currency: 'SAR'
});

// Pagination data
const pagination = ref({
    totalItems: 0,
    currentPage: 1,
    perPage: 20,
    totalPages: 1
});

// Reservations data
const reservations = ref([]);

// Get settlements due data from API
const getSettlementsDue = async () => {
    loading.value = true;
    try {
        const res = await axios.get('provider/settlements/due', config.value);
        if (res.data.key === 'success') {
            const data = res.data.data;
            
            // Update statistics
            stats.value = {
                totalReservations: data.total_due_amount || '0.00',
                vatTax: data.vat_amount || '0.00',
                netDue: data.total_price || '0.00',
                currency: data.currency || 'SAR'
            };
            
            // Update pagination
            if (data.reservations?.pagination) {
                pagination.value = {
                    totalItems: data.reservations.pagination.total_items || 0,
                    currentPage: data.reservations.pagination.current_page || 1,
                    perPage: data.reservations.pagination.per_page || 20,
                    totalPages: data.reservations.pagination.total_pages || 1
                };
            }
            
            // Map reservations data to component format
            if (data.reservations?.data) {
                reservations.value = data.reservations.data.map(item => ({
                    id: item.id,
                    reservationNum: item.reservation_num,
                    metaTime: `${item.time} - ${item.date}`,
                    title: item.name,
                    dateRange: `${item.reservation_time_start} - ${item.reservation_time_end}`,
                    reservationDate: item.reservation_date,
                    customerName: item.user_name,
                    imageSrc: '/_nuxt/assets/images/Logo.svg',
                    status: item.status,
                    statusText: item.status_text
                }));
            }
        }
    } catch (error) {
        console.error("Get settlements due error:", error);
        errorToast('حصل خطأ في تحميل البيانات المالية');
    } finally {
        loading.value = false;
    }
};

// Request Settlement POST method
const requestSettlement = async () => {
    settlementLoading.value = true;
    
    try {
        const res = await axios.post('provider/settlements', {}, config.value);
        
        if (res.data.key === 'success') {
            successToast(res.data.msg || 'تم إرسال طلب التسوية بنجاح');
            // Refresh data after successful settlement request
            await getSettlementsDue();
        } else {
            errorToast(res.data.msg || 'حصل خطأ في إرسال طلب التسوية');
        }
    } catch (error) {
        console.error("Request settlement error:", error);
        errorToast('حصل خطأ في إرسال طلب التسوية');
    } finally {
        settlementLoading.value = false;
    }
};

// Filtered reservations based on search
const filteredReservations = computed(() => {
    if (!searchQuery.value) return reservations.value;
    
    const query = searchQuery.value.toLowerCase();
    return reservations.value.filter(item => 
        item.id.toString().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.customerName?.toLowerCase().includes(query) ||
        item.reservationNum?.toLowerCase().includes(query)
    );
});

// Initialize data on mount
onMounted(async () => {
    await getSettlementsDue();
});
</script>

<style lang="scss" scoped>
.financial-transactions-page {
    
    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        .main_input {
            position: relative;
            background-color: #3a3a3a;
            border-radius: 8px;
            height: 48px;
            width: 365px;
            max-width: 100%;
            
            input {
                height: 100%;
                background: transparent;
                border: none;
                color: #fff;
                width: 100%;
                border-radius: 8px;
                
                &::placeholder {
                    color: #b0b0b0;
                }
                
                &:focus {
                    outline: none;
                }
            }
            
            .search-icon {
                position: absolute;
                inset-inline-end: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #fff;
                pointer-events: none;
                font-size: 15px;
            }
        }
        
    }
    
    .statistics-section {
        .section-title {
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        
        .stats-card {
            background-color: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 12px;
            overflow: hidden;
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 14px;
                border-bottom: 1px solid #3a3a3a;
                
                &:last-child {
                    border-bottom: none;
                }
                
                &.highlight {
                    background-color: #323232;
                    
                    .stat-label,
                    .stat-value {
                        font-weight: 700;
                    }
                }
                
                .stat-label {
                    color: #b0b0b0;
                    font-size: 15px;
                }
                
                .stat-value {
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    
                    .currency-symbol {
                        font-size: 16px;
                        font-weight: 500;
                        color: #b0b0b0;
                    }
                }
            }
        }
    }
    
    .reservations-section {
        .section-title {
            color: #fff;
            font-size: 18px;
            font-weight: 600;
        }
    }
}

</style>