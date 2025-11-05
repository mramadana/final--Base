<template>
    <div class="financial-transactions-page layout-form">
        
        <!-- Search and Settlement Button -->
        <div class="header-section mb-4">
            <div class="row align-items-center">
                <!-- Search Box -->
                <div class="col-12 col-md-8">
                    <div class="main_input">
                        <input 
                            type="text" 
                            class="" 
                            :placeholder="$t('financial.search_placeholder')"
                            v-model="searchQuery"
                        />
                        <i class="fas fa-search search-icon"></i>
                    </div>
                </div>
                
                <!-- Settlement Button -->
                <div class="col-12 col-md-4">
                    <button class="settlement-btn w-100">
                        {{ $t('financial.settlement') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Statistics Section -->
        <div class="statistics-section mb-4">
            <h3 class="section-title">{{ $t('financial.total_dues_title') }}</h3>
            
            <div class="stats-card">
                <div class="stat-row">
                    <div class="stat-label">{{ $t('financial.total_reservations') }}</div>
                    <div class="stat-value">
                        {{ stats.totalReservations }}
                        <span class="currency-symbol">ر.س</span>
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-label">{{ $t('financial.vat_tax') }}</div>
                    <div class="stat-value">
                        {{ stats.vatTax }}
                        <span class="currency-symbol">ر.س</span>
                    </div>
                </div>
                
                <div class="stat-row highlight">
                    <div class="stat-label">{{ $t('financial.net_due') }}</div>
                    <div class="stat-value">
                        {{ stats.netDue }}
                        <span class="currency-symbol">ر.س</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservations Section -->
        <div class="reservations-section">
            <h3 class="section-title mb-3">{{ $t('financial.due_reservations_title') }}</h3>
            
            <OrdersCardReservation 
                :items="filteredReservations" 
                :link-to="'/reservation'" 
                :loading="loading"
            />
        </div>

    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

// Page meta
definePageMeta({
    name: 'Sidebar.financial_transactions',
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

// Statistics data
const stats = ref({
    totalReservations: 5500,
    bookingsCount: 100,
    vatTax: 100,
    netDue: 4500
});

// Reservations data
const reservations = ref([
    {
        id: 12548,
        metaTime: 'م 01:25 - 05/12/2024',
        title: 'مطعم البيك طاولة رقم T10',
        dateRange: 'م 09:00 - 05/12/2025',
        customerName: 'فراس القمطاني',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'confirmed',
        statusText: 'حالة الحجز : مؤكد'
    },
    {
        id: 12549,
        metaTime: 'م 02:30 - 06/12/2024',
        title: 'مطعم البيك طاولة رقم T15',
        timeRange: 'م 07:30 - 09:30',
        customerName: 'سالم العتيبي',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'pending',
        statusText: 'حالة الحجز : قيد التأكيد'
    },
    {
        id: 12550,
        metaTime: 'م 03:15 - 07/12/2024',
        title: 'مطعم البيك طاولة رقم T20',
        dateRange: 'م 06:00 - 08:00',
        customerName: 'أحمد الشمري',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'confirmed',
        statusText: 'حالة الحجز : مؤكد'
    },
    {
        id: 12551,
        metaTime: 'م 04:00 - 08/12/2024',
        title: 'مطعم البيك طاولة رقم T5',
        dateRange: 'م 12:00 - 02:00',
        customerName: 'محمد الدوسري',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'confirmed',
        statusText: 'حالة الحجز : مؤكد'
    },
    {
        id: 12552,
        metaTime: 'م 05:00 - 09/12/2024',
        title: 'مطعم البيك طاولة رقم T12',
        dateRange: 'م 03:00 - 05:00',
        customerName: 'خالد الأحمدي',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'pending',
        statusText: 'حالة الحجز : قيد التأكيد'
    },
    {
        id: 12553,
        metaTime: 'م 06:00 - 10/12/2024',
        title: 'مطعم البيك طاولة رقم T8',
        dateRange: 'م 08:00 - 10:00',
        customerName: 'عبدالله المطيري',
        imageSrc: '/_nuxt/assets/images/Logo.svg',
        status: 'confirmed',
        statusText: 'حالة الحجز : مؤكد'
    }
]);

// Filtered reservations based on search
const filteredReservations = computed(() => {
    if (!searchQuery.value) return reservations.value;
    
    const query = searchQuery.value.toLowerCase();
    return reservations.value.filter(item => 
        item.id.toString().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.customerName?.toLowerCase().includes(query)
    );
});
</script>

<style lang="scss" scoped>
.financial-transactions-page {
    
    .header-section {
        .main_input {
            position: relative;
            background-color: #3a3a3a;
            border-radius: 8px;
            height: 48px;
            
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
        
        .settlement-btn {
            background-color: #f5f5f5;
            border: none;
            color: #1a1a1a;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            height: 48px;
            
            &:hover {
                background-color: var(--main-color, #ff6b35);
                color: #fff;
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

@media (max-width: 768px) {
    .financial-transactions-page {
        .header-section {
            .settlement-btn {
                margin-top: 15px;
            }
        }
    }
}
</style>