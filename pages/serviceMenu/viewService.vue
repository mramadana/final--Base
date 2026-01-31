<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('sideMenu.view_service') }}
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
                <!-- View Service Form (Readonly) -->
                <form ref="addTableForm">

                    <!-- Logo Upload -->
                    <div class="label">{{ $t('menu.service_image') }}</div>

                    <div class="position-relative single-input-upload with_out_edit box-img mb-5">
                        <div class="main_input special-input without-edit">
                            <div class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <i class="fa-solid fa-upload fz-20"></i>
                            </div>
                        </div>
                        <GlobalImgUploader ref="imageUploader" acceptedFiles="image/*" :resetTrigger="resetImageTrigger"
                            :showValidation="false" :required="false" :newImages="attachment"
                            :errorMessage="t('validation.attach_service_image')" :disabled="true"
                            @uploaded-images-updated="updateUploadedImages" />
                    </div>

                    <!-- Table Number -->
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <!-- name in arabic -->
                            <FormInput v-model:modelValue="tableNumberRef" name="name_ar" type="text"
                                :label="$t('menu.meal_name_ar')" :placeholder="$t('menu.meal_name_ar')"
                                :validation-schema="validations.tableNumber" :showErrors="false" :readonly="true" />
                        </div>
                        <div class="col-12 col-md-6">
                            <!-- name in english -->
                            <FormInput v-model:modelValue="numberOfPeopleRef" name="name_en" type="text"
                                :label="$t('menu.meal_name_en')" :placeholder="$t('menu.meal_name_en')"
                                :validation-schema="validations.numberOfPeople" :showErrors="false" :readonly="true" />
                        </div>
                    </div>

                    <!-- Price -->
                    <FormInput v-model:modelValue="bookingPriceRef" name="price" type="number" min="0" step="1"
                        :label="$t('menu.meal_price')" :placeholder="$t('menu.meal_price')"
                        :validation-schema="validations.bookingPrice" :showErrors="false" :readonly="true" />

                    <!-- Maximum Reservations -->
                    <GlobalCustomDropdown v-model="maximumReservations" :options="numberOptions" option-value="value"
                        :placeholder="$t('service.maximum_reservations')" :label="$t('service.maximum_reservations')"
                        :showValidation="false" :validation-schema="validations.maximumReservations" :disabled="true" />

                    <!-- Duration Implementation -->
                    <GlobalCustomDropdown v-model="durationImplementation" :options="numberOptions" option-value="value"
                        :placeholder="$t('service.duration_implementation')" :label="$t('service.duration_implementation')"
                        :showValidation="false" :validation-schema="validations.durationImplementation" :disabled="true" />

                    <!-- Description in Arabic -->
                    <div class="form-group">
                        <label class="label">{{ $t('menu.meal_description_ar') }}</label>
                        <div class="position-relative">
                            <textarea v-model="descriptionAr" name="description_ar"
                                class="main_input main_area"
                                :placeholder="$t('menu.meal_description_ar')" rows="4" readonly></textarea>
                        </div>
                    </div>

                    <!-- Description in English -->
                    <div class="form-group">
                        <label class="label">{{ $t('menu.meal_description_en') }}</label>
                        <div class="position-relative">
                            <textarea v-model="descriptionEn" name="description_en"
                                class="main_input main_area"
                                :placeholder="$t('menu.meal_description_en')" rows="4" readonly></textarea>
                        </div>
                    </div>

                    <!-- Employees List (View Only) -->
                    <div class="form-group" v-if="employeesList.length > 0">
                        <label class="label">{{ $t('service.add_employee') }}</label>
                        <div class="employees-list mt-3">
                            <div v-for="(employee, index) in employeesList" :key="index" class="employee-item view-only">
                                <span class="employee-name">{{ employee }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Working Hours Section (View Only) -->
                    <div class="form-group working-hours-section" v-if="savedDays.length > 0">
                        <label class="label">{{ $t('workingTime.page_title') }}</label>

                        <!-- Saved Days List -->
                        <div class="days-list">
                            <div v-for="(day, index) in savedDays" :key="day.id" class="day-row saved-row view-only">
                                <!-- Day Dropdown -->
                                <div class="day-dropdown-wrapper">
                                    <Dropdown v-model="day.dayName" :options="daysOfWeek" optionLabel="label"
                                        optionValue="value" :placeholder="$t('workingTime.select_day')"
                                        class="day-dropdown" :disabled="true" />
                                    <i class="far fa-calendar dropdown-icon"></i>
                                </div>

                                <!-- Time From -->
                                <div class="time-input-wrapper">
                                    <i class="far fa-clock time-icon-start"></i>
                                    <flat-pickr v-model="day.timeFrom" :config="timePickrConfigReadonly" class="custom-time"
                                        :placeholder="$t('workingTime.time_from')" />
                                </div>

                                <!-- Time To -->
                                <div class="time-input-wrapper">
                                    <flat-pickr v-model="day.timeTo" :config="timePickrConfigReadonly" class="custom-time"
                                        :placeholder="$t('workingTime.time_to')" />
                                    <i class="far fa-clock time-icon-end"></i>
                                </div>
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
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Arabic } from "flatpickr/dist/l10n/ar";

const { t } = useI18n({ useScope: "global" });

// Get id from query
const route = useRoute();
const id = route.query.id;

