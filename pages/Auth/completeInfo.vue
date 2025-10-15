<template>
    <div class="container container_layout">

        <div class="custom-width with-auth p-0 mt-4">
            <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />
            <div class="row">
                <div class="col-12 col-md-8 mx-auto">
                    <!-- Step Indicator -->
                    <div class="step-indicator mb-5">
                        <div class="step-header">
                            <h2 class="step-title">{{ currentStep === 1 ? $t('Auth.project_data') : currentStep === 2 ? $t('Auth.project_data') : $t('Auth.bank_data') }}</h2>
                            <span class="step-counter">{{ currentStep }}/3</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Multi-step Form -->
            <form @submit.prevent="handleSubmit" ref="completeInfoForm">
                <!-- Step 1: Project Basic Data -->
                <div v-show="currentStep === 1" class="step-content">
                    <div class="row">

                        <div class="col-12 col-md-8 mr-auto">

                            <!-- Project Name Arabic -->
                            <FormInput 
                                v-model:modelValue="projectNameAr" 
                                name="projectNameAr" 
                                type="text" 
                                :label="$t('Auth.project_name_ar')"
                                :placeholder="$t('Auth.project_name_ar')" 
                                :validation-schema="validations.projectNameAr"
                                :showErrors="showValidation" 
                            />

                            <!-- Project Name English -->
                            <FormInput 
                                v-model:modelValue="projectNameEn" 
                                name="projectNameEn" 
                                type="text" 
                                :label="$t('Auth.project_name_en')"
                                :placeholder="$t('Auth.project_name_en')" 
                                :validation-schema="validations.projectNameEn"
                                :showErrors="showValidation" 
                            />

                            <!-- Project Description Arabic -->
                            <FormInput 
                                v-model:modelValue="projectDescAr" 
                                name="projectDescAr" 
                                type="textarea" 
                                :label="$t('Auth.project_desc_ar')"
                                :placeholder="$t('Auth.project_desc_ar')" 
                                :validation-schema="validations.projectDescAr"
                                :showErrors="showValidation" 
                                rows="4"
                            />

                            <!-- Project Description English -->
                            <FormInput 
                                v-model:modelValue="projectDescEn" 
                                name="projectDescEn" 
                                type="textarea" 
                                :label="$t('Auth.project_desc_en')"
                                :placeholder="$t('Auth.project_desc_en')" 
                                :validation-schema="validations.projectDescEn"
                                :showErrors="showValidation" 
                                rows="4"
                            />

                            <!-- Logo Upload -->
                            <div class="position-relative single-input-upload mb-4">
                                
                                <div class="main_input special-input without-edit">
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                        <span>{{ $t("Auth.add_logo") }}</span>
                                    </div>
                                </div>
                                <!-- if you want to remove the validation, you can set the required to false
                                and remove showValidation -->
                                <GlobalImgUploader 
                                    ref="imageUploader"
                                    acceptedFiles="image/*" 
                                    :resetTrigger="resetImageTrigger"
                                    :showValidation="showValidation"
                                    :required="true"
                                    :errorMessage="t('validation.attach_logo')"
                                    @uploaded-images-updated="updateUploadedImages" />
                            </div>

                            <!-- Profile Image Upload -->
                            <div class="position-relative single-input-upload mb-4">
                                <div class="main_input special-input without-edit">
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                        <span>{{ $t("Auth.add_profile_image") }}</span>
                                    </div>
                                </div>
                                <!-- if you want to remove the validation, you can set the required to false
                                and remove showValidation -->
                                <GlobalImgUploader 
                                    ref="imageUploader"
                                    acceptedFiles="image/*" 
                                    :resetTrigger="resetImageTrigger"
                                    :showValidation="showValidation"
                                    :required="true"
                                    :errorMessage="t('validation.attach_profile_image')"
                                    @uploaded-images-updated="updateUploadedProfileImage" />
                            </div>

                            <!-- Next Button -->
                            <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                                {{ $t('Auth.next') }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Additional Info -->
                <div v-show="currentStep === 2" class="step-content">
                    
                    <div class="row">

                        <div class="col-12 col-md-8 mr-auto">

                            <!-- Main Section Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="mainSection" 
                                :options="sectionOptions"
                                option-value="value"
                                :placeholder="$t('Auth.select_main_section')" 
                                :label="$t('Auth.main_section')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.mainSection"
                            />

                            <!-- Country Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="country" 
                                :options="countryOptions"
                                option-value="value"
                                :placeholder="$t('Auth.select_country')" 
                                :label="$t('Auth.country')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.country"
                            />

                            <!-- Region Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="region" 
                                :options="regionOptions"
                                option-value="value"
                                :placeholder="$t('Auth.select_region')" 
                                :label="$t('Auth.region')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.region"
                            />

                            <!-- Location Input -->
                            <div class="position-relative single-input-upload mb-4">
                                <label class="label">{{ $t("Auth.location") }}</label>
                                <div class="main_input special-input without-edit pointer" :class="{'handle-border-error': showValidation && !address}" @click="visible = true">
                                    <div class="d-flex align-items-center justify-content-start gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-location-dot fz-20 ml-1"></i>
                                        <span v-if="!address">{{ $t("Auth.location") }}</span>
                                        <span v-else class="text-white">{{ address }}</span>
                                    </div>
                                </div>
                                <!-- Hidden input for validation -->
                                <input type="hidden" v-model="address" />
                                <!-- Validation error message -->
                                <div v-if="showValidation && !address" class="error-message mt-2">
                                    <span class="text-danger error-message">{{ $t('validation.select_location') }}</span>
                                </div>
                            </div>

                            <!-- Commercial Registration Number Input -->
                            <FormInput 
                                v-model:modelValue="commercialRegNumber" 
                                name="commercialRegNumber" 
                                type="text" 
                                :label="$t('Auth.commercial_reg_number')"
                                :placeholder="$t('Auth.commercial_reg_number')" 
                                :validation-schema="validationsStep2.commercialRegNumber"
                                :showErrors="showValidation" 
                            />

                            <!-- Navigation Buttons -->
                            <div class="d-flex gap-3 mt-4">
                                <button type="submit" class="custom-btn flex-grow-1" :disabled="loading">
                                    {{ $t('Auth.next') }}
                                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Step 3: Banking Info -->

                <div v-show="currentStep === 3" class="step-content">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">
                            <!-- Bank Name Input -->
                            <FormInput 
                                v-model:modelValue="bankNameField" 
                                name="bankName" 
                                type="text" 
                                :label="$t('Auth.bank_name')"
                                :placeholder="$t('Auth.bank_name')" 
                                :validation-schema="validationsStep3.bankName"
                                :showErrors="showValidation" 
                            />

                            <!-- Account Number Input -->
                            <FormInput 
                                v-model:modelValue="accountNumberField" 
                                name="accountNumber" 
                                type="text" 
                                :label="$t('Auth.account_number')"
                                :placeholder="$t('Auth.account_number')" 
                                :validation-schema="validationsStep3.accountNumber"
                                :showErrors="showValidation" 
                            />

                            <!-- Account Holder Name Input -->
                            <FormInput 
                                v-model:modelValue="accountHolderNameField" 
                                name="accountHolderName" 
                                type="text" 
                                :label="$t('Auth.account_holder_name')"
                                :placeholder="$t('Auth.account_holder_name')" 
                                :validation-schema="validationsStep3.accountHolderName"
                                :showErrors="showValidation" 
                            />

                            <!-- IBAN Input -->
                            <FormInput 
                                v-model:modelValue="ibanField" 
                                name="iban" 
                                type="text" 
                                :label="$t('Auth.iban')"
                                :placeholder="$t('Auth.iban')" 
                                :validation-schema="validationsStep3.iban"
                                :showErrors="showValidation" 
                            />

                            <!-- Navigation Buttons -->
                            <div class="d-flex gap-3 mt-4">
                                <button type="submit" class="custom-btn flex-grow-1" :disabled="loading">
                                    {{ $t('Auth.create_acc') }}
                                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="new-sign mt-4">
                    {{ $t('Auth.have_account') }}
                    <nuxt-link to="/Auth/login" >{{ $t('Auth.login') }}</nuxt-link>
                </div>

                <NuxtLink to="/Auth/terms"> {{ $t('Auth.terms_and_conditions') }} </NuxtLink>
            </form>
            
        </div>

        <!-- global google map component -->
        <GlobalGoogleMap v-model:visible="visible" @closeModal="updateAddress" @handleClose="handleClose"
            :show_inputs="show_inputs" :lat="location.lat" :lng="location.lng" :current_location="currentLocation"
            :isDraggable="true" :closeModal_btn="closeModal_btn" :current_location_button="true"
            :title="$t('Global.confirm_location')" :confirm_loading="locationLoading" />

    </div>
</template>

<script setup>

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

definePageMeta({
    name: "Auth.complete_info",
    layout: "auth",
    showBackLink: true,
    customBackHandler: true, // This tells the layout to use custom handler
});

// refs
const { lat, lng, selectedAddress, token, user, device_id } = storeToRefs(
    useAuthStore()
);

// Local address ref for validation
const address = ref('');

const location = ref({
    lat: null,
    lng: null,
});

const { successToast, errorToast } = toastMsg();

const show_inputs = ref(false);
const visible = ref(false);
const locationLoading = ref(false);
const current_location_button = ref(true);
const closeModal_btn = ref(true);

watch([lat, lng], ([newLat, newLng]) => {
    location.value = { lat: newLat, lng: newLng };
});

// Form fields - Step 1
const projectNameAr = ref('');
const projectNameEn = ref('');
const projectDescAr = ref('');
const projectDescEn = ref('');

// Form fields - Step 2
const mainSection = ref(null);
const country = ref(null);
const region = ref(null);
const commercialRegNumber = ref('');

// Form fields - Step 3
const bankNameField = ref('');
const accountNumberField = ref('');
const accountHolderNameField = ref('');
const ibanField = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    projectNameAr: projectNameAr.value,
    projectNameEn: projectNameEn.value,
    projectDescAr: projectDescAr.value,
    projectDescEn: projectDescEn.value
}));

