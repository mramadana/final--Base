<template>
    <section class="info-cards-section">
        <div class="row g-3">
            <!-- Card 1: أحدث التنبيهات -->
            <div class="col-12 col-lg-6">
                <div class="info-card">
                    <div class="card-header-section">
                        <h3 class="card-title">أحدث التنبيهات</h3>
                    </div>
                    
                    <div class="notifications-list" v-if="notifications.length > 0">
                        <div v-for="(notif, index) in notifications" :key="index" class="notification-item">
                            <div class="notif-content">
                                <div class="notification">
                                    <img src="@/assets/images/notification-img.svg" alt="notification-img">
                                </div>
                                <div class="notif-text">
                                    <p class="notif-message">{{ notif.message }}</p>
                                    <span class="notif-time">{{ notif.time }}</span>
                                </div>
                            </div>
                            <button class="delete-btn" @click="deleteNotification(index)">
                                <img src="@/assets/images/home-img/delet-noft.svg" alt="delete-noft">
                            </button>
                        </div>
                    </div>

                    <div class="main-title flex-grow-1 d-flex align-items-center justify-content-center" v-else>
                        لا يوجد تنبيهات الان
                    </div>
                    
                    <NuxtLink to="/notifications" class="view-all-link">
                        عرض جميع التنبيهات
                    </NuxtLink>
                </div>
            </div>

            <!-- Card 2: روابط سريعة -->
            <div class="col-12 col-lg-3">
                <div class="info-card quick-links-card">
                    <div class="card-header-section">
                        <h3 class="card-title">روابط سريعة</h3>
                    </div>
                    
                    <div class="quick-links-content">
                        <!-- Main Link (Large) -->
                        <NuxtLink 
                            :to="quickLinks[0].url"
                            class="quick-link-main"
                        >
                        <div class="main-link-icon ml-1">
                            <img src="@/assets/images/sidebar/tables.svg" alt="quickLinks[0].text">
                        </div>
                            <span class="main-link-text">{{ quickLinks[0].text }}</span>
                        </NuxtLink>
                        
                        <hr class="links-divider" />
                        
                        <!-- Bottom Links Grid (2 columns) -->
                        <div class="quick-links-grid">
                            <NuxtLink 
                                v-for="(link, index) in quickLinks.slice(1)" 
                                :key="index"
                                :to="link.url"
                                class="quick-link-item"
                            >
                                <div class="link-icon">
                                    <img :src="link.image" :alt="link.text">
                                </div>
                                <span class="link-text">{{ link.text }}</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card 3: حالة الحساب -->
            <div class="col-12 col-lg-3">
                <div class="info-card account-card">
                    <div class="card-header-section">
                        <h3 class="card-title">حالة الحساب</h3>
                        <span class="status-badge inactive">
                            <img src="@/assets/images/home-img/danger.svg" alt="inactive">
                            غير مفعل
                        </span>
                    </div>
                    
                    <div class="account-content">
                        <p class="account-message">
                            يرجى اعادة الاشتراك لاعادة<br>
                            استخدام الحساب مرة اخرى
                        </p>
                        
                        <div class="subscription-date">
                            <span class="date-text">٢٥/٨/٢٥</span>
                        </div>
                    </div>
                    
                    <button class="renew-btn">
                        اعادة الاشتراك
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const notifications = ref([
    {
        message: 'تم إرسال طلب حجز جديد رقم #604',
        time: 'منذ 1 ساعة'
    },
    {
        message: 'تم إرسال طلب حجز جديد رقم #604',
        time: 'منذ 1 ساعة'
    }
]);

const quickLinks = ref([
    {
        text: 'إضافة طاولة جديدة',
        url: '/tables/add'
    },
    {
        text: 'الحجوزات',
        image: '/_nuxt/assets/images/sidebar/reservations.svg',
        url: '/reservations'
    },
    {
        text: 'المنيو',
        image: '/_nuxt/assets/images/sidebar/menu-board.svg',
        url: '/menu'
    }
]);

const deleteNotification = (index) => {
    notifications.value.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.info-cards-section {
    padding: 20px 0;
}

.info-card {
    background-color: #2A2A2A;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
    border: 1px solid #3a3a3a;
    display: flex;
    flex-direction: column;
}

.card-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .card-title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }
    
    .status-badge {
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 13px;
    }
}

// Notifications Card
.notifications-list {
    flex-grow: 1;
    margin-bottom: 15px;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 10px;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.notif-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex: 1;
}

.notif-icon {
    width: 35px;
    height: 35px;
    background-color: #E21876;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    i {
        color: #fff;
        font-size: 16px;
    }
}

.notif-text {
    flex: 1;
    
    .notif-message {
        color: #fff;
        font-size: 14px;
        margin: 0 0 5px 0;
        line-height: 1.4;
    }
    
    .notif-time {
        color: #909090;
        font-size: 12px;
    }
}

.delete-btn {
    background: transparent;
    border: none;
    color: #E21876;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease;
    width: 35px;
    height: 35px;
    background-color: var(--main-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
        font-size: 16px;
    }
}

.view-all-link {
    display: block;
    text-align: center;
    color: #b0b0b0;
    font-size: 14px;
    text-decoration: none;
    padding-top: 10px;
    border-top: 1px solid #3a3a3a;
    margin-top: auto;
    transition: all 0.3s ease;
}

// Quick Links Card
.quick-links-card {
    .quick-links-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
}

.quick-link-main {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    background-color: transparent;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-bottom: 15px;
    
    .main-link-text {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
    }
    
    .main-link-icon {
        width: 40px;
        height: 40px;
        background-color: #1919194D;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}

.links-divider {
    border: 0;
    border-top: 1.5px solid gray;
    margin: 0 0 15px 0;
}

.quick-links-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.quick-link-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: transparent;
    text-decoration: none;
    transition: all 0.3s ease;
    gap: 10px;
    &:not(:last-child) {
        border-inline-end: 1px solid #EEEEEE0D;
    }
    
    .link-icon {
        width: 50px;
        height: 50px;
        background-color: #1919194D;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        
        i {
            color: #fff;
            font-size: 22px;
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    
    .link-text {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
    }
}

// Account Status Card
.account-card {
    .status-badge {
        display: flex;
        align-items: center;
        gap: 5px;
        
        
        img {
            width: 16px;
            height: 16px;
        }
    }
}

.account-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding: 20px 0;
}

.account-message {
    color: #909090;
    font-size: 14px;
    line-height: 1.8;
    margin: 0;
}

.subscription-date {
    width: 100%;
    text-align: center;
    
    .date-text {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
    }
}

.renew-btn {
    width: 100%;
    padding: 12px;
    background-color: #fff;
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

@media (max-width: 992px) {
    .quick-links-grid {
        gap: 12px;
    }
}

@media (max-width: 576px) {
    .info-card {
        padding: 15px;
    }
    
    .quick-link-main {
        padding: 15px;
        
        .main-link-icon {
            width: 45px;
            height: 45px;
        }
    }
    
    .quick-link-item {
        padding: 15px 10px;
        
        .link-icon {
            width: 40px;
            height: 40px;
        }
    }
}
</style>