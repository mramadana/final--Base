<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('appointments.add_appointment') }}
        </h1>
        <div class="layout-form">

            <!-- Add Appointment Form -->
            <form @submit.prevent="submitAppointment" ref="addAppointmentFormRef">

                <!-- Available Date -->
                <div class="form-group">
                    <label class="label">{{ $t('appointments.available_date') }}</label>
                    <div class="date-input-wrapper">
                        <i class="far fa-calendar date-icon"></i>
                        <flat-pickr 
                            v-model="availableDateRef" 
                            :config="datePickrConfig" 
                            class="custom-date"
                            :placeholder="$t('appointments.select_date')" 
                        />
                    </div>
                </div>

                <!-- Available Time -->
                <div class="form-group">
                    <label class="label">{{ $t('appointments.available_time') }}</label>
                    <div class="time-input-wrapper">
                        <i class="far fa-clock time-icon-start"></i>
                        <flat-pickr 
                            v-model="availableTimeRef" 
                            :config="timePickrConfig" 
                            class="custom-time"
                            :placeholder="$t('appointments.select_time')" 
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- Number of People -->
                        <FormInput 
                            v-model:modelValue="numberOfPeopleRef"
                            name="numberOfPeople" 
                            type="number"
                            :placeholder="$t('appointments.number_of_people')"
                            :validation-schema="validations.numberOfPeople"
                            :showErrors="showValidationRef"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/users.svg"
                            :with_icon="true"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <!-- Customer Name -->
                        <FormInput 
                            v-model:modelValue="customerNameRef"
                            name="customerName" 
                            type="text"
                            :placeholder="$t('appointments.customer_name')"
                            :validation-schema="validations.customerName"
                            :showErrors="showValidationRef"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/user.svg"
                            :with_icon="true"
                        />
                    </div>
                </div>

                <!-- Phone Number -->
                <div class="form-group">
                    <label class="label">
                        {{ $t("Auth.mobile_number") }}
                    </label>
                    <div class="with_cun_select" 
                         :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                        <FormInput 
                            ref="phoneInputRef" 
                            v-model:modelValue="phoneRef" 
                            name="phone" 
                            type="number"
                            :placeholder="$t('Auth.enter_mobile_number')" 
                            :validation-schema="validations.phone"
                            :showErrors="showValidationRef" 
                            :moveErrorToParent="true" 
                            :hasIcon="true" 
                            icon="/_nuxt/assets/images/auth-img/mobile.svg"
                            :with_icon="true" 
                        />
                    </div>
                    <!-- Display validation error message for phone -->
                    <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1" 
                       :class="phoneInputRef?.localeDir">
                        {{ phoneInputRef?.errorMessage }}
                    </p>
                </div>

                <!-- Notes -->
                <div class="form-group">
                    <label class="label">{{ $t('appointments.notes') }}</label>
                    <div class="position-relative with_icon">
                        <textarea 
                            v-model="notesRef"
                            @input="notesTouchedRef = true"
                            name="notes" 
                            class="main_input main_area"
                            :class="{ 'is-invalid': notesError }"
                            :placeholder="$t('appointments.add_notes')"
                            rows="4"
                        ></textarea>
                        <img src="@/assets/images/file-img.svg" alt="icon" class="input-icon with-area" />
                    </div>
                    <p v-if="notesError" class="error-message text-danger mt-1">
                        {{ notesError }}
                    </p>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="custom-btn md" :disabled="loadingRef">
                    {{ $t('appointments.add_appointment') }}
                    <span class="spinner-border spinner-border-sm" v-if="loadingRef" role="status" aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialogRef" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('appointments.success_add_appointment') }}
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

const globalStore = useGlobalStore();
// Set global store
const pageHeadTitle = ref(t("appointments.add_appointment"));
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = null;
globalStore.subtitle = t('appointments.add_new_appointment');

// Axios
const axios = useApi();

// Validation schemas
const {
    numberOfPeople,
    customerName,
    phoneNumber,
    Notes
} = useValidationSchema();