const formDataStep2 = computed(() => ({
    mainSection: mainSection.value,
    country: country.value,
    region: region.value,
    address: address.value,
    commercialRegNumber: commercialRegNumber.value
}));

const formDataStep3 = computed(() => ({
    bankName: bankNameField.value,
    accountNumber: accountNumberField.value,
    accountHolderName: accountHolderNameField.value,
    iban: ibanField.value
}));

// image uploader
const imageUploader = ref(null);

// Step management
const currentStep = ref(1);
const loading = ref(false);
const showValidation = ref(false);

// Refs
const completeInfoForm = ref(null);
const uploadedImage = ref([]);
const uploadedProfileImage = ref([]);
const resetImageTrigger = ref(0);
// Axios
const axios = useApi();
// Validation schemas
const {
    customerName,
    projectDescription_ar,
    projectDescription_en,
    required,
    commerciaRumber,
    bankName,
    accountNumber,
    accountHolderName,
    iban
    
} = useValidationSchema();

const validations = {
    projectNameAr: customerName('Auth.project_name_ar'),
    projectNameEn: customerName('Auth.project_name_en'),
    projectDescAr: projectDescription_ar('Auth.project_desc_ar'),
    projectDescEn: projectDescription_en('Auth.project_desc_en')
};

const validationsStep2 = {
    mainSection: required('Auth.main_section'),
    country: required('Auth.country'),
    region: required('Auth.region'),
    // commercialRegNumber: required('Auth.commercial_reg_number')
    commercialRegNumber: commerciaRumber()
};

