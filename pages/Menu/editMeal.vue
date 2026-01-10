<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('menu.edit_meal') }}
        </h1>
        <div class="layout-form">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>{{ $t('Table.Loading') }}</p>
            </div>

            <div v-else>
                <!-- Edit Meal Form -->
                <form @submit.prevent="submitTable" ref="addTableForm">

                    <!-- Logo Upload -->
                    <div class="label">{{ $t('menu.meal_image') }}</div>

                    <div class="position-relative single-input-upload box-img mb-4">

                        <div class="main_input special-input without-edit"
                            :class="{ 'is-invalid': showValidation && uploadedImage?.length === 0 }">
                            <div class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <i class="fa-solid fa-upload fz-20"></i>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader ref="imageUploader" acceptedFiles="image/*" :resetTrigger="resetImageTrigger"
                            :showValidation="showValidation" :required="true" :newImages="attachment"
                            :errorMessage="t('validation.attach_meal_image')"
                            @uploaded-images-updated="updateUploadedImages" />
                    </div>

                    <GlobalCustomDropdown v-model="mainSection" :options="sectionOptions" option-value="value"
                        :placeholder="$t('menu.select_menu')" :label="$t('menu.select_menu')"
                        :showValidation="showValidation" :validation-schema="validations.mainSection" />

                    <!-- Table Number -->
                    <div class="row">

                        <div class="col-12 col-md-6">
                            <!-- Table Number -->
                            <FormInput v-model:modelValue="tableNumberRef" name="name_ar" type="text"
                                :label="$t('menu.meal_name_ar')" :placeholder="$t('menu.meal_name_ar')"
                                :validation-schema="validations.tableNumber" :showErrors="showValidation" />
                        </div>

                        <div class="col-12 col-md-6">
                            <!-- Number of People -->
                            <FormInput v-model:modelValue="numberOfPeopleRef" name="name_en" type="text"
                                :label="$t('menu.meal_name_en')" :placeholder="$t('menu.meal_name_en')"
                                :validation-schema="validations.numberOfPeople" :showErrors="showValidation" />
                        </div>

                        <div class="col-12">
                            <FormInput v-model:modelValue="bookingPriceRef" name="price" type="number" min="0" step="1"
                                :label="$t('menu.meal_price')" :placeholder="$t('menu.meal_price')"
                                :validation-schema="validations.bookingPrice" :showErrors="showValidation" />
                        </div>

                        <!-- Description in Arabic -->
                        <div class="form-group">
                            <label class="label">{{ $t('menu.meal_description_ar') }}</label>
                            <div class="position-relative">
                                <textarea v-model="descriptionAr" @input="descriptionArTouched = true"
                                    name="description_ar" class="main_input main_area"
                                    :class="{ 'is-invalid': descriptionArError }"
                                    :placeholder="$t('menu.meal_description_ar')" rows="4">
                                </textarea>
                            </div>
                            <p v-if="descriptionArError" class="error-message text-danger mt-1">
                                {{ descriptionArError }}
                            </p>
                        </div>

                        <!-- Description in English -->
                        <div class="form-group">
                            <label class="label">{{ $t('menu.meal_description_en') }}</label>
                            <div class="position-relative">
                                <textarea v-model="descriptionEn" @input="descriptionEnTouched = true"
                                    name="description_en" class="main_input main_area"
                                    :class="{ 'is-invalid': descriptionEnError }"
                                    :placeholder="$t('menu.meal_description_en')" rows="4"></textarea>
                            </div>
                            <p v-if="descriptionEnError" class="error-message text-danger mt-1">
                                {{ descriptionEnError }}
                            </p>
                        </div>

                    </div>
                    <!-- Submit Button -->
                    <button type="submit" class="custom-btn md" :disabled="submitting">
                        {{ $t('Global.Saving_changes') }}
                        <span class="spinner-border spinner-border-sm" v-if="submitting" role="status"
                            aria-hidden="true"></span>
                    </button>
                </form>
            </div>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('settings.saved_successfully') }}
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: "global" });

// Global store
const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.edit_meal');

// Get id from query
const route = useRoute();
const id = route.query.id;

