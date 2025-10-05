<template>
    <section class="statistics-section">
        <div class="row g-3">
            <div v-for="(item, index) in items.slice(0, 3)" :key="index" class="col-12 col-md-6 col-lg-4">
                <NuxtLink :to="item.link" class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon ml-1">
                            <img :src="item.icon" :alt="item.title">
                        </div>
                        <h3 class="stat-title">{{ item.title }}</h3>
                    </div>
                    <div class="stat-body">
                        <div class="stat-number">{{ item.number }}</div>

                        <hr class="stat-divider" />

                        <div class="stat-actions">
                            <span class="stat-date">{{ item.dateText }}</span>
                            <span class="action-text">{{ item.buttonText }}</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div v-for="(item, index) in items.slice(3, 5)" :key="index + 3" class="col-12 col-lg-6">
                <NuxtLink :to="item.link" class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon ml-1">
                            <img :src="item.icon" :alt="item.title">
                        </div>
                        <h3 class="stat-title">{{ item.title }}</h3>
                    </div>
                    <div class="stat-body">
                        <div class="stat-number">{{ item.number }}</div>

                        <hr class="stat-divider" />

                        <div class="stat-actions">
                            <span class="stat-date">{{ item.dateText }}</span>
                            <span class="action-text">{{ item.buttonText }}</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>

defineProps({
    items: {
        type: Array,
        required: true
    }
});

</script>

<style lang="scss" scoped>
.statistics-section {
    padding: 20px 0;
}

.stat-card {
    display: flex;
    flex-direction: column;
    background-color: #2A2A2A;
    border-radius: 12px;
    padding: 20px;
    height: 100%;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid #3a3a3a;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border-color: #4a4a4a;
    }
}

.stat-header {
    display: flex;
    align-items: center;

    .stat-title {
        color: #d1d1d1;
        font-size: 15px;
        font-weight: 500;
        margin: 0;
    }

    .stat-icon {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1919194D;
        border-radius: 8px;
        padding: 8px;
        img {
            width: 20px;
            height: 20px;
            filter: grayscale(1) brightness(1.5);
        }
    }
}

.stat-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .stat-number {
        color: #fff;
        font-size: 17px;
        font-weight: bold;
        padding: 10px 0;
        margin-bottom: auto;
    }

    .stat-divider {
        border: 0;
        border-top: 1px solid #444;
        margin: 5px 0 10px;
    }

    .stat-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;

        /* كلاس جديد لنص الزر */
        .action-text {
            color: #b0b0b0;
            font-size: 14px;
            font-weight: 500;
        }

        .stat-date {
            color: #F8F8F8;
            font-size: 13px;
        }
    }
}

@media (max-width: 768px) {
    .stat-card {
        padding: 15px;
    }
}
</style>