const validationsStep3 = {
    bankName: bankName('Auth.bank_name'),
    accountNumber: accountNumber('Auth.account_number'),
    accountHolderName: accountHolderName('Auth.account_holder_name'),
    iban: iban('Auth.iban')
};

// Dropdown options
const sectionOptions = ref([
    { name: 'مستلزمات الأطفال', value: 'baby_supplies' },
    { name: 'الأعشاب', value: 'herbs' },
    { name: 'الطبخ', value: 'cuisine' }
]);

const countryOptions = ref([
    { name: 'السعودية', value: 'saudi' },
    { name: 'الإمارات', value: 'uae' },
    { name: 'مصر', value: 'egypt' }
]);

const regionOptions = ref([
    { name: 'الرياض', value: 'riyadh' },
    { name: 'جدة', value: 'jeddah' },
    { name: 'الدمام', value: 'dammam' }
]);

// Progress calculation
const progressWidth = computed(() => {
    return (currentStep.value / 3) * 100;
});

// use the composable for the validation - exactly like login
const { isFormValid, scrollToFirstError } = useFormValidation();


// simple function to update the images
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// simple function to update the profile image
const updateUploadedProfileImage = (images) => {
    uploadedProfileImage.value = images;
};

// Step navigation
const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++;
        showValidation.value = false;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        showValidation.value = false;
    }
};