// Pinia store for authentication
const store = useAuthStore();
const { token } = storeToRefs(store);

// Axios config with authentication
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// Axios
const axios = useApi(config);

// Validation schemas
const {
    tableNumber,
    required,
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: tableNumber(t('menu.meal_name_ar')),
    numberOfPeople: tableNumber(t('menu.meal_name_en')),
    descriptionAr: tableNumber(t('menu.meal_description_ar')),
    descriptionEn: tableNumber(t('menu.meal_description_en')),
    bookingPrice: tableNumber(t('menu.meal_price')),
    mainSection: required('menu.select_menu'),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state
const loading = ref(true); // Start with loading true
const submitting = ref(false);
const showValidation = ref(false);
const successDialog = ref(false);
const addTableForm = ref(null);
const attachment = ref([]);
// Meal data
const mealData = ref(null);
const currency = ref('SAR');

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
const mainSection = ref(null);
const sectionOptions = ref([]);
// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    bookingPrice: bookingPriceRef.value,
    descriptionAr: descriptionAr.value,
    descriptionEn: descriptionEn.value,
    mainSection: mainSection.value,
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

// Fetch menu options from API
const fetchMenuOptions = async () => {
    try {
        const response = await axios.get('provider/menus', config.value);

        if (response.data.key === 'success') {
            // Map API response to dropdown format
            sectionOptions.value = response.data.data.data.map(menu => ({
                name: menu.name,
                value: menu.id
            }));
        }
    } catch (error) {
        console.error('Error fetching menu options:', error);
        errorToast(t('menu.error_loading_menus'));
    }
};

// Fetch meal data from API
const fetchMealData = async () => {
    if (!id) {
        errorToast(t('menu.meal_id_not_found'));
        navigateTo('/Menu');
        return;
    }

    try {
        loading.value = true;
        const response = await axios.get(`provider/meals/${id}/show`, config.value);

        if (response.data.key === 'success') {
            const meal = response.data.data.meal;
            mealData.value = meal;
            currency.value = response.data.data.currency;

            // Populate form fields with API data
            tableNumberRef.value = meal.name_ar || '';
            numberOfPeopleRef.value = meal.name_en || '';
            bookingPriceRef.value = meal.price || '';
            descriptionAr.value = meal.description_ar || '';
            descriptionEn.value = meal.description_en || '';
            mainSection.value = meal.menu?.id || null;

            // Set existing image if available
            if (meal.image) {
                attachment.value = meal.image;
            }
        }
    } catch (error) {
        console.error('Error fetching meal data:', error);
        errorToast(t('menu.error_loading_meal_data'));
    } finally {
        loading.value = false;
    }
};

// Submit meal update function
const submitTable = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations, imageUploader);

    if (!isValid) {
        scrollToFirstError(formData.value, validations, imageUploader);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        submitting.value = true;

        try {
            const fd = new FormData(addTableForm.value);

            // Add image if uploaded
            if (uploadedImage.value) {
                fd.append('image', uploadedImage.value);
            }

            // Add menu_id
            fd.append('menu_id', mainSection.value);

            const res = await axios.post(`provider/meals/${id}/update`, fd, config.value);

            if (res.data.key === 'success') {
                successDialog.value = true;
                successToast(res.data.msg || t('menu.meal_updated_successfully'));

                // Navigate back after success
                setTimeout(() => {
                    successDialog.value = false;
                    navigateTo(`/Menu/${mainSection.value}`);
                }, 1500);
            } else {
                errorToast(res.data.msg);
            }

        } catch (error) {
            console.error("Update meal error:", error);
            errorToast(t('menu.error_updating_meal'));
        } finally {
            submitting.value = false;
        }
    }
};

// Load data on component mount
onMounted(async () => {
    await fetchMenuOptions();
    await fetchMealData();
});

// Page meta
definePageMeta({
    name: "menu.edit_meal",
    layout: "default",
});
</script>

<style lang="scss" scoped>
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;

    .spinner-border {
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        border: 0.25em solid #f3f3f3;
        border-top: 0.25em solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    p {
        color: #666;
        font-size: 16px;
        margin: 0;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.with-area {
    top: 20px;
}
</style>