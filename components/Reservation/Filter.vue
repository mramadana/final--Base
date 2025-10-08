<template>
    <div class="filter-component mb-4">
        <div class="row align-items-end">
            
            <!-- Search Input -->
            <div v-if="showSearch" class="col-12 col-md-4 mb-3">
                <label v-if="searchLabel" class="label mb-2">{{ searchLabel }}</label>
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
                        :label="selectLabel"
                        @change="handleSelectChange"
                    />
                </div>
    
                <!-- Calendar (Flatpickr) -->
                <div v-if="showCalendar" class="col-12 col-md-4 mb-3">
                    <label v-if="calendarLabel" class="label">{{ calendarLabel }}</label>
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
    searchLabel: {
        type: String,
        default: ''
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
    selectLabel: {
        type: String,
        default: ''
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
    calendarLabel: {
        type: String,
        default: ''
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
.filter-component {
    :deep(.dropdown-select) {
        .form-group {
            margin-bottom: 0;
        }
    }
    .main_input {
        position: relative;
        
        input {
            padding-inline-start: 20px;
            height: 100%;
            background: transparent;
            color: #fff;
            width: 100%;
            
            &::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
        }
        
        .search-icon, .calendar-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
            pointer-events: none;
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
        color: rgba(255, 255, 255, 0.5);
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