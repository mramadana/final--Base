<template>
    <div class="custom-width with-auth">
        <h1 class="main-title bold lg mb-4">{{ $t("Global.choose_package") }}</h1>
        
        <form @submit.prevent="choosePackage">

            <div class="packages-container">

                <label v-for="(pkg, index) in packages" 
                       :key="index" 
                       class="package-card"
                       :class="{ 'selected': selectedPackage === pkg.id }">
                    <input type="radio" 
                        :value="pkg.id" 
                        v-model="selectedPackage" 
                        name="package" 
                        class="package-radio">
                    <div class="package-content">
                        <div class="package-header">
                            <span class="package-icon"><i class="fas fa-award"></i></span>
                        </div>
                        <div class="package-price d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <span>{{ $t('Common.currency') }}</span>
                            <div class="d-flex flex-direction-row custom-price"> <span>{{ $t('Global.price') }}</span>: &nbsp; <span>{{ pkg.price }} دينار</span> </div>
                        </div>
                        <p class="package-description">{{ pkg.description }}</p>
                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div class="package-duration">
                                <span class="duration-icon"><i class="fas fa-stopwatch"></i></span>
                                {{ $t('Global.duration') }}: {{ pkg.duration }} {{ $t('Global.months') }}
                            </div>
                            
                        </div>
                    </div>
                </label>

                <button type="submit" class="custom-btn mt-4 w-100" :disabled="loading">
                    {{ $t('Auth.confirmation') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </div>

        </form>

        <!-- success modal -->
        <Dialog
            v-model:visible="successfullyChoose"
            modal
            class="custum_dialog_width without-close"
            :draggable="false">
            <div class="text-center">
                <h2 class="main-title bold mb-3 hint_success">
                    {{ $t('Auth.version_experimental') }}
                </h2>
                <h3 class="desc hint_success mb-4">{{ $t('Auth.use_package_experimental') }}</h3>
                <img
                    src="@/assets/images/done.svg"
                    alt="check-img"
                    class="check-img lg"
                    loading="lazy"
                />

                <nuxt-link to="/" class="custom-btn mt-4 w-100 hint_success">{{ $t('Auth.confirmation') }}</nuxt-link>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

definePageMeta({
    layout: 'auth'
});

// **************** Data ****************

const selectedPackage = ref(null);

const errors = ref([]);

const loading = ref(false);

const { successToast, errorToast } = toastMsg();

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const successfullyChoose = ref(false);

const packages = ref([
    {
        id: 1,
        title: 'باقة تقويم الرسوم',
        price: 4544,
        description: 'تقويم الاسنان تشمل جميع انواع تقويم الاسنان مثل التقويم الثابت ,تقويم الاسنان المتحرك ,تقويم الاسنان الشفاف ,تقويم زينة الاسنان',
        duration: 6
    },
    {
        id: 2,
        title: 'باقة تقويم الرسوم',
        price: 4544,
        description: 'تقويم الاسنان تشمل جميع انواع تقويم الاسنان مثل التقويم الثابت ,تقويم الاسنان المتحرك ,تقويم الاسنان الشفاف ,تقويم زينة الاسنان',
        duration: 6
    },
    {
        id: 3,
        title: 'باقة تقويم الرسوم',
        price: 4544,
        description: 'تقويم الاسنان تشمل جميع انواع تقويم الاسنان مثل التقويم الثابت ,تقويم الاسنان المتحرك ,تقويم الاسنان الشفاف ,تقويم زينة الاسنان',
        duration: 6
    }
]);

const choosePackage = async () => {
    if (!selectedPackage.value) {
        errorToast(t('validation.please_select_package'));
        return;
    }

    loading.value = true;

    try {
        const { data, error } = await submitApiForm('choose-package', { package_id: selectedPackage.value });
        successfullyChoose.value = true;
        if (error) {
            console.error('Error submitting form:', error);
            // Handle error here
        } else {
            errorToast(data.msg || "An error occurred");
            console.log('Success:', data);
            // Handle success here
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        // Handle unexpected error here
    } finally {
        loading.value = false;
    }
};

</script>

<style scoped lang="scss">
.packages-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 530px;
    margin: 0 auto;
}

.package-card {
    position: relative;
    display: block;
    padding: 15px;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;

    &.selected {
        border-color: #FF69B4;
        background: #FFF0F5;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
}

.package-radio {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.package-content {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.package-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.package-icon {
    font-size: 1.2rem;
    color: #D69519;
}

.package-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin: 0;
}

.package-price {
    font-size: 0.9rem;
}

.package-description {
    font-size: 0.8rem;
    color: #666;
    line-height: 1.5;
    margin: 0.3rem 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #dddddd;
}

.package-duration {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #666;

    .duration-icon {
        color: #404040;
        font-size: 1rem;
    }
}
</style>