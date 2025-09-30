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
                            <div class="form-group">
                                <label class="label">{{ $t('Auth.add_logo') }}</label>
                                <div class="upload-area" @click="triggerFileInput('logo')">
                                    <input 
                                        ref="logoInput"
                                        type="file" 
                                        accept="image/*"
                                        @change="handleFileUpload($event, 'logo')"
                                        style="display: none;"
                                    />
                                    <div class="upload-content">
                                        <i class="fa-solid fa-camera fz-24 mb-2"></i>
                                        <p>{{ $t('Auth.add_logo') }}</p>
                                    </div>
                                    <div v-if="logoPreview" class="image-preview">
                                        <img :src="logoPreview" alt="Logo Preview" />
                                    </div>
                                </div>
                            </div>

                            <!-- Profile Image Upload -->
                            <div class="form-group">
                                <label class="label">{{ $t('Auth.add_profile_image') }}</label>
                                <div class="upload-area" @click="triggerFileInput('profile')">
                                    <input 
                                        ref="profileInput"
                                        type="file" 
                                        accept="image/*"
                                        @change="handleFileUpload($event, 'profile')"
                                        style="display: none;"
                                    />
                                    <div class="upload-content">
                                        <i class="fa-solid fa-camera fz-24 mb-2"></i>
                                        <p>{{ $t('Auth.add_profile_image') }}</p>
                                    </div>
                                    <div v-if="profilePreview" class="image-preview">
                                        <img :src="profilePreview" alt="Profile Preview" />
                                    </div>
                                </div>
                            </div>

                            <!-- Next Button -->
                            <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                                {{ $t('Auth.next') }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Additional Info (placeholder) -->
                <div v-if="currentStep === 2" class="step-content">
                    <h3>Step 2 Content</h3>
                    <button type="button" @click="previousStep" class="custom-btn-outline mr-2">{{ $t('Auth.previous') }}</button>
                    <button type="submit" class="custom-btn">{{ $t('Auth.next') }}</button>
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

// Form fields
const projectNameAr = ref('');
const projectNameEn = ref('');
const projectDescAr = ref('');
const projectDescEn = ref('');

// Form data (reactive object for validation) - exactly like login
const formData = computed(() => ({
    projectNameAr: projectNameAr.value,
    projectNameEn: projectNameEn.value,
    projectDescAr: projectDescAr.value,
    projectDescEn: projectDescEn.value
}));

// File handling
const logoFile = ref(null);
const profileFile = ref(null);
const logoPreview = ref('');
const profilePreview = ref('');

// Step management
const currentStep = ref(1);
const loading = ref(false);
const showValidation = ref(false);

// Refs
const completeInfoForm = ref(null);
const logoInput = ref(null);
const profileInput = ref(null);

// Validation schemas (like the example)
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

// Progress calculation
const progressWidth = computed(() => {
    return (currentStep.value / 3) * 100;
});

// use the composable for the validation - exactly like login
const { isFormValid, scrollToFirstError } = useFormValidation();

// File upload functions
const triggerFileInput = (type) => {
    if (type === 'logo') {
        logoInput.value.click();
    } else if (type === 'profile') {
        profileInput.value.click();
    }
};

const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'logo') {
                logoFile.value = file;
                logoPreview.value = e.target.result;
            } else if (type === 'profile') {
                profileFile.value = file;
                profilePreview.value = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
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
        
        const isValid = isFormValid(formData.value, validations);
        console.log('Is Valid:', isValid);
        
        if (!isValid) {
            // if the inputs have errors
            scrollToFirstError(formData.value, validations);
            console.log("22222222222");
        } else {
            console.log("11111111111 - Validation Passed");
            // Move to next step
            nextStep();
        }
    } else if (currentStep.value === 2) {
        // Handle step 2 validation and move to step 3
        nextStep();
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
        
        // Add files
        if (logoFile.value) {
            fd.append('logo', logoFile.value);
        }
        if (profileFile.value) {
            fd.append('profile_image', profileFile.value);
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

.main_input {
    resize: vertical;
    min-height: 100px;
}

.error-message {
    font-size: 12px;
    color: #e74c3c;
    font-weight: 500;
    margin-top: 5px;
}

.custom-btn-outline {
    background: transparent;
    border: 1px solid #6c6c6c;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
        background: #6c6c6c;
        color: #fff;
    }
}
</style>