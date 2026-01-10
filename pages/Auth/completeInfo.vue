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

            <!-- Multi-step Forms -->
            <!-- Step 1: Project Basic Data -->
            <form @submit.prevent="handleSubmit" ref="step1Form" v-show="currentStep === 1">
                <div class="step-content">
                    <div class="row">

                        <div class="col-12 col-md-8 mr-auto">

                            <!-- Project Name Arabic -->
                            <FormInput 
                                v-model:modelValue="projectNameAr" 
                                name="project_name_ar" 
                                type="text" 
                                :label="$t('Auth.project_name_ar')"
                                :placeholder="$t('Auth.project_name_ar')" 
                                :validation-schema="validations.projectNameAr"
                                :showErrors="showValidation" 
                            />

                            <!-- Project Name English -->
                            <FormInput 
                                v-model:modelValue="projectNameEn" 
                                name="project_name_en" 
                                type="text" 
                                :label="$t('Auth.project_name_en')"
                                :placeholder="$t('Auth.project_name_en')" 
                                :validation-schema="validations.projectNameEn"
                                :showErrors="showValidation" 
                            />

                            <!-- Project Description Arabic -->
                            <FormInput 
                                v-model:modelValue="projectDescAr" 
                                name="project_description_ar" 
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
                                name="project_description_en" 
                                type="textarea" 
                                :label="$t('Auth.project_desc_en')"
                                :placeholder="$t('Auth.project_desc_en')" 
                                :validation-schema="validations.projectDescEn"
                                :showErrors="showValidation" 
                                rows="4"
                            />

                            <!-- Logo Upload -->
                            <div class="position-relative single-input-upload mb-4">
                                
                                <div class="main_input special-input">
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                        <span>{{ $t("Auth.add_logo") }}</span>
                                    </div>
                                </div>
                                <!-- if you want to remove the validation, you can set the required to false
                                and remove showValidation -->
                                <GlobalImgUploader 
                                    ref="logoUploader"
                                    acceptedFiles="image/*" 
                                    :resetTrigger="resetImageTrigger"
                                    :showValidation="showValidation"
                                    :required="true"
                                    :errorMessage="t('validation.attach_logo')"
                                    @uploaded-images-updated="updateUploadedImages" />
                            </div>

                            <!-- Profile Image Upload -->
                            <div class="position-relative single-input-upload mb-4">
                                <div class="main_input special-input">
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                        <span>{{ $t("Auth.add_profile_image") }}</span>
                                    </div>
                                </div>
                                <!-- if you want to remove the validation, you can set the required to false
                                and remove showValidation -->
                                <GlobalImgUploader 
                                    ref="profileImageUploader"
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
            </form>

                <!-- Step 2: Additional Info -->
                <form @submit.prevent="handleSubmit" ref="step2Form" v-show="currentStep === 2">
                    <div class="step-content">
                    
                    <div class="row">

                        <div class="col-12 col-md-8 mr-auto">

                            <!-- Main Section Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="mainSection" 
                                :options="sectionOptions"
                                option-value="id"
                                :placeholder="$t('Auth.select_main_section')" 
                                :label="$t('Auth.main_section')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.mainSection"
                            />
                            <input type="hidden" name="category_id" :value="mainSection || ''" />

                            <!-- Country Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="country" 
                                :options="countryOptions"
                                option-value="id"
                                :placeholder="$t('Auth.select_country')" 
                                :label="$t('Auth.country')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.country"
                            />
                            <input type="hidden" name="country" :value="country || ''" />

                            <!-- Region Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="region" 
                                :options="regionOptions"
                                option-value="id"
                                :placeholder="$t('Auth.select_region')" 
                                :label="$t('Auth.region')"
                                :showValidation="showValidation"
                                :validation-schema="validationsStep2.region"
                            />
                            <input type="hidden" name="region_id" :value="region || ''" />

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
                                <!-- Hidden input for validation and form submission -->
                                <input type="hidden" name="map_desc" :value="address" />
                                <input type="hidden" name="lat" :value="location.lat || ''" />
                                <input type="hidden" name="lng" :value="location.lng || ''" />
                                <!-- Validation error message -->
                                <div v-if="showValidation && !address" class="error-message mt-2">
                                    <p class="text-danger error-message">{{ $t('validation.select_location') }}</p>
                                </div>
                            </div>

                            <!-- Commercial Registration Number Input -->
                            <FormInput 
                                v-model:modelValue="commercialRegNumber" 
                                name="project_commercial_number" 
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
            </form>

                <!-- Step 3: Banking Info -->
                <form @submit.prevent="handleSubmit" ref="step3Form" v-show="currentStep === 3">
                    <div class="step-content">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">
                            <!-- Bank Name Input -->
                            <FormInput 
                                v-model:modelValue="bankNameField" 
                                name="bank_name" 
                                type="text" 
                                :label="$t('Auth.bank_name')"
                                :placeholder="$t('Auth.bank_name')" 
                                :validation-schema="validationsStep3.bankName"
                                :showErrors="showValidation" 
                            />

                            <!-- Account Number Input -->
                            <FormInput 
                                v-model:modelValue="accountNumberField" 
                                name="bank_account_number" 
                                type="number" 
                                :label="$t('Auth.account_number')"
                                :placeholder="$t('Auth.account_number')" 
                                :validation-schema="validationsStep3.accountNumber"
                                :showErrors="showValidation" 
                            />

                            <!-- Account Holder Name Input -->
                            <FormInput 
                                v-model:modelValue="accountHolderNameField" 
                                name="bank_account_name" 
                                type="text" 
                                :label="$t('Auth.account_holder_name')"
                                :placeholder="$t('Auth.account_holder_name')" 
                                :validation-schema="validationsStep3.accountHolderName"
                                :showErrors="showValidation" 
                            />

                            <!-- IBAN Input -->
                            <FormInput 
                                v-model:modelValue="ibanField" 
                                name="bank_iban_number" 
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
            </form>

                <div class="new-sign mt-4">
                    {{ $t('Auth.have_account') }}
                    <nuxt-link to="/Auth/login" >{{ $t('Auth.login') }}</nuxt-link>
                </div>

                <NuxtLink to="/Auth/terms"> {{ $t('Auth.terms_and_conditions') }} </NuxtLink>
            
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
    map_desc: address.value,
    commercialRegNumber: commercialRegNumber.value
}));

