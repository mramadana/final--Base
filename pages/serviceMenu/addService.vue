<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('menu.add_new_service') }}
        </h1>
        <div class="layout-form">

            <!-- Add Table Form -->
            <form @submit.prevent="submitTable" ref="addTableForm">

                <!-- Logo Upload -->
                <div class="label">{{ $t('menu.service_image') }}</div>

                <div class="position-relative single-input-upload box-img mb-5">
                    
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
                        :errorMessage="t('validation.attach_service_image')"
                        @uploaded-images-updated="updateUploadedImages" />
                </div>

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
                </div>

                <!-- Price -->
                <FormInput 
                    v-model:modelValue="bookingPriceRef"
                    name="price" 
                    type="number"
                    min="0"
                    step="1"
                    :label="$t('menu.meal_price')"
                    :placeholder="$t('menu.meal_price')"
                    :validation-schema="validations.bookingPrice"
                    :showErrors="showValidation"
                />
                
                <GlobalCustomDropdown 
                    v-model="maximumReservations" 
                    :options="numberOptions"
                    option-value="value"
                    :placeholder="$t('service.maximum_reservations')" 
                    :label="$t('service.maximum_reservations')"
                    :showValidation="showValidation"
                    :validation-schema="validations.maximumReservations"
                />

                <GlobalCustomDropdown 
                    v-model="durationImplementation" 
                    :options="numberOptions"
                    option-value="value"
                    :placeholder="$t('service.duration_implementation')" 
                    :label="$t('service.duration_implementation')"
                    :showValidation="showValidation"
                    :validation-schema="validations.durationImplementation"
                />

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

                <!-- Add Employee Section -->
                <div class="form-group">
                    <label class="label">{{ $t('service.add_employee') }}</label>
                    <div class="employee-input-wrapper">
                        <input 
                            v-model="employeeNameInput"
                            type="text"
                            class="main_input employee-input"
                            :class="{ 'is-invalid': showEmployeeError }"
                            :placeholder="$t('service.employee_name_placeholder')"
                        />
                        <button 
                            type="button" 
                            class="custom-btn md add-employee-btn"
                            @click="addEmployee"
                            :disabled="!employeeNameInput || !employeeNameInput.trim()"
                        >
                            {{ $t('service.add_employee_btn') }}
                        </button>
                    </div>
                    <p v-if="showEmployeeError" class="error-message text-danger mt-1">
                        {{ employeeErrorMessage }}
                    </p>
                    
                    <!-- Employees List Validation Error -->
                    <p v-if="showEmployeesListError" class="error-message text-danger mt-1">
                        {{ employeesListError }}
                    </p>
                    
                    <!-- Added Employees List -->
                    <div v-if="employeesList.length > 0" class="employees-list mt-3">
                        <div 
                            v-for="(employee, index) in employeesList" 
                            :key="index"
                            class="employee-item"
                        >
                            <span class="employee-name">{{ employee }}</span>
                            <button 
                                type="button" 
                                class="delete-employee-btn"
                                @click="removeEmployee(index)"
                                :title="$t('service.delete_employee')"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Working Hours Section -->
                <div class="form-group working-hours-section">
                    <label class="label">{{ $t('workingTime.page_title') }}</label>
                    
                    <!-- Current Input Row -->
                    <div class="day-row current-input">
                        <!-- Day Dropdown -->
                        <div class="day-dropdown-wrapper">
                            <i class="far fa-calendar dropdown-icon"></i>
                            <Dropdown 
                                v-model="currentDay.dayName" 
                                :options="daysOfWeek" 
                                optionLabel="label" 
                                optionValue="value"
                                :placeholder="$t('workingTime.select_day')" 
                                class="day-dropdown" 
                            />
                        </div>

                        <!-- Time From -->
                        <div class="time-input-wrapper">
                            <i class="far fa-clock time-icon-start"></i>
                            <flat-pickr 
                                v-model="currentDay.timeFrom" 
                                :config="timePickrConfig" 
                                class="custom-time"
                                :placeholder="$t('workingTime.time_from')" 
                            />
                        </div>

                        <!-- Time To -->
                        <div class="time-input-wrapper">
                            <flat-pickr 
                                v-model="currentDay.timeTo" 
                                :config="timePickrConfig" 
                                class="custom-time"
                                :placeholder="$t('workingTime.time_to')" 
                            />
                            <i class="far fa-clock time-icon-end"></i>
                        </div>

                        <!-- Add Button -->
                        <button type="button" class="add-time-btn" @click="addNewDay()">
                            <i class="fa-solid fa-circle-plus"></i>
                            {{ $t('workingTime.add_new_time') }}
                        </button>
                    </div>
                    
                    <!-- Working Hours Validation Error -->
                    <p v-if="showWorkingHoursError" class="error-message text-danger mt-1">
                        الرجاء إضافة موعد واحد على الأقل قبل الحفظ
                    </p>

                    <!-- Saved Days List -->
                    <div class="days-list" v-if="savedDays.length > 0">
                        <div v-for="(day, index) in savedDays" :key="day.id" class="day-row saved-row">
                            <!-- Day Dropdown -->
                            <div class="day-dropdown-wrapper">
                                <Dropdown 
                                    v-model="day.dayName" 
                                    :options="daysOfWeek" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    :placeholder="$t('workingTime.select_day')" 
                                    class="day-dropdown" 
                                />
                                <i class="far fa-calendar dropdown-icon"></i>
                            </div>

                            <!-- Time From -->
                            <div class="time-input-wrapper">
                                <i class="far fa-clock time-icon-start"></i>
                                <flat-pickr 
                                    v-model="day.timeFrom" 
                                    :config="timePickrConfig" 
                                    class="custom-time"
                                    :placeholder="$t('workingTime.time_from')" 
                                />
                            </div>

                            <!-- Time To -->
                            <div class="time-input-wrapper">
                                <flat-pickr 
                                    v-model="day.timeTo" 
                                    :config="timePickrConfig" 
                                    class="custom-time"
                                    :placeholder="$t('workingTime.time_to')" 
                                />
                                <i class="far fa-clock time-icon-end"></i>
                            </div>

                            <!-- Delete Button -->
                            <button type="button" class="delete-icon-btn" @click="removeSavedDay(index)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t('menu.add_service') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('menu.service_added_successfully') }}
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Arabic } from "flatpickr/dist/l10n/ar";

