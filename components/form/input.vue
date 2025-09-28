<template>
  <div class="form-group">
    <label :for="name" class="label" :style="{ color: labelColor }">{{ label }}</label>
    <span v-if="subLabel" class="sub-label ms-1" :style="{ color: subLabelColor }">{{ subLabel }}</span>
    <div class="input-wrapper">

      <template v-if="readonly">
        <div class="position-relative" :class="{ 'with_icon': with_icon }">
          <input 
            :value="value"
            :type="type" 
            :name="name"
            readonly
            class="main_input"
          />
          <img v-if="icon" :src="icon" alt="icon" class="input-icon position-absolute top-50" :class="localeDir" />
        </div>
      </template>

      <template v-else>
        <div class="position-relative" :class="{ 'with_icon': with_icon }">
          <input 
            v-model="modelValue"
            :type="type" 
            :name="name" 
            :placeholder="placeholder" 
            class="main_input"
            :class="{ 'is-invalid': showErrors && hasError }"
          />
          <img v-if="icon" :src="icon" alt="icon" class="input-icon position-absolute top-50" :class="localeDir" />
        </div>
  
        <!-- Display validation error message -->
        <p v-if="showErrors && hasError" class="error-message text-danger" :class="localeDir">{{ errorMessage }}</p>
      </template>
      
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';


const props = defineProps({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  subLabel: {
    type: String,
    required: false
  },
  labelColor: {
    type: String,
    required: false
  },
  subLabelColor: {
    type: String,
    required: false,
    default: '#AEAEAE'
  },
  placeholder: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    required: false
  },
  inputHeight: {
    type: String,
    default: '64px'
  },
  borderRadius: {
    type: String,
    default: '32px'
  },
  inputFontSize: {
    type: String,
    required: false
  },
  inputColor: {
    type: String,
    required: false
  },
  borderColor: {
    type: String,
    required: false
  },
  inputFontWeight: {
    type: String,
    required: false
  },
  inputBgColor: {
    type: String,
    default: '#F0F0F0'
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  value: {
    type: String,
    required: false
  },
  validationSchema: { type: Function, required: false },
  showErrors: {
    type: Boolean,
    default: false
  },
  with_icon: {
    type: Boolean,
    default: false
  }
})

const { t, locale } = useI18n({ useScope: 'global' });

const localeDir = computed(() => {
  return locale.value === 'en' ? 'ltr' : 'rtl';
})

const modelValue = defineModel('modelValue')

// Manual validation
const hasError = computed(() => {
  // If validation schema is provided, use it
  if (props.validationSchema) {
    try {
      props.validationSchema.validateSync(modelValue.value);
      return false; // No error
    } catch (error) {
      return true; // Has error
    }
  }
  
  // Fallback to basic validation
  if (!modelValue.value || modelValue.value.toString().trim() === '') {
    return true;
  }
  
  if (props.type === 'number') {
    const numValue = Number(modelValue.value);
    if (isNaN(numValue) || numValue <= 0) {
      return true;
    }
  }
  
  if (props.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(modelValue.value)) {
      return true;
    }
  }
  
  return false;
});

const errorMessage = computed(() => {
  if (!hasError.value) return '';
  
  // If validation schema is provided, use its error message
  if (props.validationSchema) {
    try {
      props.validationSchema.validateSync(modelValue.value);
      return '';
    } catch (error) {
      return error.message;
    }
  }
  
  // Fallback to basic error messages
  const fieldName = props.label || props.name;
  
  if (props.type === 'email' && modelValue.value && modelValue.value.trim() !== '') {
    return t('validation.email', { field: fieldName });
  }
  
  if (props.type === 'number' && modelValue.value && modelValue.value.trim() !== '') {
    return t('validation.number', { field: fieldName });
  }
  
  return t('validation.required_with_label', { field: fieldName });
});
</script>

<style scoped>
.error-message {
  font-size: 12px;
  color: #e74c3c;
  font-weight: 500;
  margin-top: 5px;
}

.is-invalid {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}
</style>