const formDataStep3 = computed(() => ({
    bankName: bankNameField.value,
    accountNumber: accountNumberField.value,
    accountHolderName: accountHolderNameField.value,
    iban: ibanField.value
}));

// image uploaders
const logoUploader = ref(null);
const profileImageUploader = ref(null);

// Step management
const currentStep = ref(1);
const loading = ref(false);
const showValidation = ref(false);

// Form refs
const step1Form = ref(null);
const step2Form = ref(null);
const step3Form = ref(null);

// Image refs
const uploadedImage = ref([]);
const uploadedProfileImage = ref([]);
const resetImageTrigger = ref(0);

// config
const config = computed(() => {
    return { headers: { Authorization: `Bearer ${token.value}` } }
});
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
const sectionOptions = ref([]);

const countryOptions = ref([]);

// Fetch categories and countries on mount
onMounted(async () => {
    const categoriesRes = await axios.get('provider/available-categories', config.value);
    sectionOptions.value = categoriesRes.data.data || [];
    
    const countriesRes = await axios.get('get-countries', config.value);
    countryOptions.value = countriesRes.data.data || [];
});

const regionOptions = ref([]);

watch(country, async (countryId) => {
    if (countryId) {
        const res = await axios.get(`get-regions?country_id=${countryId}`, config.value);
        regionOptions.value = res.data.data || [];
    }
});

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
        location.value.lat = 31.015635713337954;
        location.value.lng = 31.56269999573431;
        visible.value = false;
        locationLoading.value = false;
    }, 100);
};

