<template>
    <div class="appointment-page">
        <h1 class="main-title bold md mb-5">
            {{ $t('workingTime.add_appointment_title') }}
        </h1>

        <div class="layout-form">
            <form @submit.prevent="submitAppointment" ref="appointmentForm">

                <div class="row">
                    <!-- Available Date -->
                    <div class="col-12 col-md-6 mb-4">
                        <label class="label">{{ $t('workingTime.available_date') }}</label>
                        <div class="main_input" :class="{ 'is-invalid': showValidation && !dateValue }">
                            <flat-pickr v-model="dateValue" :config="flatpickrConfig" class="custom-date"
                                :placeholder="$t('workingTime.choose_date')" @on-change="handleDateChange" />
                            <i class="far fa-calendar calendar-icon"></i>
                        </div>
                        <p v-if="showValidation && !dateValue" class="error-message text-danger mt-1">
                            {{ $t('workingTime.date_required') }}
                        </p>
                    </div>

                    <!-- Available Time -->
                    <div class="col-12 col-md-6 mb-4">
                        <div class="special_sppiner position-relative">
                            <GlobalCustomDropdown v-model="timeValue" :options="availableTimeOptions"
                                option-value="time_value" option-label="time_text"
                                :placeholder="$t('workingTime.choose_time')" :label="$t('workingTime.available_time')"
                                :showValidation="showValidation" :validationSchema="validations.time"
                                :disabled="!dateValue || loadingTimeOptions" />

                                <div v-if="loadingTimeOptions"
                                    class="d-flex align-items-center gap-2 text-muted mt-2 dropdown-loader">
                                    <span class="spinner-border spinner-border-sm"></span>
                                    <small>{{ $t('workingTime.loading_times') }}</small>
                                </div>
                        </div>
                    </div>

                    <!-- Number of People -->
                    <FormInput v-model:modelValue="numberOfPeopleRef" name="people_number" type="number" min="1"
                        :label="$t('tables.number_of_people')" :placeholder="$t('tables.number_of_people')"
                        :validation-schema="validations.numberOfPeople" :showErrors="showValidation" />

                    <!-- Customer Name -->
                    <div class="col-12 col-md-6">
                        <FormInput v-model:modelValue="customerNameRef" name="name" type="text"
                            :label="$t('workingTime.customer_name')" :placeholder="$t('workingTime.customer_name')"
                            :validation-schema="validations.customerName" :showErrors="showValidation" />
                    </div>

                    <!-- Mobile Number -->
                    <div class="col-12 col-md-6">
                        <FormInput v-model:modelValue="phoneNumberRef" name="phone" type="tel"
                            :label="$t('workingTime.phone_number')" :placeholder="$t('workingTime.phone_number')"
                            :validation-schema="validations.phoneNumber" :showErrors="showValidation" />
                    </div>

                    <!-- Notes -->
                    <div class="form-group">
                        <label class="label">{{ $t('workingTime.notes') }}</label>
                        <div class="position-relative with_icon">
                            <textarea v-model="notes" @input="notesTouched = true" name="notes"
                                class="main_input main_area" :class="{ 'is-invalid': notesError }"
                                :placeholder="$t('workingTime.notes')" rows="4"></textarea>
                            <img src="@/assets/images/file-img.svg" alt="icon" class="input-icon with-area" />
                        </div>
                        <p v-if="notesError" class="error-message text-danger mt-1">
                            {{ notesError }}
                        </p>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t('workingTime.save_appointment') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                        aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('workingTime.appointment_saved_success') }}
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
const store = useAuthStore();
const { token } = storeToRefs(store);

