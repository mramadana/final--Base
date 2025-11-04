<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('menu.meal_details') }}
        </h1>
        <div class="layout-form">
            <!-- View Meal Form (Readonly) -->
            <form ref="addTableForm">

                <!-- Logo Upload -->
                <div class="label">{{ $t('menu.meal_image') }}</div>

                <div class="position-relative single-input-upload mb-4">
                    
                    <div class="main_input special-input without-edit">
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
                                readonly>
                            </textarea>
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
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: "global" });

// Page meta
definePageMeta({
    name: "menu.meal_details",
    layout: "default",
});

// Global store
const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.meal_details');

// Get id and menuId from query
const route = useRoute();
const id = route.query.id;

// Axios
const axios = useApi();
const bookingPriceRef = ref('');

// Validation schemas
const {
    tableNumber,
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: tableNumber(t('menu.meal_name_ar')),
    numberOfPeople: tableNumber(t('menu.meal_name_en')),
    descriptionAr: tableNumber(t('menu.meal_description_ar')),
    descriptionEn: tableNumber(t('menu.meal_description_en')),
    bookingPrice: tableNumber(t('tables.booking_price_table')),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state (readonly mode)
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

// Readonly mode - no touched states needed
const mainSection = ref(null);
const sectionOptions = ref([
    { name: 'مستلزمات الأطفال', value: 'baby_supplies' },
    { name: 'الأعشاب', value: 'herbs' },
    { name: 'الطبخ', value: 'cuisine' }
]);
// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    descriptionAr: descriptionAr.value,
    descriptionEn: descriptionEn.value
}));

// Readonly mode - no validation needed

// simple function to update the images
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// Fetch meal data on mount
const fetchMealData = async () => {
    try {
        // Replace with your actual API endpoint
        // const response = await axios.get(`meals/${id}`);
        // const meal = response.data;
        // 
        // tableNumberRef.value = meal.nameAr;
        // numberOfPeopleRef.value = meal.nameEn;
        // bookingPriceRef.value = meal.price;
        // descriptionAr.value = meal.descriptionAr;
        // descriptionEn.value = meal.descriptionEn;
        // mainSection.value = meal.menu;
        // uploadedImage.value = meal.image;
        
        console.log('Fetching meal data for ID:', id);
    } catch (error) {
        console.error('Error fetching meal:', error);
    }
};

// Fetch data on mount
onMounted(() => {
    fetchMealData();
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