<template>
    <div class="form-group">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="d-flex justify-content-center align-items-center dropdown_card special-custom" :class="{ 'is-invalid': showValidation && !modelValue }">
            <div class="hasicon" v-if="hasIcon">
                <i :class="`fas ${icon} select-icon`"></i>
            </div>
            <Dropdown 
                v-model="internalValue"
                optionLabel="name" 
                :optionValue="props.optionValue"
                display="chip"
                :options="options" 
                :placeholder="placeholder"
                :maxSelectedLabels="maxSelectedLabels" 
                class="custom-dropdown"
                @change="handleChange"
                :disabled="disabled"
                :emptyMessage="$t('Global.no_available_options')"
                :emptyFilterMessage="$t('Global.emptyFilterMessage')"
            />
        </div>
        <!-- validation تلقائي -->
        <div v-if="showValidation && !modelValue" style="color: red; font-size: 12px; margin-top: 5px;">
            {{ label }} مطلوب
        </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        options: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        maxSelectedLabels: {
            type: Number,
            default: null
        },
        hasIcon: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: 'fa-venus-mars'
        },
        modelValue: [Number, String, Array],
        disabled: {
            type: Boolean,
            default: false
        },
        optionValue: { type: String,  default: null },
        showValidation: { type: Boolean, default: false }
    });

    const emit = defineEmits(['update:modelValue', 'change']);

    const internalValue = computed({
        get() { return props.modelValue },
        set(val) { emit('update:modelValue', val) }
    })

    const handleChange = (event) => {
        if (props.disabled) return  
        emit('change', event.value);
        emit('update:modelValue', event.value);
    }

</script>

<style scoped>
.is-invalid {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}
</style>