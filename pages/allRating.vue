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
            <h3 class="section-title">التقييمات</h3>
            
            <div class="reviews-wrapper">
                <div v-for="review in reviews" :key="review.id" class="review-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="reviewer-name">{{ review.name }}</h4>
                        <div class="d-flex justify-content-start rate-parent sm-rate">
                            <Rating v-model="review.rating" readonly :cancel="false" :dir="'ltr'"/>
                        </div>
                    </div>
                    <p class="review-date">منذ {{ review.daysAgo }} يوم</p>
                    <p class="review-text">{{ review.comment }} 👌</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

definePageMeta({
    layout: 'default'
});

const globalStore = useGlobalStore();

// Loading state
const loading = ref(true);

const rating = ref(0);

// Rating Statistics
const ratingStats = ref({
    average: 4.7,
    breakdown: [
        { stars: 5, percentage: 80 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 7 },
        { stars: 1, percentage: 3 }
    ]
});

// Reviews List
const reviews = ref([
    {
        id: 1,
        name: 'نوح العتيبي',
        daysAgo: 20,
        rating: 3,
        comment: 'المكان فخم والخدمة ممتازة'
    },
    {
        id: 2,
        name: 'نوح العتيبي',
        daysAgo: 20,
        rating: 2,
        comment: 'المكان فخم والخدمة ممتازة'
    },
    {
        id: 3,
        name: 'نوح العتيبي',
        daysAgo: 20,
        rating: 1,
        comment: 'المكان فخم والخدمة ممتازة'
    },
]);

// Get Data Function (API Call)
const getData = async () => {
    loading.value = true;
    
    try {
        // استبدل هذا بـ API call الحقيقي
        // const axios = useApi();
        // const config = { headers: { Authorization: `Bearer ${token}` } };
        // const res = await axios.get('ratings', config);
        // ratingStats.value = res.data.data.stats;
        // reviews.value = res.data.data.reviews;
        
        // محاكاة API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        loading.value = false;
    } catch (err) {
        console.log(err);
        loading.value = false;
    }
};

// View All Reviews
const viewAllReviews = () => {
    console.log('View all reviews...');
    // navigateTo('/ratings/all');
};

// Set global store
globalStore.title = 'التقييمات';
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = null;

// OnMounted - Get data on page load
onMounted(async () => {
    await getData();
});
</script>

<style scoped lang="scss">
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