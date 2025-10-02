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
                            <img src="@/assets/images/ksa-img.svg" alt="Saudi Flag" class="country-flag" />
                            <span class="country-text">{{ $t("Auth.subscription_value_country") }}</span>
                        </div>
                        <div class="price-value">
                            <span class="price">{{ subscriptionPrice }} {{ $t("Auth.sar") }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Method Section -->
            <div class="payment-method-section mb-4 custom-payment">

                <h4 class="section-title mb-4">{{ $t("Auth.payment_method") }}</h4>

                <div class="d-flex align-items-center justify-content-between">

                    <div class="check-text hint d-flex">
                        <div class="payment-method-text">
                            {{ $t("Auth.electronic_payment") }}
                        </div>
                    </div> 

                    <!-- Electronic Payment Option -->
                    <div class="radios form-group check-inner ml-1">
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
            <button class="custom-btn w-100" @click="handleCompletePayment" :disabled="!selectedPaymentMethod || loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ $t("Auth.complete_payment_process") }}
            </button>
        </div>

        <!-- Payment Popup Modal -->
        <Dialog v-model:visible="showPaymentPopup" modal class="payment-popup-dialog" :draggable="false">
            <div class="payment-popup-content">
                <!-- Header -->
                <div class="popup-header text-center mb-4">
                    <img src="@/assets/images/Logo.svg" alt="logo" class="popup-logo mb-3" />
                    <h2 class="popup-title">{{ $t("Auth.payment_approval_request") }}</h2>
                </div>

                <!-- Payment Details Card -->
                <div class="payment-card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">{{ $t("Auth.annual_subscription_payment") }}</h3>
                        <p class="card-subtitle">{{ $t("Auth.payment_card_subtitle") }}</p>
                    </div>
                    
                    <div class="card-content">
                        <!-- Country and Price -->
                        <div class="price-row d-flex align-items-center justify-content-between">
                            <div class="country-section d-flex align-items-center gap-2">
                                <img src="@/assets/images/ksa-img.svg" alt="Saudi Flag" class="flag-small" />
                                <span class="country-label">{{ $t("Auth.subscription_value_country") }}</span>
                            </div>
                            <div class="price-section custom-payment">
                                <span class="price-amount">{{ subscriptionPrice }} {{ $t("Auth.sar") }}</span>
                            </div>
                        </div>

                        <!-- Payment Method -->
                        <div class="method-row mt-3">
                            <div class="method-label">{{ $t("Auth.payment_method") }}</div>
                            <div class="method-value d-flex align-items-center gap-2">
                                <i class="fas fa-credit-card"></i>
                                <span>{{ $t("Auth.electronic_payment") }}</span>
                                <i class="fas fa-check-circle text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="popup-actions">
                    <button class="complete-payment-btn w-100 mb-3" @click="processPayment" :disabled="paymentProcessing">
                        <span v-if="paymentProcessing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {{ $t("Auth.complete_payment_process") }}
                    </button>
                    
                    <div class="activation-note text-center">
                        <small class="text-muted">{{ $t("Auth.activation_note") }}</small>
                        <div class="settings-link mt-1">
                            <small>{{ $t("Auth.go_to_settings") }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- Success Modal -->
        <Dialog v-model:visible="showSuccessModal" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.payment_success") }}
                </h1>
                <p class="desc lg">{{ $t("Auth.payment_success_message") }}</p>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

definePageMeta({
    name: "Auth.complete_payment",
    layout: "auth",
    showBackLink: true,
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

// Reactive data
const selectedPaymentMethod = ref('');
const showPaymentPopup = ref(false);
const showSuccessModal = ref(false);
const loading = ref(false);
const paymentProcessing = ref(false);
const subscriptionPrice = ref('200');

const { response } = responseApi();
const axios = useApi();
const { successToast, errorToast } = toastMsg();

// Handle complete payment button click
const handleCompletePayment = () => {
    if (selectedPaymentMethod.value) {
        // Show popup when payment button is clicked
        showPaymentPopup.value = true;
    }
};

// Process the actual payment
const processPayment = async () => {
    paymentProcessing.value = true;
    
    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would make the actual API call
        // const response = await axios.post('process-payment', paymentData);
        
        // Close payment popup
        showPaymentPopup.value = false;
        
        // Show success modal
        showSuccessModal.value = true;
        
        successToast(t('Auth.payment_completed_successfully'));
        
        // Redirect after success
        setTimeout(() => {
            navigateTo('/dashboard');
        }, 3000);
        
    } catch (error) {
        console.error('Payment error:', error);
        errorToast(t('Auth.payment_error'));
    } finally {
        paymentProcessing.value = false;
    }
};

onMounted(() => {
    // Initialize component
    console.log('Complete Payment page mounted');
});

</script>

<style lang="scss" scoped>

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
            width: 24px;
            height: 18px;
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

// Payment Popup Styles
.payment-popup-dialog {
    :deep(.p-dialog) {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        direction: rtl;
    }
    
    :deep(.p-dialog-content) {
        padding: 30px;
        background: transparent;
        direction: rtl;
        text-align: right;
    }
}

.payment-popup-content {
    .popup-header {
        text-align: center !important;
        
        .popup-logo {
            height: 40px;
        }
        
        .popup-title {
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            line-height: 1.4;
        }
    }
    
    .payment-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        
        .card-header {
            .card-title {
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 5px 0;
            }
            
            .card-subtitle {
                color: #9f9f9f;
                font-size: 12px;
                margin: 0 0 15px 0;
            }
        }
        
        .card-content {
            .price-row {
                .country-section {
                    .flag-small {
                        width: 20px;
                        height: 15px;
                        border-radius: 2px;
                    }
                    
                    .country-label {
                        color: #fff;
                        font-size: 14px;
                    }
                }
                
                .price-amount {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
            
            .method-row {
                .method-label {
                    color: #9f9f9f;
                    font-size: 12px;
                    margin-bottom: 5px;
                }
                
                .method-value {
                    color: #fff;
                    font-size: 14px;
                    
                    i {
                        color: #9f9f9f;
                        
                        &.text-success {
                            color: #28a745 !important;
                        }
                    }
                }
            }
        }
    }
    
    .popup-actions {
        .complete-payment-btn {
            background: #fff;
            color: #000;
            border: none;
            border-radius: 10px;
            padding: 12px 20px;
            font-weight: 600;
            transition: all 0.3s ease;
            
            &:hover:not(:disabled) {
                background: #f0f0f0;
            }
            
            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        }
        
        .activation-note {
            .text-muted {
                color: #6c6c6c !important;
                font-size: 12px;
            }
            
            .settings-link {
                small {
                    color: #9f9f9f;
                    font-size: 11px;
                }
            }
        }
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
        background: #fff;
        
        .icon {
            display: block;
        }
    }
}
</style>