const handleClose = () => {
    visible.value = false;
};

const updateAddress = async () => {
    locationLoading.value = true;
    const fd = new FormData();
    // fd.append("lat", location.value.lat);
    // fd.append("lng", location.value.lng);
    // fd.append("map_desc", location.value.address);
    fd.append("lat", 31.015635713337954);
    fd.append("lng", 31.56269999573431);
    fd.append("map_desc", "المنصورة، محافظة الدقهلية");

    // const { data, error } = await submitApiForm(
    //     "location",
    //     fd,
    //     "POST",
    //     // config.value
    // );

    // locationLoading.value = false;

    // if (error) {
    //     console.error("Error updating location:", error);
    //     errorToast(error.message || "حدث خطأ");
    //     return;
    // }

    // if (data.key === "success") {
    //     successToast(data.msg);
    //     visible.value = false;
    //     user.value.location = data.data;
    //     // Update the address field with the selected location
    //     address = data.data.address || "المنصورة، محافظة الدقهلية";
    //     setTimeout(() => navigateTo("/"), 100);
    // } else {
    //     errorToast(data.msg);
    // }

    setTimeout(() => {
        address.value = "المنصورة، محافظة الدقهلية";
        visible.value = false;
        locationLoading.value = false;
    }, 100);
};

// Form submission - exactly like login
const handleSubmit = async () => {
    if (currentStep.value === 1) {
        showValidation.value = true;
        const imagesValid = imageUploader.value?.validate() || false;
        const isValid = isFormValid(formData.value, validations);
        console.log('Is Valid:', isValid);
        
        if (!isValid || !imagesValid) {
            // if the inputs have errors
            scrollToFirstError(formData.value, validations);
            console.log("22222222222");
        } else {
            console.log("11111111111 - Validation Passed");
            // Move to next step
            nextStep();
        }
    } else if (currentStep.value === 2) {
        showValidation.value = true;
        const isValid = isFormValid(formDataStep2.value, validationsStep2);
        const isAddressValid = address.value && address.value.trim() !== '';
        
        if (!isValid || !isAddressValid) {
            scrollToFirstError(formDataStep2.value, validationsStep2);
            console.log("Step 2 validation failed");
        } else {
            console.log("Step 2 validation passed");
            nextStep();
        }
    } else if (currentStep.value === 3) {
        showValidation.value = true;
        const isValid = isFormValid(formDataStep3.value, validationsStep3);
        
        if (!isValid) {
            scrollToFirstError(formDataStep3.value, validationsStep3);
            console.log("Step 3 validation failed");
        } else {
            console.log("Step 3 validation passed");
            // Final submission
            await submitCompleteInfo();
        }
    }
};

