<template>
    <div>
        <h1 class="main-title bold md mb-5">
            {{ $t('workingTime.page_title') }}
        </h1>

        <!-- Booking Schedule Section -->
        <div class="layout-form add-calender">
            <!-- Current Input Row (الـ row للإدخال) -->
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
                <button 
                    type="button" 
                    class="add-time-btn"
                    @click="addNewDay()">
                    <i class="fa-solid fa-circle-plus"></i>
                    {{ $t('workingTime.add_new_time') }}
                </button>
            </div>

            <!-- Saved Days List (قابلة للتعديل) -->
            <div class="days-list" v-if="savedDays.length > 0">
                <div 
                    v-for="(day, index) in savedDays" 
                    :key="day.id"
                    class="day-row saved-row"
                >
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
                    <button 
                        type="button" 
                        class="delete-icon-btn"
                        @click="removeSavedDay(index)"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            <!-- Save Working Time Button -->
            <button 
                type="button" 
                class="custom-btn md"
                @click="saveWorkingTime"
                :disabled="loading"
            >
                {{ $t('workingTime.save_working_time') }}
                <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
            </button>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    {{ $t('workingTime.success_saved') }}
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

// Axios
const axios = useApi(); 

// Toast
const { successToast, errorToast } = toastMsg();

// State
const loading = ref(false);
const successDialog = ref(false);

// Booking Schedule State
const selectDayEnabled = ref(false);

// Current input row (للإدخال الجديد)
const currentDay = ref({
    dayName: '',
    timeFrom: '',
    timeTo: ''
});

// Saved days (المواعيد المحفوظة - editable)
const savedDays = ref([]);

// Days of week options
const daysOfWeek = computed(() => [
    { label: t('workingTime.days.saturday'), value: 'saturday' },
    { label: t('workingTime.days.sunday'), value: 'sunday' },
    { label: t('workingTime.days.monday'), value: 'monday' },
    { label: t('workingTime.days.tuesday'), value: 'tuesday' },
    { label: t('workingTime.days.wednesday'), value: 'wednesday' },
    { label: t('workingTime.days.thursday'), value: 'thursday' },
    { label: t('workingTime.days.friday'), value: 'friday' },
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
    console.log('Current Day Data:', currentDay.value);
    console.log('Saved days before:', savedDays.value);
    
    // Validate current input
    if (!currentDay.value.dayName) {
        errorToast(t('workingTime.validation.select_day_first'));
        return;
    }
    
    if (!currentDay.value.timeFrom) {
        errorToast(t('workingTime.validation.select_time_from'));
        return;
    }
    
    if (!currentDay.value.timeTo) {
        errorToast(t('workingTime.validation.select_time_to'));
        return;
    }
    
    // التحقق من عدم وجود نفس اليوم بنفس الوقت
    const isDuplicate = savedDays.value.some(day => 
        day.dayName === currentDay.value.dayName &&
        day.timeFrom === currentDay.value.timeFrom &&
        day.timeTo === currentDay.value.timeTo
    );
    
    if (isDuplicate) {
        errorToast(t('workingTime.validation.duplicate_time'));
        return;
    }
    
    // حفظ البيانات في saved days
    savedDays.value.push({
        id: Date.now() + Math.random(),
        dayName: currentDay.value.dayName,
        timeFrom: currentDay.value.timeFrom,
        timeTo: currentDay.value.timeTo,
        available: true,
        reservedExternally: false
    });
    
    // Reset الـ current input
    currentDay.value = {
        dayName: '',
        timeFrom: '',
        timeTo: ''
    };
    
    console.log('Saved days after:', savedDays.value);
    successToast(t('workingTime.messages.time_added'));
};

// Remove saved day
const removeSavedDay = (index) => {
    savedDays.value.splice(index, 1);
    successToast(t('workingTime.messages.time_deleted'));
};

// Save working time
const saveWorkingTime = async () => {
    loading.value = true;

    try {
        const payload = {
            booking_schedule: savedDays.value,
            select_day_enabled: selectDayEnabled.value
        };

        const res = await axios.post('working-time', payload);
        
        if (res.status === 200 || res.status === 201) {
            successDialog.value = true;
            setTimeout(() => {
                successDialog.value = false;
            }, 2000);
        }
    } catch (error) {
        console.error("Save working time error:", error);
        errorToast(t('workingTime.messages.save_error'));
    } finally {
        loading.value = false;
    }
};

// Fetch working time on mount
const fetchWorkingTime = async () => {
    try {
        const res = await axios.get('working-time');
        if (res.data && res.data.booking_schedule) {
            // Load saved data with unique IDs
            savedDays.value = res.data.booking_schedule.map((day, index) => ({
                ...day,
                id: day.id || Date.now() + index
            }));
            selectDayEnabled.value = res.data.select_day_enabled || false;
        }
    } catch (error) {
        console.error("Fetch working time error:", error);
    }
};

// Load data on mount
onMounted(() => {
    fetchWorkingTime();
});

// Page meta
definePageMeta({
    name: "workingTime.page_title",
    layout: "default",
});

</script>

<style lang="scss" scoped>
// Booking Schedule Styles
.add-calender {
    padding-bottom: 25px;
    // Current Input Row
    .current-input {
        margin-bottom: 24px;
    }
    
    .days-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
    }
    
    .day-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 20px;
        border-bottom: 2px solid #3a3a3a;
        // Day Dropdown Wrapper
        .day-dropdown-wrapper {
            position: relative;
            flex-grow: 1;
            min-width: 350px;
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
        
        // Time Input Wrappers
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
        
        // Delete Button
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
        
        // Add Time Button
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
    border: none !important;
    &:hover {
        background-color: rgba(58, 58, 58, 0.8) !important;
    }
    
    &:focus {
        box-shadow: none !important;
        border: none !important;
    }
}

:deep(.p-dropdown-label) {
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