const { t } = useI18n({ useScope: "global" });

// Page meta
definePageMeta({
    layout: "default",
    name: 'home.add_new_service'
});

const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("Sidebar.menu_list"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/Menu';
globalStore.subtitle = t('menu.add_new_service');

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
const employeeNameInput = ref('');
const employeesList = ref([]);
const employeeAttempted = ref(false);

// Employee validation
const employeeErrorMessage = computed(() => {
    if (!employeeAttempted.value) return '';
    
    const name = employeeNameInput.value.trim();
    if (!name) {
        return t('service.employee_required');
    }
    if (name.length < 10) {
        return t('service.employee_min_length');
    }
    return '';
});

const showEmployeeError = computed(() => {
    return employeeAttempted.value && employeeErrorMessage.value !== '';
});

// Validation for employees list on submit
const employeesListError = ref('');
const showEmployeesListError = computed(() => {
    return employeesListError.value !== '';
});

// Validation for working hours on submit
const workingHoursError = ref(false);
const showWorkingHoursError = computed(() => {
    return workingHoursError.value && savedDays.value.length === 0;
});

// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    bookingPrice: bookingPriceRef.value,
    descriptionAr: descriptionAr.value,
    descriptionEn: descriptionEn.value,
    maximumReservations: maximumReservations.value,
    durationImplementation: durationImplementation.value,
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

// Add employee to list
const addEmployee = () => {
    employeeAttempted.value = true;
    
    const name = employeeNameInput.value.trim();
    
    // Validate
    if (!name || name.length < 10) {
        return;
    }
    
    // Add employee to list
    employeesList.value.push(name);
    
    // Clear employees list error when adding employee
    employeesListError.value = '';
    
    // Reset input and validation state
    employeeNameInput.value = '';
    employeeAttempted.value = false;
};

// Remove employee from list
const removeEmployee = (index) => {
    employeesList.value.splice(index, 1);
};

// Working Hours State
const currentDay = ref({
    dayName: '',
    timeFrom: '',
    timeTo: ''
});

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

// Flatpickr config for time picker
const timePickrConfig = computed(() => ({
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: false,
    disableMobile: true,
    locale: import.meta.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
}));

// Add new day with validation
const addNewDay = () => {
    if (!currentDay.value.dayName) {
        return;
    }

    if (!currentDay.value.timeFrom) {
        return;
    }

    if (!currentDay.value.timeTo) {
        return;
    }

    const isDuplicate = savedDays.value.some(day =>
        day.dayName === currentDay.value.dayName &&
        day.timeFrom === currentDay.value.timeFrom &&
        day.timeTo === currentDay.value.timeTo
    );

    if (isDuplicate) {
        return;
    }

    savedDays.value.push({
        id: Date.now() + Math.random(),
        dayName: currentDay.value.dayName,
        timeFrom: currentDay.value.timeFrom,
        timeTo: currentDay.value.timeTo,
    });
    
    // Clear working hours error when adding a day
    workingHoursError.value = false;

    currentDay.value = {
        dayName: '',
        timeFrom: '',
        timeTo: ''
    };
};

// Remove saved day
const removeSavedDay = (index) => {
    savedDays.value.splice(index, 1);
};

// Submit table function
const submitTable = async () => {
    showValidation.value = true;
    
    // Validate employees list
    if (employeesList.value.length === 0) {
        employeesListError.value = t('service.employee_list_required');
    } else {
        employeesListError.value = '';
    }
    
    // Validate working hours
    if (savedDays.value.length === 0) {
        workingHoursError.value = true;
    } else {
        workingHoursError.value = false;
    }

    const isValid = isFormValid(formData.value, validations, imageUploader);

    if (!isValid || employeesList.value.length === 0 || savedDays.value.length === 0) {
        // If working hours is empty and other fields are valid, scroll to working hours section
        if (isValid && employeesList.value.length > 0 && savedDays.value.length === 0) {
            nextTick(() => {
                const workingHoursSection = document.querySelector('.working-hours-section');
                if (workingHoursSection) {
                    workingHoursSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
        // If employees list is empty and other fields are valid, scroll to employee section
        else if (isValid && employeesList.value.length === 0) {
            nextTick(() => {
                const employeeSection = document.querySelector('.employee-input-wrapper');
                if (employeeSection) {
                    employeeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        } 
        // Otherwise scroll to first error in form
        else {
            scrollToFirstError(formData.value, validations, imageUploader);
        }
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData(addTableForm.value);
            fd.append('image', uploadedImage.value);
            fd.append('number_of_available_reservations', maximumReservations.value);
            fd.append('duration', durationImplementation.value);
            
            // Add employees array
            employeesList.value.forEach((employee) => {
                fd.append('employees[]', employee);
            });
            
            // Add working hours
            savedDays.value.forEach((day, index) => {
                fd.append(`working_hours[${index}][day_name]`, day.dayName);
                fd.append(`working_hours[${index}][from]`, day.timeFrom);
                fd.append(`working_hours[${index}][to]`, day.timeTo);
            });
            
            const res = await axios.post('provider/services/store', fd, config.value);

            if (res.data.key === 'success') {
                successDialog.value = true;
                successToast(res.data.msg || t('menu.menu_added_successfully'));

                // Reset form on success
                setTimeout(() => {
                    successDialog.value = false;
                    navigateTo('/serviceMenu');
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

</script>

<style lang="scss" scoped>
.with-area {
    top: 20px;
}

// Employee input wrapper
.employee-input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    
    .employee-input {
        flex: 1;
        margin-bottom: 0;
    }
    
    .add-employee-btn {
        flex-shrink: 0;
        white-space: nowrap;
        margin-top: 0;
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
}

// Employees list
.employees-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    .employee-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }
        
        .employee-name {
            color: #fff;
            font-size: 15px;
            font-weight: 500;
        }
        
        .delete-employee-btn {
            background: rgba(220, 38, 38, 0.1);
            border: 1px solid rgba(220, 38, 38, 0.3);
            color: #DC2626;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-inline-start: 15px;
            &:hover {
                background: #DC2626;
                color: #fff;
                border-color: #DC2626;
            }
            
            i {
                font-size: 14px;
            }
        }
    }
}

// Responsive
@media (max-width: 768px) {
    .employee-input-wrapper {
        flex-direction: column;
        
        .add-employee-btn {
            width: 100%;
        }
    }
}

// Working Hours Styles
.working-hours-section {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 2px solid #3a3a3a;

    .current-input {
        margin-bottom: 24px;
    }

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

        .delete-icon-btn {
            background-color: transparent;
            border: none;
            color: #ff4444;
            font-size: 18px;
            cursor: pointer;
            padding: 8px 12px;
            transition: all 0.3s ease;
            border-radius: 8px;

            &:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
        }

        .add-time-btn {
            background: var(--background, #191919);
            border: none;
            color: #fff;
            padding: 13px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
            min-width: 160px;

            i {
                font-size: 20px;
            }
        }
    }
}

// Flatpickr custom styles
:deep(.custom-time) {
    height: 45px;
    border: none;
    background: transparent;
    color: #fff;
    width: 100%;
    padding: 0;
    cursor: pointer;
    font-size: 14px;

    &::placeholder {
        color: #999;
        font-size: 13px;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
}

// Dropdown styles
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

    &:hover {
        background-color: rgba(58, 58, 58, 0.8) !important;
    }

    &:focus {
        box-shadow: none !important;
        border: none !important;
    }
}

:deep(.day-dropdown-wrapper .p-dropdown-label) {
    color: #999 !important;
    padding-inline-start: 40px !important;
    font-size: 14px !important;
}

:deep(.p-dropdown-panel) {
    background-color: #2a2a2a;
    border: 1px solid #4a4a4a;

    .p-dropdown-items {
        .p-dropdown-item {
            color: #fff;
            padding: 12px 15px;

            &:hover {
                background-color: #3a3a3a;
            }

            &.p-highlight {
                background-color: var(--main-color, #ff6b35);
                color: #fff;
            }
        }
    }
}
</style>