const submitCompleteInfo = async () => {
    loading.value = true;
    try {
        // Create FormData from the form reference
        const fd = new FormData(completeInfoForm.value);
        
        // Only append elements that don't have name attribute
        
        // Step 1 Files - Logo and Profile Images (from image uploaders)
        fd.append('logo', uploadedImage.value);
        fd.append('profile_image', uploadedProfileImage.value);
        
        // Step 2 Data - Dropdowns (don't have name attribute)
        fd.append('main_section', mainSection.value || '');
        fd.append('country', country.value || '');
        fd.append('region', region.value || '');
        fd.append('address', address.value || '');
        
        console.log('Submitting complete info...', completeInfoForm.value);
        console.log('FormData contents:', Object.fromEntries(fd));
        
        const res = await axios.post('complete-info', fd);
        
        console.log('Response:', res);
        
        // Handle success response
        if (res.data && res.data.success) {
            successToast(res.data.message || 'تم إرسال البيانات بنجاح');
            // Reset form on success
            resetForm();
        } else {
            errorToast(res.data?.message || 'حدث خطأ أثناء إرسال البيانات');
        }
        
    } catch (error) {
        console.error('Complete info error:', error);
        errorToast(error.response?.data?.message || 'حدث خطأ أثناء إرسال البيانات');
    } finally {
        loading.value = false;
    }
};

// Reset form function
const resetForm = () => {
    // Step 1
    projectNameAr.value = '';
    projectNameEn.value = '';
    projectDescAr.value = '';
    projectDescEn.value = '';
    uploadedImage.value = [];
    uploadedProfileImage.value = [];
    
    // Step 2
    mainSection.value = null;
    country.value = null;
    region.value = null;
    address.value = '';
    commercialRegNumber.value = '';
    
    // Step 3
    bankNameField.value = '';
    accountNumberField.value = '';
    accountHolderNameField.value = '';
    ibanField.value = '';
    
    // Reset validation
    showValidation.value = false;
    currentStep.value = 1;
    
    // Reset image uploader
    resetImageTrigger.value++;
};

// Custom back button handler
const handleBackButton = () => {
    if (currentStep.value === 1) {
        // If in first step, go to previous page
        navigateTo("/Auth/activateAccount");
    } else {
        // If in other steps, go to previous step
        previousStep();
    }
};

// Use onMounted to set up the custom back handler
onMounted(() => {
    // Listen for custom back button clicks from layout
    window.addEventListener('customBackClick', handleBackButton);
});

onUnmounted(() => {
    window.removeEventListener('customBackClick', handleBackButton);
});

</script>

<style lang="scss" scoped>
.handle-border-error {
    border-color: #e74c3c !important;
}

.step-indicator {
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    .step-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .step-title {
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .step-counter {
            background: #3a3a3a;
            color: #fff;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
    }
    
    .progress-bar {
        width: 100%;
        height: 12px;
        background: rgba(224, 224, 224, 0.70);
        border-radius: 10px;
        overflow: hidden;
        
        .progress-fill {
            height: 100%;
            background: #191919;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
    }
}

.upload-area {
    border: 2px dashed #6c6c6c;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #262626;
    
    &:hover {
        border-color: #9f9f9f;
        background: #2a2a2a;
    }
    
    .upload-content {
        color: #9f9f9f;
        
        i {
            color: #6c6c6c;
            margin-bottom: 10px;
        }
        
        p {
            margin: 0;
            font-size: 14px;
        }
    }
    
    .image-preview {
        margin-top: 15px;
        
        img {
            max-width: 100px;
            max-height: 100px;
            border-radius: 8px;
            object-fit: cover;
        }
    }
}

</style>