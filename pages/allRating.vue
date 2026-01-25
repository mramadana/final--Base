<template>
    <div class="layout-form">
        <!-- Loading State -->
        <div v-if="loading" class="reviews-skeleton">
            <div class="reviews-wrapper">
                <div v-for="n in 3" :key="n" class="review-card-skeleton">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="skeleton-line name"></div>
                        <div class="skeleton-stars">
                            <div class="skeleton-star" v-for="i in 5" :key="i"></div>
                        </div>
                    </div>
                    <div class="skeleton-line date"></div>
                    <div class="skeleton-line text-1"></div>
                    <div class="skeleton-line text-2"></div>
                </div>
            </div>
        </div>

        <!-- Ratings Content -->
        <div v-else class="reviews-list">
            <h3 class="section-title">{{ $t('ratings.ratings') }}</h3>
            
            <div class="reviews-wrapper">
                <div v-for="review in reviews" :key="review.id" class="review-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="reviewer-name">{{ review.name }}</h4>
                        <div class="d-flex justify-content-start rate-parent sm-rate">
                            <StarRating :rating="review.rating" :read-only="true" :increment="0.5" :max-rating="5" :star-size="22" :rounded-corners="true" :border-width="2"/>
                        </div>
                    </div>
                    <p class="review-date">{{ review.date }}</p>
                    <p class="review-text">{{ review.comment }}</p>
                </div>
            </div>

            <!-- Paginator -->
            <div v-if="showPaginate" class="paginate-parent">
                <Paginator :rows="pageLimit" @page="onPaginate" :totalRecords="totalPage" class="mt-5" dir="ltr" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import StarRating from 'vue-star-rating';
import { useAuthStore } from '~/stores/auth';

const { t } = useI18n({ useScope: 'global' });

// success response
const { response } = responseApi();

// Axios
const axios = useApi();

definePageMeta({
    name: 'ratings.ratings',
});

const globalStore = useGlobalStore();

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// Loading state
const loading = ref(true);

// Reviews List
const reviews = ref([]);

// Paginator
const currentPage = ref(1);
const pageLimit = ref();
const totalPage = ref();

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// Get Data Function (API Call)
const getData = async () => {
    loading.value = true;
    
    try {
        const res = await axios.get(`provider/profile/rates?page=${currentPage.value}`, config);
        
        if (response(res) == "success") {
            const ratesData = res.data.data.data || [];
            
            // Transform API data to reviews format
            reviews.value = ratesData.map(rate => ({
                id: rate.id,
                name: rate.name || '',
                date: rate.date,
                rating: parseFloat(rate.rate) || 0,
                comment: rate.comment || ''
            }));
            
            // Set pagination data
            totalPage.value = res.data.data.pagination.total_items;
            pageLimit.value = res.data.data.pagination.per_page;
        }
        
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

// Computed
const showPaginate = computed(() => {
    return totalPage.value > pageLimit.value;
});

// Set global store
globalStore.title = t('Sidebar.ratings');
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = null;

// OnMounted - Get data on page load
onMounted(async () => {
    await getData();
});
</script>

<style scoped lang="scss">

:deep(.vue-star-rating) {
    direction: ltr;
}

:deep(.vue-star-rating-rating-text) {
    display: none;
}

.paginate-parent {
    margin-top: 24px;
}

// Left Section: Reviews List
.reviews-list {
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    
    .section-title {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 24px;
        text-align: center;
    }
    
    .reviews-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 24px;
        
        .review-card {
            &:not(:last-child) {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 15px;
            }
            
            .reviewer-name {
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }
            
            .review-date {
                color: #888;
                font-size: 13px;
                margin-bottom: 12px;
            }
            
            .review-text {
                color: #b0b0b0;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            }
        }
    }
}

// Skeleton Styles
.reviews-skeleton {
    .reviews-wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .review-card-skeleton {
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &:last-child {
            border-bottom: none;
        }
    }

    .skeleton-line {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        margin-bottom: 10px;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
                rgba(255, 255, 255, 0) 0%, 
                rgba(255, 255, 255, 0.1) 50%, 
                rgba(255, 255, 255, 0) 100%);
            animation: shimmer 1.5s infinite;
        }

        &.name {
            width: 40%;
            height: 20px;
        }

        &.date {
            width: 30%;
            height: 14px;
            margin-bottom: 15px;
        }

        &.text-1 {
            width: 100%;
            height: 16px;
            margin-bottom: 8px;
        }

        &.text-2 {
            width: 80%;
            height: 16px;
        }
    }

    .skeleton-stars {
        display: flex;
        gap: 4px;
    }

    .skeleton-star {
        width: 16px;
        height: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
                rgba(255, 255, 255, 0) 0%, 
                rgba(255, 255, 255, 0.1) 50%, 
                rgba(255, 255, 255, 0) 100%);
            animation: shimmer 1.5s infinite;
        }
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}
</style>