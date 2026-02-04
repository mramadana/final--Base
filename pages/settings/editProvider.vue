<template>
    <div>
        <!-- Edit Provider form -->
        <form @submit.prevent="updateProvider" ref="editProviderForm">
            <div class="row">
                <div class="col-12 col-md-8">
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

                    <!-- Project Commercial Number -->
                    <FormInput
                        v-model:modelValue="projectCommercialNumber"
                        name="projectCommercialNumber"
                        type="text"
                        :label="$t('Auth.commerciaRumber')"
                        :placeholder="$t('Auth.commerciaRumber')"
                        :validation-schema="validations.projectCommercialNumber"
                        :showErrors="showValidation"
                    />

                    <!-- Reservation Duration -->
                    <FormInput
                        v-model:modelValue="reservationDuration"
                        name="reservationDuration"
                        type="number"
                        :label="$t('Auth.reservation_duration')"
                        :placeholder="$t('Auth.reservation_duration')"
                        :validation-schema="validations.reservationDuration"
                        :showErrors="showValidation"
                    />

                    <!-- Logo Upload -->
                    <div class="position-relative single-input-upload mb-4">
                        <div class="main_input special-input">
                            <div
                                class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray"
                            >
                                <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                <span>{{ $t("Auth.add_logo") }}</span>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader
                            ref="imageUploader"
                            :newImages="project_cover"
                            acceptedFiles="image/*"
                            :resetTrigger="resetImageTrigger"
                            :showValidation="showValidation"
                            :required="true"
                            :errorMessage="t('validation.attach_logo')"
                            @uploaded-images-updated="updateUploadedImages"
                        />
                    </div>

                    <!-- Profile Image Upload -->
                    <div class="position-relative single-input-upload mb-4">
                        <div class="main_input special-input">
                            <div
                                class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray"
                            >
                                <i class="fa-solid fa-camera fz-20 ml-1"></i>
                                <span>{{ $t("Auth.add_profile_image") }}</span>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader
                            ref="profileImageUploader"
                            :newImages="project_logo"
                            acceptedFiles="image/*"
                            :resetTrigger="resetImageTrigger"
                            :showValidation="showValidation"
                            :required="true"
                            :errorMessage="t('validation.attach_profile_image')"
                            @uploaded-images-updated="
                                updateUploadedProfileImage
                            "
                        />
                    </div>

                    <!-- Update Button -->
                    <button
                        type="submit"
                        class="custom-btn md"
                        :disabled="loading"
                    >
                        {{ $t("settings.save_changes") }}
                        <span
                            class="spinner-border spinner-border-sm"
                            v-if="loading"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    </button>
                </div>
            </div>
        </form>

        <!-- Success Dialog -->
        <Dialog
            v-model:visible="successfullyChange"
            modal
            class="custum_dialog_width without-close"
            :draggable="false"
        >
            <div class="text-center">
                <img
                    src="@/assets/images/Success.gif"
                    alt="check-img"
                    class="check-img"
                />
                <h3 class="main-title bold mb-4">
                    {{ $t("settings.saved_successfully") }}
                </h3>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

definePageMeta({
    name: "settings.provider_info",
    middleware: "auth",
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
const project_cover = ref("");
const project_logo = ref("");
// Form fields
const projectNameAr = ref("");
const projectNameEn = ref("");
const projectDescAr = ref("");
const projectDescEn = ref("");
const projectCommercialNumber = ref("");
const reservationDuration = ref("");

// Form state
const loading = ref(false);
const showValidation = ref(false);
const resetImageTrigger = ref(0);
const successfullyChange = ref(false);

// Images
const uploadedImage = ref([]);
const uploadedProfileImage = ref([]);

// Validation schemas
const {
    projectDescription_ar,
    projectDescription_en,
    commerciaRumber,
    required,
    reservationDuration: reservationDurationValidation,
} = useValidationSchema();

const validations = {
    projectNameAr: required("Auth.project_name_ar"),
    projectNameEn: required("Auth.project_name_en"),
    projectDescAr: projectDescription_ar("Auth.project_desc_ar"),
    projectDescEn: projectDescription_en("Auth.project_desc_en"),
    projectCommercialNumber: commerciaRumber("Auth.commerciaRumber"),
    reservationDuration: reservationDurationValidation(
        "Auth.reservation_duration",
    ),
};

// Form data (reactive object for validation)
const formData = computed(() => ({
    projectNameAr: projectNameAr.value,
    projectNameEn: projectNameEn.value,
    projectDescAr: projectDescAr.value,
    projectDescEn: projectDescEn.value,
    projectCommercialNumber: projectCommercialNumber.value,
    reservationDuration: reservationDuration.value,
}));

// Use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Config
const config = {
    headers: { Authorization: `Bearer ${token.value}` },
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
        const res = await axios.get("provider/profile", config);

        if (response(res) === "success") {
            const providerData = res.data.data;

            // Fill form with current data - matching the API structure
            projectNameAr.value = providerData.project_name_ar || "";
            projectNameEn.value = providerData.project_name_en || "";
            projectDescAr.value = providerData.project_description_ar || "";
            projectDescEn.value = providerData.project_description_en || "";
            projectCommercialNumber.value =
                providerData.project_commercial_number || "";
            reservationDuration.value = providerData.reservation_duration || "";
            project_cover.value = providerData.project_cover || "";
            project_logo.value = providerData.project_logo || "";
        }
    } catch (error) {
        console.error("Error loading provider data:", error);
        errorToast(t("settings.error_loading_data"));
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
            fd.append("project_name[ar]", projectNameAr.value);
            fd.append("project_name[en]", projectNameEn.value);
            fd.append("project_description[ar]", projectDescAr.value);
            fd.append("project_description[en]", projectDescEn.value);
            fd.append(
                "project_commercial_number",
                projectCommercialNumber.value,
            );
            fd.append("reservation_duration", reservationDuration.value);

            // Add logo if uploaded
            fd.append("project_logo", uploadedImage.value);
            // if (uploadedImage.value.length > 0) {
            // }

            // Add profile image if uploaded
            fd.append("project_cover", uploadedProfileImage.value);
            // if (uploadedProfileImage.value.length > 0) {
            // }

            const res = await axios.post(
                "provider/profile/update-project-data",
                fd,
                config,
            );

            if (response(res) === "success") {
                successToast(res.data.msg);
                // Show success dialog
                successfullyChange.value = true;
                // Close dialog after 1000ms
                setTimeout(() => {
                    successfullyChange.value = false;
                }, 2000);
                // Reset validation
                showValidation.value = false;
            } else {
                errorToast(res.data.msg);
            }
        } catch (error) {
            console.error("Update error:", error);
            errorToast(t("settings.update_failed"));
        } finally {
            loading.value = false;
        }
    }
};

// Load data on mount
onMounted(() => {
    loadProviderData();
});

const globalStore = useGlobalStore();
globalStore.title = t("Auth.settings");
</script>

<style lang="scss" scoped>
.single-input-upload {
    :deep(input) {
        width: 100%;
        height: 45px;
    }
}
</style>
