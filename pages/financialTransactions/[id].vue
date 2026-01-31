<template>
    <div class="financial-transactions-page layout-form">

        <!-- Statistics Section -->
        <div class="statistics-section mb-4">
            <h3 class="section-title">{{ $t('financial.total_dues_title') }}</h3>
            
            <div class="stats-card">

                <div class="stat-row">
                    <div class="stat-label">{{ $t('financial.settlement_status') }}</div>
                    <div class="stat-value">
                        {{ settlementData.status_text }}
                    </div>
                </div>

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

// Get route parameter
const route = useRoute();
const settlementId = route.params.id;

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
    name: 'financial.settlement_details',
    layout: 'default',
});

// Images
import Logo from '@/assets/images/Logo.svg';

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

// Settlement data
const settlementData = ref({});

// Statistics data
const stats = ref({});

// Reservations data
const reservations = ref([]);

// Get settlement data by ID from API
const getSettlementById = async () => {
    loading.value = true;
    try {
        const res = await axios.get(`provider/settlements/${settlementId}`, config.value);
        if (res.data.key === 'success') {
            const data = res.data.data;
            
            // Update settlement data
            if (data.settlement) {
                settlementData.value = {
                    status_text: data.settlement.status_text || '',
                    number: data.settlement.number || '',
                    total_due_amount: data.settlement.total_due_amount || '0.00',
                    vat_amount: data.settlement.vat_amount || '0.00',
                    total_price: data.settlement.total_price || '0.00',
                    currency: data.settlement.currency || 'ريال'
                };
            }
            
            // Update statistics from settlement data
            stats.value = {
                totalReservations: data.price || '0.00',
                vatTax: data.vat_amount || '0.00',
                netDue: data.total_price || '0.00',
                currency: data.currency || 'ريال'
            };
            
            // Map reservations data to component format
            if (data.reservations && Array.isArray(data.reservations)) {
                reservations.value = data.reservations.map(item => ({
                    id: item.id,
                    reservationNum: item.reservation_num,
                    metaTime: `منذ يوم - ${new Date().toLocaleDateString('ar-SA')}`,
                    title: `حجز رقم ${item.reservation_num}`,
                    dateRange: `${new Date().toLocaleTimeString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}`,
                    reservationDate: new Date().toLocaleDateString('ar-SA'),
                    customerName: 'عميل',
                    imageSrc: Logo,
                    status: item.status,
                    statusText: item.status_text
                }));
            }
        }
    } catch (error) {
        console.error("Get settlement by ID error:", error);
        errorToast('حصل خطأ في تحميل بيانات التسوية');
    } finally {
        loading.value = false;
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
    await getSettlementById();
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