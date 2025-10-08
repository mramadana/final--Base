<template>
    <div>

        <div class="payment-method-section custom-payment">

            <h4 class="main-title md mb-4">{{ $t("settings.calibration_standards") }}</h4>

            <div class="row">
                <div v-for="(item, index) in calibrationData" :key="index" class="col-lg-4 col-md-6 col-12 mb-3">
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
    layout: "default",
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

// Reactive data - This will come from backend
const calibrationData = ref([
    { calibration: 'المعايير', selected: false },
    { calibration: 'المعايير', selected: true },
    { calibration: 'المعايير', selected: false },
    { calibration: 'المعايير', selected: true },
    { calibration: 'المعايير', selected: false },
    { calibration: 'المعايير', selected: false }
]);

const showSuccessModal = ref(false);
const loading = ref(false);

const { successToast, errorToast } = toastMsg();

// Save calibration settings
const saveCalibration = () => {
    const selectedItems = calibrationData.value.filter(item => item.selected);
    console.log('Selected calibration items:', selectedItems);
    
    // Here you would make the actual API call
    // await axios.post('save-calibration', { items: selectedItems });
    
    successToast(t('Settings.calibration_saved_successfully'));
    showSuccessModal.value = true;
};

onMounted(() => {
    // Fetch calibration data from backend
    // const response = await axios.get('get-calibration-data');
    // calibrationData.value = response.data;
    console.log('Calibration page mounted');
});

</script>

<style lang="scss" scoped>

.payment-field {
    padding: 20px 15px;
    background-color: #FFFFFF0F;
    border-radius: 10px;
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