// Global store
const globalStore = useGlobalStore();
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/serviceMenu';
globalStore.subtitle = t('sideMenu.view_service');

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
    bookingPrice,
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: tableNumber(t('menu.meal_name_ar')),
    numberOfPeople: tableNumber(t('menu.meal_name_en')),
    bookingPrice: bookingPrice(t('menu.meal_price')),
    descriptionAr: tableNumber(t('menu.meal_description_ar')),
    descriptionEn: tableNumber(t('menu.meal_description_en')),
    maximumReservations: required('service.maximum_reservations'),
    durationImplementation: required('service.duration_implementation'),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state
const loading = ref(true);
const addTableForm = ref(null);
const attachment = ref([]);
const serviceData = ref(null);
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

// Dropdown values
const maximumReservations = ref(null);
const durationImplementation = ref(null);

// Number options from 1 to 5
const numberOptions = ref([
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 }
]);

// Employee management
const employeesList = ref([]);

// Working Hours State
const savedDays = ref([]);

// Days of week options
const daysOfWeek = computed(() => [
    { label: t('workingTime.days.saturday'), value: 'Saturday' },
    { label: t('workingTime.days.sunday'), value: 'Sunday' },
    { label: t('workingTime.days.monday'), value: 'Monday' },
    { label: t('workingTime.days.tuesday'), value: 'Tuesday' },
    { label: t('workingTime.days.wednesday'), value: 'Wednesday' },
    { label: t('workingTime.days.thursday'), value: 'Thursday' },
    { label: t('workingTime.days.friday'), value: 'Friday' },
]);

// Flatpickr config for time picker (readonly mode)
const timePickrConfigReadonly = computed(() => ({
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: false,
    disableMobile: true,
    clickOpens: false,
    allowInput: false,
    locale: import.meta.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
}));

// simple function to update the images
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// Fetch service data from API
const fetchServiceData = async () => {
    if (!id) {
        errorToast(t('menu.service_id_not_found'));
        navigateTo('/serviceMenu');
        return;
    }

    try {
        loading.value = true;
        const response = await axios.get(`provider/services/${id}/show`, config.value);

        if (response.data.key === 'success') {
            const service = response.data.data.service;
            serviceData.value = service;
            currency.value = response.data.data.currency;

            // Populate form fields with API data
            tableNumberRef.value = service.name_ar || '';
            numberOfPeopleRef.value = service.name_en || '';
            bookingPriceRef.value = service.price || '';
            descriptionAr.value = service.description_ar || '';
            descriptionEn.value = service.description_en || '';
            maximumReservations.value = service.number_of_available_reservations || null;
            durationImplementation.value = service.duration || null;

            // Set existing image if available
            if (service.image) {
                attachment.value = service.image;
            }

            // Populate employees list
            if (service.employees && service.employees.length > 0) {
                employeesList.value = service.employees.map(emp => emp.name);
            }

            // Populate working hours
            if (service.working_hours && service.working_hours.length > 0) {
                savedDays.value = service.working_hours.map((wh, index) => ({
                    id: Date.now() + index,
                    dayName: wh.day_value,
                    timeFrom: wh.from,
                    timeTo: wh.to,
                }));
            }
        }
    } catch (error) {
        console.error('Error fetching service data:', error);
        errorToast(t('menu.error_loading_service_data'));
    } finally {
        loading.value = false;
    }
};

// Load data on component mount
onMounted(async () => {
    await fetchServiceData();
});

// Page meta
definePageMeta({
    layout: "default",
    name: "sideMenu.view_service"
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

// Employees list (view only)
.employees-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    .employee-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &.view-only {
            opacity: 0.8;
            cursor: default;
        }
        
        .employee-name {
            color: #fff;
            font-size: 15px;
            font-weight: 500;
        }
    }
}

// Working Hours Styles (view only)
.working-hours-section {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 2px solid #3a3a3a;

    .days-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 24px;
    }

    .day-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 20px;
        border-bottom: 2px solid #3a3a3a;
        flex-wrap: wrap;

        &.view-only {
            opacity: 0.9;
        }

        .day-dropdown-wrapper {
            position: relative;
            flex-grow: 1;
            width: 350px;
            max-width: 100%;

            .dropdown-icon {
                position: absolute;
                inset-inline-start: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
                background: rgba(255, 255, 255, 0.05);
                font-size: 16px;
                pointer-events: none;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
            }
        }

        .time-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            background-color: #3a3a3a;
            border-radius: 8px;
            padding: 0 12px;
            height: 45px;
            flex-grow: 1;

            .time-icon-start,
            .time-icon-end {
                color: #999;
                font-size: 16px;
                pointer-events: none;
            }

            .time-icon-start {
                margin-inline-end: 8px;
            }

            .time-icon-end {
                margin-inline-start: 8px;
            }
        }
    }
}

// Flatpickr custom styles (readonly)
:deep(.custom-time) {
    height: 45px;
    border: none;
    background: transparent;
    color: #fff;
    width: 100%;
    padding: 0;
    cursor: default;
    font-size: 14px;
    pointer-events: none;

    &::placeholder {
        color: #999;
        font-size: 13px;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
}

// Dropdown styles (disabled)
:deep(.day-dropdown) {
    width: 100%;
}

:deep(.p-dropdown) {
    background-color: #3a3a3a !important;
    border: none !important;
    border-radius: 8px !important;
    color: #fff !important;
    height: 45px !important;
    box-shadow: none !important;

    &.p-disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }
}

:deep(.day-dropdown-wrapper .p-dropdown-label) {
    color: #999 !important;
    padding-inline-start: 40px !important;
    font-size: 14px !important;
}

// Readonly input styles
:deep(input[readonly]),
:deep(textarea[readonly]) {
    cursor: not-allowed;
    opacity: 0.9;
    pointer-events: none;
}
</style>
