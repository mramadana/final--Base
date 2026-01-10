<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('menu.add_new_menu') }}
        </h1>
        <div class="layout-form">

            <!-- Add Table Form -->
            <form @submit.prevent="submitTable" ref="addTableForm">

                <!-- Logo Upload -->
                <div class="label">{{ $t('tables.menu_image') }}</div>

                <div class="position-relative single-input-upload box-img mb-4">
                    
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
                        :errorMessage="t('validation.attach_menu_image')"
                        @uploaded-images-updated="updateUploadedImages" />
                </div>
                
                <GlobalCustomDropdown 
                    v-model="mainSection" 
                    :options="sectionOptions"
                    option-value="value"
                    :placeholder="$t('Global.category')" 
                    :label="$t('Global.category')"
                    :showValidation="showValidation"
                    :validation-schema="validations.mainSection"
                />

                <!-- Table Number -->
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- name in arabic -->
                        <FormInput 
                            v-model:modelValue="tableNumberRef"
                            name="name_ar" 
                            type="text"
                            :label="$t('menu.meal_name_ar')"
                            :placeholder="$t('menu.meal_name_ar')"
                            :validation-schema="validations.tableNumber"
                            :showErrors="showValidation"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <!-- name in english -->
                        <FormInput 
                            v-model:modelValue="numberOfPeopleRef"
                            name="name_en" 
                            type="text"
                            :label="$t('menu.meal_name_en')"
                            :placeholder="$t('menu.meal_name_en')"
                            :validation-schema="validations.numberOfPeople"
                            :showErrors="showValidation"
                        />
                    </div>

                    <!-- Description in Arabic -->
                    <div class="form-group">
                        <label class="label">{{ $t('menu.meal_description_ar') }}</label>
                        <div class="position-relative">
                            <textarea 
                                v-model="descriptionAr"
                                @input="descriptionArTouched = true"
                                name="description_ar"
                                class="main_input main_area"
                                :class="{ 'is-invalid': descriptionArError }"
                                :placeholder="$t('menu.meal_description_ar')"
                                rows="4">
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
                            <textarea 
                                v-model="descriptionEn"
                                @input="descriptionEnTouched = true"
                                name="description_en" 
                                class="main_input main_area"
                                :class="{ 'is-invalid': descriptionEnError }"
                                :placeholder="$t('menu.meal_description_en')"
                                rows="4"
                            ></textarea>
                        </div>
                        <p v-if="descriptionEnError" class="error-message text-danger mt-1">
                            {{ descriptionEnError }}
                        </p>
                    </div>

                </div>
                <!-- Submit Button -->
                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t('menu.add_menu') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('menu.menu_added_successfully') }}
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

// Page meta
definePageMeta({
    name: "menu.add_new_menu",
    layout: "default",
});

const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.add_new_menu');

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
    mainSection: required('Global.category'),
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
        const response = await axios.get('menus-types', config.value);
        
        if (response.data.key === 'success') {
            // Map API response to dropdown format
            sectionOptions.value = response.data.data.map(menu => ({
                name: menu.name,
                value: menu.id
            }));
        }
    } catch (error) {
        console.error('Error fetching menu options:', error);
        errorToast(t('menu.error_loading_menus'));
    }
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
            fd.append('image', uploadedImage.value);
            fd.append("menu_type_id", mainSection.value);
            
            const res = await axios.post('provider/menus/store', fd, config.value);

            if (res.data.key === 'success') {
                successDialog.value = true;
                successToast(res.data.msg || t('menu.menu_added_successfully'));

                // Reset form on success
                setTimeout(() => {
                    successDialog.value = false;
                    navigateTo('/Menu');
                }, 1500);
            } else {
                errorToast(res.data.msg);
            }

        } catch (error) {
            console.error("Add menu error:", error);
            errorToast(t('menu.error_adding_menu'));
        } finally {
            loading.value = false;
        }
    }
};

// Fetch menu options on component mount
onMounted(() => {
    fetchMenuOptions();
});

</script>

<style lang="scss" scoped>
.with-area {
    top: 20px;
}


</style>