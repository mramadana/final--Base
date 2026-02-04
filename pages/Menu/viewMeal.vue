<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('menu.meal_details') }}
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
                <!-- View Meal Form (Readonly) -->
                <form ref="addTableForm">

                    <!-- Logo Upload -->
                    <div class="label">{{ $t('menu.meal_image') }}</div>

                    <div class="position-relative single-input-upload box-img with_out_edit mb-4">
                    
                        <div class="main_input without-edit">
                            <div
                                class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <i class="fa-solid fa-image fz-20"></i>
                            </div>
                        </div>
                        <!-- Readonly mode - no upload -->
                        <GlobalImgUploader 
                            ref="imageUploader"
                            acceptedFiles="image/*" 
                            :resetTrigger="resetImageTrigger"
                            :showValidation="false"
                            :required="false"
                            :disabled="true"
                            :newImages="attachment"
                            :errorMessage="t('validation.attach_menu_image')"
                            @uploaded-images-updated="updateUploadedImages" />
                    </div>
                
                    <GlobalCustomDropdown 
                        v-model="mainSection" 
                        :options="sectionOptions"
                        option-value="value"
                        :placeholder="$t('menu.select_menu')"
                        :label="$t('menu.select_menu')"
                        :showValidation="false"
                        :validation-schema="validations.mainSection"
                        :disabled="true"
                    />

                    <!-- Table Number -->
                    <div class="row">

                        <div class="col-12 col-md-6">
                            <!-- Table Number -->
                            <FormInput 
                                v-model:modelValue="tableNumberRef"
                                name="tableNumber" 
                                type="text"
                                :label="$t('menu.meal_name_ar')"
                                :placeholder="$t('menu.meal_name_ar')"
                                :validation-schema="validations.tableNumber"
                                :showErrors="false"
                                :readonly="true"
                            />
                        </div>

                        <div class="col-12 col-md-6">
                            <!-- Number of People -->
                            <FormInput 
                                v-model:modelValue="numberOfPeopleRef"
                                name="nameEn" 
                                type="text"
                                :label="$t('menu.meal_name_en')"
                                :placeholder="$t('menu.meal_name_en')"
                                :validation-schema="validations.numberOfPeople"
                                :showErrors="false"
                                :readonly="true"
                            />
                        </div>
                        
                        <div class="col-12">
                            <FormInput 
                                v-model:modelValue="bookingPriceRef"
                                name="bookingPrice" 
                                type="number"
                                min="0"
                                step="1"
                                :label="$t('menu.meal_price')"
                                :placeholder="$t('menu.meal_price')"
                                :validation-schema="validations.bookingPrice"
                                :readonly="true"
                            />
                        </div>

                        <!-- Description in Arabic -->
                        <div class="form-group">
                            <label class="label">{{ $t('menu.meal_description_ar') }}</label>
                            <div class="position-relative">
                                <textarea 
                                    v-model="descriptionAr"
                                    name="descriptionAr"
                                    class="main_input main_area"
                                    :placeholder="$t('menu.meal_description_ar')"
                                    rows="4"
                                    readonly
                                ></textarea>
                            </div>
                        </div>

                        <!-- Description in English -->
                        <div class="form-group">
                            <label class="label">{{ $t('menu.meal_description_en') }}</label>
                            <div class="position-relative">
                                <textarea 
                                    v-model="descriptionEn"
                                    name="descriptionEn" 
                                    class="main_input main_area"
                                    :placeholder="$t('menu.meal_description_en')"
                                    rows="4"
                                    readonly
                                ></textarea>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: "global" });

// Page meta
definePageMeta({
    name: "menu.meal_details",
    middleware: 'auth'
});

// Global store
const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.meal_details');

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

// Validation schemas (not needed for readonly but keeping for consistency)
const {
    tableNumber,
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: tableNumber(t('menu.meal_name_ar')),
    numberOfPeople: tableNumber(t('menu.meal_name_en')),
    descriptionAr: tableNumber(t('menu.meal_description_ar')),
    descriptionEn: tableNumber(t('menu.meal_description_en')),
    bookingPrice: tableNumber(t('menu.meal_price')),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state (readonly mode)
const loading = ref(true);
const addTableForm = ref(null);

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
const descriptionAr = ref('');
const descriptionEn = ref('');
const bookingPriceRef = ref('');

// Readonly mode - no touched states needed
const mainSection = ref(null);
const sectionOptions = ref([]);
const attachment = ref([]);
// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    bookingPrice: bookingPriceRef.value,
    descriptionAr: descriptionAr.value,
    descriptionEn: descriptionEn.value,
    mainSection: mainSection.value,
}));

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

// Load data on component mount
onMounted(async () => {
    await fetchMenuOptions();
    await fetchMealData();
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.with-area {
    top: 20px;
}

// Readonly styles
:deep(.main_input[readonly]),
:deep(input[readonly]),
textarea[readonly] {
    background-color: #2a2a2a !important;
    cursor: not-allowed;
    opacity: 0.9;
    pointer-events: none;
}

// Placeholder في readonly mode
:deep(input[readonly]::placeholder),
textarea[readonly]::placeholder {
    color: #888 !important;
    opacity: 1 !important;
}

:deep(.p-dropdown.p-disabled) {
    opacity: 0.8;
    cursor: not-allowed;
}
</style>