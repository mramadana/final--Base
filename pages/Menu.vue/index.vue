<template>
    <div class="menu-page">
        <!-- Header Section -->
        <div class="header-section">
            <h1 class="main-title bold md">مينيومالي</h1>
            <button class="add-menu-btn" @click="handleAddMenu">
                <i class="fas fa-plus"></i>
                إضافة منيو جديد
            </button>
        </div>

        <!-- Menu Cards Section -->
        <div class="menu-cards-container">
            <!-- Meals Menu Card -->
            <div class="menu-card">
                <h2 class="menu-card-title">منيو الوجبات</h2>
                <div class="menu-card-image">
                    <img 
                        src="@/assets/images/meals-menu.jpg" 
                        alt="منيو الوجبات"
                        @error="handleImageError"
                    />
                </div>
                <button class="view-details-btn" @click="handleViewMealsMenu">
                    عرض التفاصيل
                </button>
            </div>

            <!-- Drinks Menu Card -->
            <div class="menu-card">
                <h2 class="menu-card-title">منيو المشروبات</h2>
                <div class="menu-card-image">
                    <img 
                        src="@/assets/images/drinks-menu.jpg" 
                        alt="منيو المشروبات"
                        @error="handleImageError"
                    />
                </div>
                <button class="view-details-btn" @click="handleViewDrinksMenu">
                    عرض التفاصيل
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Handle add new menu
const handleAddMenu = () => {
    console.log('Add new menu clicked');
    // Navigate to add menu page
    // navigateTo('/menu/add');
};

// Handle view meals menu
const handleViewMealsMenu = () => {
    console.log('View meals menu clicked');
    // Navigate to meals menu details
    // navigateTo('/menu/meals');
};

// Handle view drinks menu
const handleViewDrinksMenu = () => {
    console.log('View drinks menu clicked');
    // Navigate to drinks menu details
    // navigateTo('/menu/drinks');
};

// Handle image error (fallback)
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/500x300?text=Menu+Image';
};

// Page meta
definePageMeta({
    name: "Sidebar.menu",
    layout: "default",
});
</script>

<style lang="scss" scoped>

.menu-page {
    padding: 0;
}

.header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    .main-title {
        margin: 0;
        color: #fff;
    }

    .add-menu-btn {
        background-color: #2a2a2a;
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        color: #fff;
        padding: 12px 24px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;

        i {
            font-size: 14px;
        }

        &:hover {
            background-color: #3a3a3a;
            border-color: var(--main-color, #ff6b35);
            color: var(--main-color, #ff6b35);
        }
    }
}

.menu-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.menu-card {
    background-color: #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #2a2a2a;
    transition: all 0.3s ease;

    &:hover {
        border-color: #3a3a3a;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .menu-card-title {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        text-align: center;
        padding: 24px 20px;
        margin: 0;
        background-color: #212121;
        border-bottom: 1px solid #2a2a2a;
    }

    .menu-card-image {
        width: 100%;
        height: 320px;
        overflow: hidden;
        position: relative;
        background-color: #252525;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    .view-details-btn {
        width: 100%;
        background-color: #f5f5f5;
        border: none;
        color: #1a1a1a;
        padding: 18px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: var(--main-color, #ff6b35);
            color: #fff;
        }
    }
}
</style>