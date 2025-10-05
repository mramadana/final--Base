<template>
    <section class="statistics-section">
        <div class="row g-3">
            <!-- أول 3 عناصر -->
            <div v-for="index in 3" :key="index" class="col-12 col-md-6 col-lg-4">
                <div class="stat-card skeleton-card">
                    <div class="stat-header">
                        <div class="skeleton-icon skeleton-shimmer"></div>
                        <div class="skeleton-title skeleton-shimmer"></div>
                    </div>
                    <div class="stat-body">
                        <div class="skeleton-number skeleton-shimmer"></div>
                        
                        <hr class="stat-divider" />
                        
                        <div class="stat-actions">
                            <div class="skeleton-text skeleton-shimmer"></div>
                            <div class="skeleton-date skeleton-shimmer"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- آخر عنصرين -->
            <div v-for="index in 2" :key="index + 3" class="col-12 col-lg-6">
                <div class="stat-card skeleton-card">
                    <div class="stat-header">
                        <div class="skeleton-icon skeleton-shimmer"></div>
                        <div class="skeleton-title skeleton-shimmer"></div>
                    </div>
                    <div class="stat-body">
                        <div class="skeleton-number skeleton-shimmer"></div>
                        
                        <hr class="stat-divider" />
                        
                        <div class="stat-actions">
                            <div class="skeleton-text skeleton-shimmer"></div>
                            <div class="skeleton-date skeleton-shimmer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

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
    border: 1px solid #3a3a3a;
}

.stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.skeleton-icon {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    margin-left: 10px;
    background-color: #3a3a3a;
}

.skeleton-title {
    height: 20px;
    width: 150px;
    border-radius: 4px;
    background-color: #3a3a3a;
}

.stat-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.skeleton-number {
    height: 24px;
    width: 180px;
    border-radius: 4px;
    margin: 10px 0;
    background-color: #3a3a3a;
}

.stat-divider {
    border: 0;
    border-top: 1px solid #444;
    margin: 15px 0;
}

.stat-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-text {
    height: 16px;
    width: 120px;
    border-radius: 4px;
    background-color: #3a3a3a;
}

.skeleton-date {
    height: 14px;
    width: 100px;
    border-radius: 4px;
    background-color: #3a3a3a;
}

/* Shimmer Animation */
.skeleton-shimmer {
    position: relative;
    overflow: hidden;
    
    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0)
        );
        animation: shimmer 2s infinite;
    }
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

@media (max-width: 768px) {
    .stat-card {
        padding: 15px;
    }
}
</style>
