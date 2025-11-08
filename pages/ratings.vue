<template>
    <div class="layout-form">
        
        <!-- Loading State -->
        <div v-if="loading" class="ratings-skeleton">
            <div class="skeleton-grid">
                <div class="skeleton-box"></div>
                <div class="skeleton-box"></div>
            </div>
        </div>

        <!-- Ratings Content -->
        <div v-else class="row">
            
            <!-- متوسط التقييمات - على اليمين -->
            <div class="col-12 col-lg-4 col-md-5">
                <div class="rating-stats">
                    <h3 class="section-title">متوسط التقييمات</h3>
                    
                    <div class="average-rating">
                        <div class="rating-number">
                            <i class="fas fa-star"></i>
                            {{ ratingStats.average }}
                        </div>
                    </div>
    
                    <!-- Rating Breakdown -->
                    <div class="rating-breakdown">
                        <div v-for="item in ratingStats.breakdown" :key="item.stars" class="rating-row">
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="percentage">{{ item.percentage }} %</span>
                                <div class="d-flex justify-content-start rate-parent mt-2 mb-2 sm-rate">
                                    <Rating v-model="item.stars" readonly :cancel="false" :dir="'ltr'"/>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: item.percentage + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- التقييمات - على اليسار -->
            <div class="col-12 col-lg-8 col-md-7">
                <div class="reviews-list">
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
    
                    <!-- View All Button -->
                    <NuxtLink to="/allRating" class="view-all-btn" @click="viewAllReviews">
                        <i class="fas fa-eye"></i>
                        عرض جميع التقييمات
                    </NuxtLink>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

definePageMeta({
    name: 'ratings',
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

// Right Section: Rating Statistics
.rating-stats {
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    
    .section-title {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 24px;
        text-align: center;
    }
    
    .average-rating {
        text-align: center;
        margin-bottom: 32px;
        
        .rating-number {
            font-size: 64px;
            font-weight: 700;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
            
            i {
                color: #FFC107;
                font-size: 48px;
            }
        }
    }
    
    .rating-breakdown {
        display: flex;
        flex-direction: column;
        gap: 16px;
        
        .rating-row {
            display: flex;
            gap: 12px;
            flex-direction: column;
            .stars-group {
                display: flex;
                gap: 4px;
                min-width: 100px;
                justify-content: end;
                i {
                    color: #FFC107;
                    font-size: 16px;
                }
            }
        }
    }

    .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        
        .progress-fill {
            height: 100%;
            background: #fff;
            border-radius: 4px;
            transition: width 0.3s ease;
            height: 9px;
        }
    }
    
    .percentage {
        color: #b0b0b0;
        font-size: 14px;
        min-width: 50px;
    }
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
            
            .review-stars {
                display: flex;
                gap: 4px;
                
                i {
                    color: #FFC107;
                    font-size: 16px;
                }
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
    
    .view-all-btn {
        background-color: transparent;
        color: #fff;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        
        i {
            font-size: 16px;
        }
    }
}

// Loading Skeleton
.ratings-skeleton {
    .skeleton-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        
        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
        
        .skeleton-box {
            height: 400px;
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.05) 25%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0.05) 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 16px;
        }
    }
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>