// config
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` }
}));

const pageHeadTitle = ref(t("Sidebar.tables"));
// Set global store
globalStore.title = pageHeadTitle.value;
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/tables';
globalStore.subtitle = t('sideMenu.add_new_table');

// Get tableId from URL
const route = useRoute();
const tableId = ref(route.query.tableId || null);

// Axios
const axios = useApi();

// Validation schemas
const {
    customerName,
    phoneNumber,
    numberOfPeople,
    Notes,
    date,
    time,
} = useValidationSchema();

// Validation schemas object
const validations = {
    date: date(t('workingTime.available_date')),
    time: time(t('workingTime.available_time')),
    customerName: customerName(t('workingTime.customer_name')),
    phoneNumber: phoneNumber(t('workingTime.phone_number')),
    numberOfPeople: numberOfPeople(t('tables.number_of_people')),
    notes: Notes(t('workingTime.notes')),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state
const loading = ref(false);
const showValidation = ref(false);
const successDialog = ref(false);
const appointmentForm = ref(null);

// Form fields
const dateValue = ref('');
const timeValue = ref('');
const customerNameRef = ref('');
const phoneNumberRef = ref('');
const numberOfPeopleRef = ref('');
const notes = ref('');

// Touched states
const notesTouched = ref(false);

// Time options state
const availableTimeOptions = ref([]);
const loadingTimeOptions = ref(false);

// Form data computed
const formData = computed(() => ({
    date: dateValue.value || '',
    time: typeof timeValue.value === 'object'
        ? timeValue.value.value
        : timeValue.value,
    customerName: customerNameRef.value,
    phoneNumber: phoneNumberRef.value,
    numberOfPeople: numberOfPeopleRef.value,
    notes: notes.value
}));





// Use validation composable
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
const notesError = computed(() =>
    getValidationError('notes', notes.value, notesTouched.value)
);

// Flatpickr config for date picker
const flatpickrConfig = computed(() => ({
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true,
    locale: import.meta.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
}));

// Handle date change
const handleDateChange = async (selectedDates, dateStr) => {
    dateValue.value = dateStr;
    console.log("5656656565656565", dateStr)
    if (dateStr) {
        console.log("3333333333333333")
        await fetchAvailableTimeSlots(dateStr);
    } else {
        availableTimeOptions.value = [];
        timeValue.value = null;
    }
};

// Fetch available time slots from API
const fetchAvailableTimeSlots = async (date) => {
    if (!date || !tableId.value) return;

    loadingTimeOptions.value = true;
    availableTimeOptions.value = [];
    timeValue.value = null;

    try {
        const res = await axios.get(`provider/tables/${tableId.value}/get-available-hours-at-date?date=${date}`, config.value);

        if (res.data.key === 'success') {
            // Filter only available times
            availableTimeOptions.value = res?.data?.data.available_hours
                .filter(slot => slot.availability === 'available')
                .map(slot => ({
                    ...slot,
                    name: slot.time_text,        // للعرض
                    value: slot.time_value       // للقيمة اللي هتتحفظ
                }));
        }
        loadingTimeOptions.value = false;
    } catch (error) {
        console.error('Fetch time slots error:', error);
        errorToast('حصل خطأ في تحميل الأوقات المتاحة');
    } finally {
        loadingTimeOptions.value = false;
    }
};

// Submit appointment
const submitAppointment = async () => {
    showValidation.value = true;

    // Validate form fields
    const isValid = isFormValid(formData.value, validations);

    if (!isValid) {
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
        return;
    }

    loading.value = true;

    try {

        const fd = new FormData(appointmentForm.value);
        fd.append('date', dateValue.value);
        const rawTime =
            typeof timeValue.value === 'object'
                ? timeValue.value.value
                : timeValue.value;

        // "15:00:00" → "15:00"
        const formattedTime = rawTime?.slice(0, 5);

        fd.append('time', formattedTime);

        const res = await axios.post(`provider/tables/${tableId.value}/reservations/external`, fd, config.value);
        if (res.data.key === 'success') {
            successToast(res.data.msg);
            successDialog.value = true;
            // Reset form and redirect
            setTimeout(() => {
                successDialog.value = false;
                navigateTo('/tables');
            }, 2000);
        } else {
            errorToast(res.data.msg);
            console.log(res.data.msg, "65656565");
        }

        // API call
        // const res = await axios.post('appointments', appointmentData);


        // successDialog.value = true;
        // successToast(t('workingTime.appointment_saved_success'));

        // Reset form and redirect
        // setTimeout(() => {
        //     successDialog.value = false;
        //     navigateTo('/tables');
        // }, 2000);

    } catch (error) {
        console.error("Add appointment error:", error);
        // errorToast(t('workingTime.messages.save_error'));
    } finally {
        loading.value = false;
    }
};

// Watch for query params changes
watch(() => route.query.tableId, (newId) => {
    if (newId) {
        tableId.value = newId;
    }
});

// Page meta
definePageMeta({
    name: "workingTime.add_appointment_title",
    layout: "default",
});
</script>

<style lang="scss" scoped>
.appointment-page {
    .with-area {
        top: 20px;
    }

    .main_input {
        position: relative;
        display: flex;
        align-items: center;
        background-color: #2a2a2a;
        border-radius: 8px;
        border: 1px solid #3a3a3a;
        padding: 0 15px;
        transition: all 0.3s ease;

        &.is-invalid {
            border-color: #dc3545;
        }

        .calendar-icon,
        .time-icon {
            position: absolute;
            inset-inline-end: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            pointer-events: none;
            font-size: 16px;
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
        padding-inline-start: 0;
        padding-inline-end: 40px;
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

    .error-message {
        font-size: 13px;
        margin-top: 5px;
    }
}

.dropdown-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    transform: translateY(27px);
    box-shadow: 0px 0px 2px #D9D9D9;
    background-color: #787878;
    border-radius: 10px;
}
</style>