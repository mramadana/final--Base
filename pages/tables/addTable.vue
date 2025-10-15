<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('tables.add_new_table') }}
        </h1>
        <div class="layout-form">

            <!-- Add Table Form -->
            <form @submit.prevent="submitTable" ref="addTableForm">

                <!-- Logo Upload -->
                <div class="label">{{ $t('tables.table_image') }}</div>
                <div class="position-relative single-input-upload mb-4">
                    
                    <div class="main_input special-input without-edit" :class="{ 'is-invalid': showValidation && uploadedImage?.length === 0 }">
                        <div
                            class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                            <i class="fa-solid fa-upload fz-20"></i>
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
                        :errorMessage="t('validation.attach_table_image')"
                        @uploaded-images-updated="updateUploadedImages" />
                </div>
                
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- Table Number -->
                        <FormInput 
                            v-model:modelValue="tableNumberRef"
                            name="tableNumber" 
                            type="text"
                            :label="$t('tables.table_symbol')"
                            :placeholder="$t('tables.table_symbol')"
                            :validation-schema="validations.tableNumber"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/sidebar/table-img.png"
                            :with_icon="true"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <!-- Number of People -->
                        <FormInput 
                            v-model:modelValue="numberOfPeopleRef"
                            name="numberOfPeople" 
                            type="number"
                            :label="$t('tables.number_of_people')"
                            :placeholder="$t('tables.number_of_people')"
                            :validation-schema="validations.numberOfPeople"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/user.svg"
                            :with_icon="true"
                        />
                    </div>

                    <!-- Booking Price -->
                    <FormInput 
                        v-model:modelValue="bookingPriceRef"
                        name="bookingPrice" 
                        type="number"
                        min="0"
                        step="1"
                        :label="$t('tables.booking_price_table')"
                        :placeholder="$t('tables.booking_price_table')"
                        :validation-schema="validations.bookingPrice"
                        :showErrors="showValidation"
                        :hasIcon="true"
                        icon="/_nuxt/assets/images/money.svg"
                        :with_icon="true"
                    />

                    <!-- Description in Arabic -->
                    <div class="form-group">
                        <label class="label">{{ $t('Auth.project_desc_ar') }}</label>
                        <div class="position-relative with_icon">
                            <textarea 
                                v-model="descriptionAr"
                                @input="descriptionArTouched = true"
                                name="descriptionAr"
                                class="main_input main_area"
                                :class="{ 'is-invalid': descriptionArError }"
                                :placeholder="$t('Auth.project_desc_ar')"
                                rows="4">
                            </textarea>
                            <img src="@/assets/images/file-img.svg" alt="icon" class="input-icon with-area" />
                        </div>
                        <p v-if="descriptionArError" class="error-message text-danger mt-1">
                            {{ descriptionArError }}
                        </p>
                    </div>

                    <!-- Description in English -->
                    <div class="form-group">
                        <label class="label">{{ $t('Auth.project_desc_en') }}</label>
                        <div class="position-relative with_icon">
                            <textarea 
                                v-model="descriptionEn"
                                @input="descriptionEnTouched = true"
                                name="descriptionEn" 
                                class="main_input main_area"
                                :class="{ 'is-invalid': descriptionEnError }"
                                :placeholder="$t('Auth.project_desc_en')"
                                rows="4"
                            ></textarea>
                            <img src="@/assets/images/file-img.svg" alt="icon" class="input-icon with-area" />
                        </div>
                        <p v-if="descriptionEnError" class="error-message text-danger mt-1">
                            {{ descriptionEnError }}
                        </p>
                    </div>

                </div>
                <!-- Submit Button -->
                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t('Auth.next') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    تم إضافة الطاولة بنجاح
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

// Axios
const axios = useApi(); 

// Validation schemas
const {
    tableNumber,
    numberOfPeople,
    bookingPrice,
    projectDescription_ar,
    projectDescription_en
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: tableNumber(t('tables.table_symbol')),
    numberOfPeople: numberOfPeople(t('tables.number_of_people')),
    bookingPrice: bookingPrice(t('tables.booking_price_table')),
    descriptionAr: projectDescription_ar(t('Auth.project_desc_ar')),
    descriptionEn: projectDescription_en(t('Auth.project_desc_en')),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state
const loading = ref(false);
const showValidation = ref(false);
const successDialog = ref(false);
const addTableForm = ref(null);

// image uploader
const imageUploader = ref(null);
const uploadedImage = ref([]);
const resetImageTrigger = ref(0);

// Form fields as separate refs
const tableNumberRef = ref('');
const numberOfPeopleRef = ref('');
const bookingPriceRef = ref('');
const descriptionAr = ref('');
const descriptionEn = ref('');

// Touched states
const descriptionArTouched = ref(false);
const descriptionEnTouched = ref(false);

// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    bookingPrice: bookingPriceRef.value,
    descriptionAr: descriptionAr.value,
    descriptionEn: descriptionEn.value
}));

// Use the composable for validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Helper function to get validation error
const getValidationError = (field, value, touched) => {
    if (!showValidation.value && !touched) return '';
    try {
        validations[field].validateSync(value);
        return '';
    } catch (error) {
        return error.message;
    }
};

// Computed error messages
const descriptionArError = computed(() => 
    getValidationError('descriptionAr', descriptionAr.value, descriptionArTouched.value)
);

const descriptionEnError = computed(() => 
    getValidationError('descriptionEn', descriptionEn.value, descriptionEnTouched.value)
);

// simple function to update the images
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// Submit table function
const submitTable = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations, imageUploader);

    if (!isValid) {
        scrollToFirstError(formData.value, validations, imageUploader);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData(addTableForm.value);
            fd.append('logo', uploadedImage.value);
            const res = await axios.post('tables', fd);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            successDialog.value = true;
            successToast("تم إضافة الطاولة بنجاح");

            // Reset form on success
            setTimeout(() => {
                successDialog.value = false;
                navigateTo('/tables');
            }, 2000);

        } catch (error) {
            console.error("Add table error:", error);
            errorToast("حدث خطأ أثناء إضافة الطاولة");
        } finally {
            loading.value = false;
        }
    }
};

// Page meta
definePageMeta({
    name: "tables.add_new_table",
    layout: "default",
});
</script>

<style lang="scss" scoped>
.with-area {
    top: 20px;
}

.single-input-upload {
    .without-edit {
        width: 70px !important;
        height: 70px !important;
        padding: 0 !important;
    }
    :deep(input) {
        width: 70px !important;
        height: 70px !important;
    }

    :deep(.uploaded-block) {
        width: 70px !important;
        height: 70px !important;
        margin-top: 0 !important;
        position: absolute !important;
        inset-inline-start: 0 !important;
        top: 0;
        img {
            background-color: #252525;
        }
    }
}
</style>