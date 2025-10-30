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

        <!-- Booking Schedule Section -->
        <div class="layout-form add-calender">
            <div class="d-flex align-items-center justify-content-between mb-4">
                    <h2 class="section-title">{{ $t('tables.booking_schedule') || 'جدول الحجز' }}</h2>
                    <div class="form-check">
                        <input 
                            type="checkbox" 
                            class="form-check-input" 
                            id="selectDay"
                            v-model="selectDayEnabled"
                        >
                        <label class="form-check-label" for="selectDay">
                            {{ $t('tables.select_day') || 'اختر اليوم' }}
                        </label>
                    </div>
                </div>

                <!-- Days List -->
                <div class="days-list">
                    <div 
                        v-for="(day, index) in bookingDays" 
                        :key="index"
                        class="day-item mb-3"
                    >
                        <div class="day-header d-flex align-items-center justify-content-between mb-3">
                            <div class="day-info">
                                <!-- Day Dropdown -->
                                <Dropdown 
                                    v-model="day.dayName" 
                                    :options="daysOfWeek" 
                                    optionLabel="label"
                                    optionValue="value"
                                    :placeholder="$t('tables.select_day_name') || 'اليوم'"
                                    class="day-dropdown"
                                />
                            </div>
                            
                            <div class="d-flex align-items-center gap-3">
                                <!-- Available Checkbox -->
                                <div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        :id="`available-${index}`"
                                        v-model="day.available"
                                    >
                                    <label class="form-check-label" :for="`available-${index}`">
                                        {{ $t('tables.available') || 'متاح' }}
                                    </label>
                                </div>
                                
                                <!-- Delete Button -->
                                <button 
                                    type="button" 
                                    class="delete-btn"
                                    @click="removeDay(index)"
                                    :disabled="bookingDays.length === 1"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Time Range -->
                        <div class="time-range row">
                            <div class="col-12 col-md-6 mb-3">
                                <label class="time-label">{{ $t('tables.from') || 'من' }}</label>
                                <div class="main_input time-input">
                                    <flat-pickr
                                        v-model="day.timeFrom"
                                        :config="timePickrConfig"
                                        class="custom-time"
                                        :placeholder="$t('tables.time_placeholder') || '0 : 0 م'"
                                    />
                                    <i class="far fa-clock time-icon"></i>
                                </div>
                            </div>
                            
                            <div class="col-12 col-md-6 mb-3">
                                <label class="time-label">{{ $t('tables.to') || 'إلى' }}</label>
                                <div class="main_input time-input">
                                    <flat-pickr
                                        v-model="day.timeTo"
                                        :config="timePickrConfig"
                                        class="custom-time"
                                        :placeholder="$t('tables.time_placeholder') || '0 : 0 م'"
                                    />
                                    <i class="far fa-clock time-icon"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Checkbox for marking as reserved -->
                        <div class="form-check mt-2" v-if="!day.available">
                            <input 
                                type="checkbox" 
                                class="form-check-input" 
                                :id="`reserved-${index}`"
                                v-model="day.reservedExternally"
                            >
                            <label class="form-check-label small-label" :for="`reserved-${index}`">
                                {{ $t('tables.mark_as_reserved') || 'تعيين كموعد محجوز' }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Add New Day Button -->
                <button 
                    type="button" 
                    class="add-day-btn mb-4"
                    @click="addNewDay"
                >
                    <i class="fas fa-plus"></i>
                    {{ $t('tables.add_new_time') || 'إضافة موعد جديد' }}
                </button>

                <!-- Submit Table Button -->
                <button 
                    type="button" 
                    class="custom-btn w-100"
                    @click="submitTableWithSchedule"
                    :disabled="loading"
                >
                    {{ $t('tables.add_table') || 'اضف الطاولة' }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
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
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Arabic } from "flatpickr/dist/l10n/ar";
import Dropdown from 'primevue/dropdown';

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

// Booking Schedule State
const selectDayEnabled = ref(false);
const bookingDays = ref([
    {
        dayName: '',
        available: true,
        timeFrom: '',
        timeTo: '',
        reservedExternally: false
    }
]);

// Days of week options
const daysOfWeek = ref([
    { label: 'الأحد', value: 'sunday' },
    { label: 'الاثنين', value: 'monday' },
    { label: 'الثلاثاء', value: 'tuesday' },
    { label: 'الأربعاء', value: 'wednesday' },
    { label: 'الخميس', value: 'thursday' },
    { label: 'الجمعة', value: 'friday' },
    { label: 'السبت', value: 'saturday' }
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

// Add new day
const addNewDay = () => {
    bookingDays.value.push({
        dayName: '',
        available: true,
        timeFrom: '',
        timeTo: '',
        reservedExternally: false
    });
};

// Remove day
const removeDay = (index) => {
    if (bookingDays.value.length > 1) {
        bookingDays.value.splice(index, 1);
    }
};

// Submit table with schedule
const submitTableWithSchedule = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations, imageUploader);

    if (!isValid) {
        scrollToFirstError(formData.value, validations, imageUploader);
        console.log("Validation Failed");
        return;
    }

    loading.value = true;

    try {
        const fd = new FormData(addTableForm.value);
        fd.append('logo', uploadedImage.value);
        
        // Add booking schedule data
        fd.append('booking_schedule', JSON.stringify(bookingDays.value));
        fd.append('select_day_enabled', selectDayEnabled.value);

        const res = await axios.post('tables', fd);
        
        successDialog.value = true;
        successToast("تم إضافة الطاولة بنجاح");

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

// Booking Schedule Styles
.add-calender {
    margin-top: 30px;
    
    .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        margin: 0;
    }
    
    .form-check {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .form-check-input {
            width: 18px;
            height: 18px;
            cursor: pointer;
            border: 2px solid #666;
            background-color: transparent;
            
            &:checked {
                background-color: var(--main-color, #ff6b35);
                border-color: var(--main-color, #ff6b35);
            }
        }
        
        .form-check-label {
            font-size: 14px;
            color: #fff;
            cursor: pointer;
            margin: 0;
            
            &.small-label {
                font-size: 13px;
                color: #ccc;
            }
        }
    }
    
    .days-list {
        .day-item {
            background-color: #2a2a2a;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #3a3a3a;
            
            .day-header {
                .day-info {
                    flex: 1;
                }
            }
            
            .delete-btn {
                background-color: transparent;
                border: none;
                color: #ff4444;
                font-size: 18px;
                cursor: pointer;
                padding: 8px;
                transition: all 0.3s ease;
                
                &:hover:not(:disabled) {
                    color: #ff6666;
                    transform: scale(1.1);
                }
                
                &:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            }
        }
    }
    
    .time-range {
        .time-label {
            font-size: 14px;
            color: #ccc;
            margin-bottom: 8px;
            display: block;
        }
        
        .time-input {
            position: relative;
            background-color: #3a3a3a;
            border-radius: 8px;
            
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
    }
    
    .add-day-btn {
        width: 100%;
        background-color: transparent;
        border: 2px dashed #666;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        
        &:hover {
            border-color: var(--main-color, #ff6b35);
            color: var(--main-color, #ff6b35);
        }
        
        i {
            font-size: 16px;
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
    padding-inline-start: 15px;
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

// Dropdown styles
:deep(.day-dropdown) {
    width: 200px;
    
    .p-dropdown {
        background-color: #3a3a3a;
        border: 1px solid #4a4a4a;
        border-radius: 8px;
        color: #fff;
        
        .p-dropdown-label {
            color: #fff;
            padding: 10px 15px;
        }
        
        .p-dropdown-trigger {
            color: #fff;
        }
    }
}

:deep(.p-dropdown-panel) {
    background-color: #2a2a2a;
    border: 1px solid #4a4a4a;
    
    .p-dropdown-items {
        .p-dropdown-item {
            color: #fff;
            
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