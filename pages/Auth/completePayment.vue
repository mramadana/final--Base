<template>
    <div class="w-100">
        <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />

        <h1 class="main-title text-center md bold mb-4">{{ $t("Auth.complete_payment") }}</h1>

        <div class="text-layout w-100 mb-4">

            <!-- Payment Info -->
            <div class="payment-info mb-4">
                <div class="payment-header d-flex justify-content-between align-items-center mb-3">
                    <h3 class="payment-title">{{ $t("Auth.annual_subscription_payment") }}</h3>
                </div>
                
                <div class="payment-details">
                    <p class="payment-desc">
                        {{ $t("Auth.payment_description") }}
                    </p>
                    
                    <!-- Country Flag and Price -->
                    <div class="price-section d-flex align-items-center justify-content-between mt-3 custom-payment">
                        
                        <div class="country-info d-flex align-items-center gap-2">
                            <Skeleton v-if="!packageData.package_price" width="120px" height="20px" />
                            <span v-else class="country-text">{{ $t("Auth.subscription_value_country") }} {{ packageData.package_price }} {{ packageData.currency }}</span>
                        </div>

                        <Skeleton v-if="!packageData.country_flag" width="35px" height="25px" borderRadius="2px" />
                        <img v-else :src="packageData.country_flag" alt="Country Flag" class="country-flag" />

                    </div>
                </div>
            </div>

            <!-- Payment Method Section -->
            <div class="payment-method-section custom-payment">

                <h4 class="section-title mb-4">{{ $t("Auth.payment_method") }}</h4>

                <div class="d-flex align-items-center justify-content-between payment-field">

                    <div class="check-text hint d-flex">
                        <div class="payment-method-text">
                            {{ $t("Auth.electronic_payment") }}
                        </div>
                    </div> 

                    <!-- Electronic Payment Option -->
                    <div class="radios form-group check-inner mb-0">
                        <div class="d-flex align-items-center justify-content-between gap-3">
                            <label class="custom-radio custom-check">
                                <input type="checkbox" name="paymentMethod" v-model="selectedPaymentMethod" class="d-none" />
                                <span class="mark m-0">
                                    <i class="fas fa-check icon"></i>
                                </span>
                            </label>
                        </div>
                    </div>     

                </div>
                
                
            </div>

            <!-- Complete Payment Button -->
            <button class="custom-btn w-100" @click="processPayment" :disabled="!selectedPaymentMethod || loading">
                {{ $t("Auth.complete_payment_process") }}
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            </button>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="showSuccessModal" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.payment_success_message") }}
                </h1>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

definePageMeta({
    name: "Auth.complete_payment",
    layout: "auth",
});

const { token } = storeToRefs(
    useAuthStore()
);
// config
const config = computed(() => {
    return { headers: { Authorization: `Bearer ${token.value}` } }
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

// Reactive data
const selectedPaymentMethod = ref(true);
const showSuccessModal = ref(false);
const loading = ref(false);
const packageData = ref({
    package_price: '',
    country_flag: '',
    currency: ''
});

const { response } = responseApi();
const axios = useApi();
const { successToast, errorToast } = toastMsg();

// Fetch available package
const fetchAvailablePackage = async () => {
    try {
        const response = await axios.get('provider/subscription/get-available-package', config.value);
        
        if (response.data.key === 'success') {
            packageData.value = response.data.data;
            console.log('Package data fetched:', packageData.value);
        } else {
            errorToast(response.data.msg || 'Failed to fetch package data');
        }
    } catch (error) {
        console.error('Error fetching package:', error);
        errorToast('Error loading package information');
    }
};

// Process the actual payment
const processPayment = async () => {
    if (!selectedPaymentMethod.value) {
        errorToast('Please select a payment method');
        return;
    }
    
    loading.value = true;
    
    try {
        const response = await axios.post('provider/subscription', 
            { package_id: 1 }, 
            config.value
        );
        
        if (response.data.key === 'success') {
            // Show success modal
            showSuccessModal.value = true;
            successToast(t('Auth.payment_completed_successfully'));
            
            // Close modal and redirect after 1 second
            setTimeout(() => {
                showSuccessModal.value = false;
                setTimeout(() => {
                    navigateTo('/');
                }, 100);
            }, 1000);
        } else {
            errorToast(response.data.msg || 'Payment failed');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        errorToast(t('Auth.payment_error'));
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    // Initialize component and fetch package data
    console.log('Complete Payment page mounted');
    fetchAvailablePackage();
});

</script>

<style lang="scss" scoped>

.payment-field {
    padding: 20px 15px;
    background-color: #FFFFFF0F;
    border-radius: 10px;
}

.custom-payment {
    padding: 20px 15px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
}
.text-layout {
    padding: 15px 25px 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 25px;
    margin: 0 auto;
}

.payment-info {
    .payment-title {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
    }
    
    .payment-desc {
        color: #9f9f9f;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
    }
    
    .price-section {
        .country-flag {
            width: 35px;
            height: 25px;
            border-radius: 2px;
        }
        
        .country-text {
            color: #fff;
            font-size: 14px;
        }
        
        .price {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
        }
    }
}

.payment-method-section {
    margin-bottom: 35px;
    .section-title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }
    
    .payment-method-text {
        color: #fff;
        font-size: 14px;
    }
}

// Custom radio button styles (inherited from existing styles)
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