<template>
    <div>

        <!-- Edit Provider form -->
        <form @submit.prevent="updateProvider" ref="editProviderForm">
            <div class="row">
                <div class="col-12 col-md-8">

                    <!-- Project Name Arabic -->
                    <FormInput v-model:modelValue="projectNameAr" name="projectNameAr" type="text"
                        :label="$t('Auth.project_name_ar')" :placeholder="$t('Auth.project_name_ar')"
                        :validation-schema="validations.projectNameAr" :showErrors="showValidation" />

                    <!-- Project Name English -->
                    <FormInput v-model:modelValue="projectNameEn" name="projectNameEn" type="text"
                        :label="$t('Auth.project_name_en')" :placeholder="$t('Auth.project_name_en')"
                        :validation-schema="validations.projectNameEn" :showErrors="showValidation" />

                    <!-- Project Description Arabic -->
                    <FormInput v-model:modelValue="projectDescAr" name="projectDescAr" type="textarea"
                        :label="$t('Auth.project_desc_ar')" :placeholder="$t('Auth.project_desc_ar')"
                        :validation-schema="validations.projectDescAr" :showErrors="showValidation" rows="4" />

                    <!-- Project Description English -->
                    <FormInput v-model:modelValue="projectDescEn" name="projectDescEn" type="textarea"
                        :label="$t('Auth.project_desc_en')" :placeholder="$t('Auth.project_desc_en')"
                        :validation-schema="validations.projectDescEn" :showErrors="showValidation" rows="4" />

                    <!-- Logo Upload -->
                    <div class="position-relative single-input-upload mb-4">
                        <div class="main_input special-input without-edit">
                            <div class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                <span>{{ $t("Auth.add_logo") }}</span>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader ref="imageUploader" acceptedFiles="image/*" :resetTrigger="resetImageTrigger"
                            :showValidation="showValidation" :required="true"
                            :errorMessage="t('validation.attach_logo')"
                            @uploaded-images-updated="updateUploadedImages" />
                    </div>

                    <!-- Profile Image Upload -->
                    <div class="position-relative single-input-upload mb-4">
                        <div class="main_input special-input without-edit">
                            <div class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                <span>{{ $t("Auth.add_profile_image") }}</span>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader ref="profileImageUploader" acceptedFiles="image/*"
                            :resetTrigger="resetImageTrigger" :showValidation="showValidation" :required="true"
                            :errorMessage="t('validation.attach_profile_image')"
                            @uploaded-images-updated="updateUploadedProfileImage" />
                    </div>

                    <!-- Update Button -->
                    <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                        {{ $t('settings.update') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                            aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </form>

    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

definePageMeta({
    name: "settings.provider_info",
    middleware: 'auth'
});

const { t } = useI18n({ useScope: "global" });

// Store
const store = useAuthStore();
const { token, user } = storeToRefs(store);

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form refs
const editProviderForm = ref(null);
const imageUploader = ref(null);
const profileImageUploader = ref(null);

// Form fields
const projectNameAr = ref("");
const projectNameEn = ref("");
const projectDescAr = ref("");
const projectDescEn = ref("");

// Form state
const loading = ref(false);
const showValidation = ref(false);
const resetImageTrigger = ref(0);

// Images
const uploadedImage = ref([]);
const uploadedProfileImage = ref([]);

// Validation schemas
const {
    customerName,
    projectDescription_ar,
    projectDescription_en
} = useValidationSchema();

const validations = {
    projectNameAr: customerName('Auth.project_name_ar'),
    projectNameEn: customerName('Auth.project_name_en'),
    projectDescAr: projectDescription_ar('Auth.project_desc_ar'),
    projectDescEn: projectDescription_en('Auth.project_desc_en')
};

// Form data (reactive object for validation)
const formData = computed(() => ({
    projectNameAr: projectNameAr.value,
    projectNameEn: projectNameEn.value,
    projectDescAr: projectDescAr.value,
    projectDescEn: projectDescEn.value
}));

// Use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// Image upload functions
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

const updateUploadedProfileImage = (images) => {
    uploadedProfileImage.value = images;
};

// Load current provider data
const loadProviderData = async () => {
    try {
        loading.value = true;
        const res = await axios.get('provider/profile', config);

        if (response(res) === "success") {
            const providerData = res.data.data;

            // Fill form with current data
            projectNameAr.value = providerData.project_name_ar || "";
            projectNameEn.value = providerData.project_name_en || "";
            projectDescAr.value = providerData.project_desc_ar || "";
            projectDescEn.value = providerData.project_desc_en || "";
        }
    } catch (error) {
        console.error('Error loading provider data:', error);
        errorToast(t('settings.error_loading_data'));
    } finally {
        loading.value = false;
    }
};

// Update provider function
const updateProvider = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);
    const imagesValid = imageUploader.value?.validate() || false;

    if (!isValid || !imagesValid) {
        // if the inputs have errors
        scrollToFirstError(formData.value, validations);
        console.log("22222222222");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData();
            fd.append('project_name_ar', projectNameAr.value);
            fd.append('project_name_en', projectNameEn.value);
            fd.append('project_desc_ar', projectDescAr.value);
            fd.append('project_desc_en', projectDescEn.value);

            // Add logo if uploaded
            if (uploadedImage.value.length > 0) {
                fd.append('logo', uploadedImage.value[0]);
            }

            // Add profile image if uploaded
            if (uploadedProfileImage.value.length > 0) {
                fd.append('profile_image', uploadedProfileImage.value[0]);
            }

            const res = await axios.post('provider/update-profile', fd, config);

            if (response(res) === "success") {
                successToast(res.data.msg);
                // Reset validation
                showValidation.value = false;
            } else {
                errorToast(res.data.msg);
            }
        } catch (error) {
            console.error('Update error:', error);
            errorToast(t('settings.update_failed'));
        } finally {
            loading.value = false;
        }
    }
};

// Load data on mount
onMounted(() => {
    loadProviderData();
});
</script>