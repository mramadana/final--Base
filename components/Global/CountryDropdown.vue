<template>
  <div class="card d-flex justify-content-center dropdown_card">
    <Dropdown
      v-model="selectedCountryModel"
      :options="countries?.data || []"
      optionLabel="name"
      class="w-100"
      filter
      :emptyMessage="$t('settings.no_available_options')"
      :emptyFilterMessage="$t('settings.emptyFilterMessage')"
      @change="handleChange"
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
          {{ slotProps.placeholder }}
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
          <div>{{ slotProps.option.name }}</div>
          <div>{{ slotProps.option.key }}</div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>

const selectedCountryModel = ref(null);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: 'Select Country'
  }
});

const emit = defineEmits(['update:modelValue']);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedCountryModel.value = newValue;
}, { immediate: true });

// Watch for internal changes to selectedCountryModel
watch(selectedCountryModel, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleChange = (e) => {
  selectedCountryModel.value = e.value;
};

// Fetch countries data using the useApiFetch composable
const { data: countries } = useApiFetch("countries");

// Expose the countries data to parent components using defineExpose
// This makes it possible for parent components to access this data using template refs
defineExpose({
  countries
});

// Watch for changes in the countries data
watch(countries, (newCountries) => {
  if (newCountries?.data) {
    const defaultCountry = newCountries.data.find(country => country.id == 1);
    if (defaultCountry && !props.modelValue?.id) {
      selectedCountryModel.value = { ...defaultCountry };
    }
  }
}, { immediate: true });

</script>

<style scoped>

</style>