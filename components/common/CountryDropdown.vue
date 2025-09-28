<template>
  <div class="card d-flex justify-content-center dropdown_card">
    <Dropdown
      :modelValue="modelValue"
      :options="countries"
      optionLabel="name"
      class="w-100"
      @change="(e) => $emit('update:modelValue', e.value)"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex-group-me">
          <img
            loading="lazy"
            :alt="slotProps.value.label"
            :src="slotProps.value.image"
            :class="`mr-2 flag flag-${slotProps.value.key}`"
            style="width: 24px"
          />
          <div>{{ slotProps.value.key }}</div>
        </div>
        <span v-else>
          {{ placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex-group-me">
          <img
            loading="lazy"
            :alt="slotProps.option.label"
            :src="slotProps.option.image"
            :class="`mr-2 flag flag-${slotProps.option.key}`"
            style="width: 24px"
          />
          <div>{{ slotProps.option.key }}</div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  countries: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select Country'
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.flex-group-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* .dropdown_card {
  width: 100%;
}

:deep(.p-dropdown) {
  width: 100%;
} */
</style>
