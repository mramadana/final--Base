<template>
    <div class="container container_layout">
        <div class="custom-width with-auth p-0 mt-4">
            <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />
            <div class="row">
                <div class="col-12 col-md-8 mx-auto">
                    <!-- Step Indicator -->
                    <div class="step-indicator mb-5">
                        <div class="step-header">
                            <h2 class="step-title">{{ $t('Auth.project_basic_data') }}</h2>
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
                <div v-if="currentStep === 1" class="step-content">
                    <div class="row">
                        <div class="col-12 col-md-8 mx-auto">
                        </div>
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
                                :hasIcon="true" 
                                icon="/_nuxt/assets/images/auth-img/user.svg"
                                :with_icon="true" 
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
                                :hasIcon="true" 
                                icon="/_nuxt/assets/images/auth-img/user.svg"
                                :with_icon="true" 
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
                                    :IsMultible="true" 
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
                                    :IsMultible="true" 
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
                <div v-if="currentStep === 2" class="step-content">
                    <div class="row">
                        <div class="col-12 col-md-8 mx-auto">
                        </div>
                        <div class="col-12 col-md-8 mr-auto">
                            <!-- Main Section Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="mainSection" 
                                :options="sectionOptions"
                                option-value="value"
                                placeholder="قم بتحديد القسم الرئيسي" 
                                :label="$t('Auth.main_section')"
                                :showValidation="showValidation"
                            />

                            <!-- Country Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="country" 
                                :options="countryOptions"
                                option-value="value"
                                placeholder="قم بتحديد الدولة" 
                                :label="$t('Auth.country')"
                                :showValidation="showValidation"
                            />

                            <!-- Region Dropdown -->
                            <GlobalCustomDropdown 
                                v-model="region" 
                                :options="regionOptions"
                                option-value="value"
                                placeholder="قم بتحديد المنطقة" 
                                :label="$t('Auth.region')"
                                :showValidation="showValidation"
                            />

                            <!-- Location Input -->
                            <div class="position-relative single-input-upload mb-4">
                                <div class="main_input special-input without-edit">
                                    <div class="d-flex align-items-center justify-content-start gap-2 flex-grow-1 gray">
                                        <i class="fa-solid fa-location-dot fz-20 ml-1"></i>
                                        <span>{{ $t("Auth.location") }}</span>
                                    </div>
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
                                <button type="button" @click="previousStep" class="custom-btn-outline flex-grow-1">{{ $t('Auth.previous') }}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Final Info (placeholder) -->
                <div v-if="currentStep === 3" class="step-content">
                    <h3>Step 3 Content</h3>
                    <button type="button" @click="previousStep" class="custom-btn-outline mr-2">{{ $t('Auth.previous') }}</button>
                    <button type="submit" class="custom-btn">{{ $t('Auth.complete') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

// Form fields - Step 1
const projectNameAr = ref('');
const projectNameEn = ref('');
const projectDescAr = ref('');
const projectDescEn = ref('');

// Form fields - Step 2
const mainSection = ref(null);
const country = ref(null);
const region = ref(null);
const location = ref('');
const commercialRegNumber = ref('');

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
    commercialRegNumber: commercialRegNumber.value
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

// Validation schemas
const {
    customerName,
    required
} = useValidationSchema();

const validations = {
    projectNameAr: customerName('Auth.project_name_ar'),
    projectNameEn: customerName('Auth.project_name_en'),
    projectDescAr: required('Auth.project_desc_ar'),
    projectDescEn: required('Auth.project_desc_en')
};

const validationsStep2 = {
    commercialRegNumber: required('Auth.commercial_reg_number')
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
        
        if (!isValid) {
            scrollToFirstError(formDataStep2.value, validationsStep2);
            console.log("Step 2 validation failed");
        } else {
            console.log("Step 2 validation passed");
            nextStep();
        }
    } else if (currentStep.value === 3) {
        // Final submission
        await submitCompleteInfo();
    }
};

const submitCompleteInfo = async () => {
    loading.value = true;
    try {
        // Handle final form submission - exactly like login
        const fd = new FormData();
        fd.append('project_name_ar', projectNameAr.value);
        fd.append('project_name_en', projectNameEn.value);
        fd.append('project_desc_ar', projectDescAr.value);
        fd.append('project_desc_en', projectDescEn.value);
        fd.append('images', uploadedImage.value);
        // Add files
        if (uploadedLogo.value) {
            fd.append('logo', uploadedLogo.value);
        }
        if (uploadedProfileImage.value) {
            fd.append('profile_image', uploadedProfileImage.value);
        }
        
        console.log('Submitting complete info...');
        // Add your API call here
        // const res = await axios.post('complete-info', fd);
        
        // Reset form on success - exactly like login
        // if (response(res) === "success") {
        //     successToast(res.msg);
        //     // Reset form on success
        //     projectNameAr.value = '';
        //     projectNameEn.value = '';
        //     projectDescAr.value = '';
        //     projectDescEn.value = '';
        //     logoFile.value = null;
        //     profileFile.value = null;
        //     logoPreview.value = '';
        //     profilePreview.value = '';
        //     showValidation.value = false;
        // } else {
        //     errorToast(res.msg);
        // }
        
    } catch (error) {
        console.error('Complete info error:', error);
        // errorToast(t('Auth.complete_info_failed'));
    } finally {
        loading.value = false;
    }
};

definePageMeta({
    name: "Home.complete_info",
    layout: "auth",
    showBackLink: true,
    backLinkUrl: "/Auth/activateAccount",
});
</script>

<style lang="scss" scoped>
.step-indicator {
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
        height: 6px;
        background: #3a3a3a;
        border-radius: 3px;
        overflow: hidden;
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #9f9f9f, #6c6c6c);
            border-radius: 3px;
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