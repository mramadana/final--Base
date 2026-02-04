<template>
    <div>

        <div class="payment-method-section custom-payment">

            <h4 class="main-title md mb-4">{{ $t("settings.calibration_standards") }}</h4>

            <!-- Skeleton Loading -->
            <div v-if="loading" class="row">
                <div v-for="n in 6" :key="n" class="col-lg-4 col-md-6 col-12 mb-3">
                    <div class="payment-field skeleton p-2 d-flex align-items-center justify-content-between">
                        <div class="skeleton-text mb-0"></div>
                        <div class="skeleton-checkbox"></div>
                    </div>
                </div>
            </div>

            <!-- Actual Data -->
            <div v-else class="row">
                <div v-for="(item, index) in calibrationData" :key="item.id || index" class="col-lg-4 col-md-6 col-12 mb-3">
                    <div class="d-flex align-items-center justify-content-between payment-field h-100">

                        <div class="check-text hint d-flex">
                            <div class="main-title mb-0">
                                {{ item.calibration }}
                            </div>
                        </div> 

                        <!-- Electronic Payment Option -->
                        <div class="radios form-group check-inner mb-0">
                            <div class="d-flex align-items-center justify-content-between gap-3">
                                <label class="custom-radio custom-check">
                                    <input type="checkbox" name="paymentMethod" v-model="item.selected" class="d-none" />
                                    <span class="mark m-0">
                                        <i class="fas fa-check icon"></i>
                                    </span>
                                </label>
                            </div>
                        </div>     

                    </div>
                </div>
            </div>
            
        </div>

        <!-- Save Button -->
        <button class="custom-btn md mt-4" @click="saveCalibration">
            {{ $t("settings.save_changes") }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
            aria-hidden="true"></span>
        </button>

        <!-- Success Modal -->
        <Dialog v-model:visible="showSuccessModal" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-0 hint_success">
                    {{ $t("settings.saved_successfully") }}
                </h1>
            </div>
        </Dialog>
        
    </div>
</template>

<script setup>

definePageMeta({
    name: "settings.calibration",
    middleware: 'auth'
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Reactive data - This will come from backend
const calibrationData = ref([]);

const showSuccessModal = ref(false);
const loading = ref(false);

// Config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// Save calibration settings
const saveCalibration = async () => {
    const selectedItems = calibrationData.value.filter(item => item.selected);
    
    // Validate: at least one standard must be selected
    if (selectedItems.length === 0) {
        errorToast(t('settings.select_at_least_one_standard'));
        return;
    }
    
    console.log('Selected calibration items:', selectedItems);
    
    loading.value = true;
    
    try {
        // Prepare data for API - send as array of IDs
        const selectedIds = calibrationData.value
            .filter(item => item.selected)
            .map(item => item.id)
            .filter(id => id !== undefined); // Filter out items without IDs
        
        const fd = new FormData();
        selectedIds.forEach((id, index) => {
            fd.append(`standards[${index}]`, id);
        });
        
        // Make API call to update standards
        const res = await axios.post('provider/profile/standards/update', fd, config);
        
        if (response(res) === "success") {
            successToast(t('settings.saved_successfully'));
            showSuccessModal.value = true;
            
            // Close modal after 2 seconds
            setTimeout(() => {
                showSuccessModal.value = false;
            }, 2000);
        } else {
            errorToast(res.data.msg);
        }
        
    } catch (error) {
        console.error('Error saving calibration:', error);
        errorToast(t('settings.update_failed'));
    } finally {
        loading.value = false;
    }
};

// Load calibration data from API
const loadCalibrationData = async () => {
    try {
        loading.value = true;
        const res = await axios.get('provider/profile/standards', config);
        
        if (response(res) === "success") {
            const standards = res.data.data;
            
            // Transform API data to the format expected by the template
            calibrationData.value = standards.map(standard => ({
                calibration: standard.name || standard.title || standard.calibration,
                selected: standard.selected || standard.is_selected || false,
                id: standard.id
            }));
        }
    } catch (error) {
        console.error('Error loading calibration data:', error);
        errorToast(t('settings.error_loading_data'));
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadCalibrationData();
});

    const globalStore = useGlobalStore();
    globalStore.title = t('Auth.settings');

</script>

<style lang="scss" scoped>

.payment-field {
    padding: 20px 15px;
    background-color: #FFFFFF0F;
    border-radius: 10px;
}

/* Skeleton Loading Styles */
.skeleton {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    
    .skeleton-text {
        height: 20px;
        width: 70%;
        background: rgba(137, 137, 137, 30%);
        border-radius: 4px;
        margin-bottom: 10px;
    }
    
    .skeleton-checkbox {
        width: 20px;
        height: 20px;
        background: rgba(137, 137, 137, 30%);
        border-radius: 50%;
    }
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.custom-radio {
    cursor: pointer;
    
    .mark {
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        
        .icon {
            display: none;
            color: #000;
            font-size: 12px;
        }
    }
    
    input:checked + .mark {
        background: #848484;
        border-color: #848484;
        
        .icon {
            display: block;
            color: #fff;
        }
    }
}
</style>
