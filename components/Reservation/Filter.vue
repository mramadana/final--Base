<template>
    <div class="filter-component mb-4">
        <div class="row align-items-end">
            
            <!-- Search Input -->
            <div v-if="showSearch" class="col-12 col-md-4 mb-3">
                <div class="main_input">
                    <input 
                        type="text" 
                        class="" 
                        :placeholder="searchPlaceholder"
                        :value="modelValue?.search"
                        @input="handleSearchChange"
                    />
                    <i class="fas fa-search search-icon"></i>
                </div>
            </div>

            <div class="col-12 col-md-8 d-flex justify-content-end gap-3">

                <!-- Select Dropdown -->
                <div v-if="showSelect" class="col-12 col-md-3 mb-3 dropdown-select">
                    <GlobalCustomDropdown
                        v-model="selectedOption"
                        :options="selectOptions"
                        :option-value="optionValue"
                        :placeholder="selectPlaceholder"
                        @change="handleSelectChange"
                    />
                </div>
    
                <!-- Calendar (Flatpickr) -->
                <div v-if="showCalendar" class="col-12 col-md-4 mb-3">
                    <div class="main_input">
                        <flat-pickr
                            v-model="dateValue"
                            :config="flatpickrConfig"
                            class="custom-date"
                            :placeholder="calendarPlaceholder"
                            @on-change="handleDateChange"
                        />
                        <i class="far fa-calendar calendar-icon"></i>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Arabic } from "flatpickr/dist/l10n/ar";

// Props
const props = defineProps({
    // Model value for two-way binding
    modelValue: {
        type: Object,
        default: () => ({
            search: '',
            select: null,
            date: null
        })
    },
    
    // Show/Hide controls
    showSearch: {
        type: Boolean,
        default: true
    },
    
    showSelect: {
        type: Boolean,
        default: true
    },
    showCalendar: {
        type: Boolean,
        default: true
    },
    
    // Search props
    searchPlaceholder: {
        type: String,
        default: 'ابحث هنا...'
    },
    
    // Select props
    selectOptions: {
        type: Array,
        default: () => []
    },
    selectPlaceholder: {
        type: String,
        default: 'اختر من القائمة'
    },
    optionLabel: {
        type: String,
        default: 'name'
    },
    optionValue: {
        type: String,
        default: null
    },
    
    // Calendar props
    calendarPlaceholder: {
        type: String,
        default: 'اختر التاريخ'
    },
    calendarMode: {
        type: String,
        default: 'single', // 'single', 'range', 'multiple'
    },
    minDate: {
        type: String,
        default: null
    },
    maxDate: {
        type: String,
        default: null
    }
});

// Emits
const emit = defineEmits(['update:modelValue', 'search', 'select-change', 'date-change']);

// Local state
const selectedOption = ref(props.modelValue?.select || null);
const dateValue = ref(props.modelValue?.date || null);

// Flatpickr config
const flatpickrConfig = computed(() => ({
    mode: props.calendarMode,
    wrap: false,
    altInput: true,
    altFormat: 'Y-m-d',
    dateFormat: 'Y-m-d',
    disableMobile: true,
    locale: process.client ? (localStorage.getItem("locale") === "en" ? "default" : Arabic) : Arabic,
    minDate: props.minDate,
    maxDate: props.maxDate,
}));

// Handle search input
const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    const newValue = {
        ...props.modelValue,
        search: searchValue
    };
    emit('update:modelValue', newValue);
    emit('search', searchValue);
};

// Handle select change
const handleSelectChange = () => {
    const newValue = {
        ...props.modelValue,
        select: selectedOption.value
    };
    emit('update:modelValue', newValue);
    emit('select-change', selectedOption.value);
};

// Handle date change
const handleDateChange = (selectedDates, dateStr) => {
    const newValue = {
        ...props.modelValue,
        date: dateStr
    };
    emit('update:modelValue', newValue);
    emit('date-change', dateStr);
};

// Watch for external changes
watch(() => props.modelValue?.select, (newVal) => {
    selectedOption.value = newVal;
});

watch(() => props.modelValue?.date, (newVal) => {
    dateValue.value = newVal;
});

</script>

<style lang="scss" scoped>
:deep(.dropdown_card .p-dropdown-label) {
    color: #fff;
}
:deep(.dropdown_card) {
    background-color: #3a3a3a !important;
}
:deep(.dropdown_card .p-dropdown) {
    background-color: #3a3a3a !important;
}
:deep(.p-icon) {
    color: #fff;
}

.filter-component {
    :deep(.dropdown-select) {
        .form-group {
            margin-bottom: 0;
        }
    }
    .main_input {
        position: relative;
        background-color: #3a3a3a !important;
        input {
            padding-inline-start: 20px;
            height: 100%;
            background: transparent;
            color: #fff;
            width: 100%;
            
            &::placeholder {
                color: #fff;
            }
            
        }
        
        .search-icon, .calendar-icon {
            position: absolute;
            inset-inline-end: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
            pointer-events: none;
            font-size: 15px;
        }
    }
    
    .label {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
    }
}

:deep(.custom-date) {
    height: 45px;
    border: none;
    background: transparent;
    color: #fff;
    border-radius: 8px;
    padding-inline-start: 20px;
    cursor: pointer;
    &::placeholder {
        color: #fff;
        font-size: 12px;
    }
    
    &:focus {
        outline: none;
        box-shadow: none;
    }

    .form-control {
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
    }
}

</style>