// Validation schemas
const validations = {
    numberOfPeople: numberOfPeople(t('appointments.number_of_people')),
    customerName: customerName(t('appointments.customer_name')),
    phone: phoneNumber(t('Auth.mobile_number')),
    notes: Notes(t('appointments.notes')),
};

// Toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

// Form state
const loadingRef = ref(false);
const showValidationRef = ref(false);
const successDialogRef = ref(false);
const addAppointmentFormRef = ref(null);

// Form fields
const availableDateRef = ref(null);
const availableTimeRef = ref(null);
const numberOfPeopleRef = ref(null);
const customerNameRef = ref(null);
const phoneRef = ref(null);
const notesRef = ref('');
const notesTouchedRef = ref(false);

// Refs for validation
const phoneInputRef = ref(null);

// Flatpickr config for date picker
const datePickrConfig = computed(() => ({
    enableTime: false,
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true,
    locale: import.meta.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
}));

// Flatpickr config for time picker
const timePickrConfig = computed(() => ({
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: false,
    disableMobile: true,
    locale: import.meta.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
}));

// Form data for validation
const formData = computed(() => ({
    numberOfPeople: numberOfPeopleRef.value,
    customerName: customerNameRef.value,
    phone: phoneRef.value,
    notes: notesRef.value
}));

// Notes validation error
const notesError = computed(() => 
    getValidationError('notes', notesRef.value, notesTouchedRef.value)
);

// Helper function to get validation error
const getValidationError = (field, value, touched) => {
    if (!showValidationRef.value && !touched) return '';
    try {
        validations[field].validateSync(value);
        return '';
    } catch (error) {
        return error.message;
    }
};

// Use the composable for validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Submit appointment function
const submitAppointment = async () => {
    showValidationRef.value = true;

    const isValid = isFormValid(formData.value, validations, phoneInputRef);

    if (!isValid) {
        scrollToFirstError(formData.value, validations, phoneInputRef);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loadingRef.value = true;

        try {
            const fd = new FormData(addAppointmentFormRef.value);
            fd.append('available_date', availableDateRef.value);
            fd.append('available_time', availableTimeRef.value);
            fd.append('number_of_people', numberOfPeopleRef.value);
            fd.append('customer_name', customerNameRef.value);
            fd.append('phone', phoneRef.value);
            fd.append('notes', notesRef.value);
            
            const res = await axios.post('provider/appointments/store', fd, config.value);

            successDialogRef.value = true;
            successToast(t('appointments.success_add_appointment'));

            // Reset form on success
            setTimeout(() => {
                successDialogRef.value = false;
                navigateTo('/appointments');
            }, 2000);

        } catch (error) {
            console.error("Add appointment error:", error);
            errorToast("حدث خطأ أثناء إضافة الموعد");
        } finally {
            loadingRef.value = false;
        }
    }
};

// Page meta
definePageMeta({
    name: "appointments.add_appointment",
    layout: "default",
});
</script>

<style lang="scss" scoped>
// Date and Time Input Styles
.date-input-wrapper,
.time-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #3a3a3a;
    border-radius: 8px;
    padding: 0 12px;
    height: 45px;
    margin-bottom: 1rem;

    .date-icon,
    .time-icon-start {
        color: #999;
        font-size: 16px;
        pointer-events: none;
        margin-inline-end: 8px;
    }
}

.with_cun_select {
    position: relative;
    background-color: #3a3a3a;
    border-radius: 8px;
    padding: 0;
    height: 45px;
    margin-bottom: 1rem;

    &.is-invalid {
        border: 1px solid #dc3545;
    }
}

// Flatpickr custom styles
:deep(.custom-date),
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

// Form group styles
.form-group {
    margin-bottom: 1.5rem;
}

.label {
    display: block;
    margin-bottom: 0.5rem;
    color: #fff;
    font-weight: 500;
}

// Textarea styles
.with-area {
    top: 20px;
}

// Error message styles
.error-message {
    font-size: 12px;
    margin-top: 0.25rem;
    
    &.text-danger {
        color: #dc3545;
    }
    
    &.text-start {
        text-align: start;
    }
    
    &.text-end {
        text-align: end;
    }
}
</style>