// API submission for Step 1
const submitStep1 = async () => {
    loading.value = true;
    try {
        // Create FormData from form reference (this will include all fields with name attribute)
        const fd = new FormData(step1Form.value);
        
        // Append images (they don't have name attributes in the form)
        if (uploadedImage.value) {
            fd.append('project_logo', uploadedImage.value);
        }
        if (uploadedProfileImage.value) {
            fd.append('project_cover', uploadedProfileImage.value);
        }
        
        console.log('Submitting Step 1...');
        
        const res = await axios.post('provider/auth/complete-account-first-step', fd , config.value);
        
        console.log('Step 1 Response:', res);
        
        if (res.data && res.data.key == "success") {
            successToast(res.data.msg || 'تم حفظ بيانات المرحلة الأولى بنجاح');
            nextStep();
        } else {
            console.log(res.data.msg, "res.data res.data res.data");
            errorToast(res.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الأولى');
        }
        
    } catch (error) {
        console.error('Step 1 error:', error);
        errorToast(error.response?.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الأولى');
    } finally {
        loading.value = false;
    }
};

// API submission for Step 2
const submitStep2 = async () => {
    loading.value = true;
    try {
        // Create FormData from form reference (this will include all fields with name attribute)
        const fd = new FormData(step2Form.value);
        // fd.append('category_id', mainSection.value);
        // fd.append('region_id', region.value);
        // fd.append('map_desc', address.value);
        // fd.append('commercial_reg_number', commercialRegNumber.value);
        console.log('Submitting Step 2...');
        console.log(region.value, "fd fd fd fd");
        const res = await axios.post('provider/auth/complete-account-second-step', fd, config.value);
        
        console.log('Step 2 Response:', res);
        
        if (res.data && res.data.key == "success") {
            successToast(res.data.msg || 'تم حفظ بيانات المرحلة الثانية بنجاح');
            nextStep();
        } else {
            errorToast(res.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الثانية');
        }
        
    } catch (error) {
        console.error('Step 2 error:', error);
        errorToast(error.response?.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الثانية');
    } finally {
        loading.value = false;
    }
};

// API submission for Step 3
const submitStep3 = async () => {
    loading.value = true;
    try {
        // Create FormData from form reference (this will include all fields with name attribute)
        const fd = new FormData(step3Form.value);
        
        // All fields (bankName, accountNumber, accountHolderName, iban) 
        // are already included via FormInput name attributes
        
        console.log('Submitting Step 3...');
        
        const res = await axios.post('provider/auth/complete-account', fd, config.value);
        
        console.log('Step 3 Response:', res);
        
        if (res.data && res.data.key == "success") {
            successToast(res.data.msg || 'تم إكمال التسجيل بنجاح');
            // Reset form on success
            // Navigate to home or login page
            setTimeout(() => {
                navigateTo('/Auth/terms');
            }, 500);
        } else {
            errorToast(res.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الثالثة');
        }
        
    } catch (error) {
        console.error('Step 3 error:', error);
        errorToast(error.response?.data?.msg || 'حدث خطأ أثناء حفظ بيانات المرحلة الثالثة');
    } finally {
        loading.value = false;
    }
};

// Form submission - exactly like login
const handleSubmit = async () => {
    if (currentStep.value === 1) {
        showValidation.value = true;
        const logoValid = logoUploader.value?.validate() || false;
        const profileImageValid = profileImageUploader.value?.validate() || false;
        const imagesValid = logoValid && profileImageValid;
        const isValid = isFormValid(formData.value, validations);
        console.log('Is Valid:', isValid);
        
        if (!isValid || !imagesValid) {
            // if the inputs have errors
            scrollToFirstError(formData.value, validations);
            console.log("22222222222");
        } else {
            console.log("11111111111 - Validation Passed");
            // Submit Step 1 API
            await submitStep1();
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
            // Submit Step 2 API
            await submitStep2();
        }
    } else if (currentStep.value === 3) {
        showValidation.value = true;
        const isValid = isFormValid(formDataStep3.value, validationsStep3);
        
        if (!isValid) {
            scrollToFirstError(formDataStep3.value, validationsStep3);
            console.log("Step 3 validation failed");
        } else {
            console.log("Step 3 validation passed");
            // Submit Step 3 API
            await submitStep3();
        }
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

    .single-input-upload {
        :deep(input) {
            width: 100%;
            height: 45px;
        }
    }
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