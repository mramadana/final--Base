<template>

    <div class="custom-width with-auth">

        <h1 class="main-title bold lg mb-3">{{ $t("Auth.specialization") }}</h1>

        <form @submit.prevent="handleSubmit" ref="specializationform">

            <div class="row">

                <div class="col-12 col-md-8 mr-auto">

                    <div class="form-group">

                        <label class="label">{{$t('Auth.specialization')}}</label>

                        <div class="card flex justify-content-center dropdown_card">

                            <Dropdown v-model="specialization" display="chip" :options="specializations" optionLabel="name" :placeholder="$t('Auth.enter_specialization')"

                            :maxSelectedLabels="cities.length" class="custum-dropdown" />

                        </div>

                    </div>

                    <div class="hiddenElements" v-if="showHiddenElements">

                        <!-- GlobalCustomDropdown (other Selects) -->

                        <GlobalCustomDropdown
                            v-model="countryOrigin"
                            :options="cities"
                            :placeholder="$t('Auth.country_origin')"
                            :label="$t('Auth.country_origin')"
                        />

                        <GlobalCustomDropdown
                            v-model="carType"
                            :options="subSpecializations"
                            :placeholder="$t('Auth.car_type')"
                            :label="$t('Auth.car_type')"
                        />

                        <GlobalCustomDropdown
                            v-model="carModel"
                            :options="experienceLevels"
                            :placeholder="$t('Auth.car_model')"
                            :label="$t('Auth.car_model')"
                        />

                        <div class="row">

                            <div class="label">{{$t('Auth.status')}}</div>

                            <div class="col-12 col-lg-6">

                                <div class="form-group check-inner mb-4">

                                    <div class="d-flex gap-3">

                                        <label class="custom-radio custom-check">

                                        <input type="checkbox" name="status" class="d-none" v-model="selectedStatus" value="new">

                                        <span class="mark">

                                            <i class="fas fa-check icon"></i>

                                        </span>

                                        <p class="check-text hint">{{ $t('Auth.new') }}</p>

                                    </label>

                                    </div>

                                </div>

                            </div>

                            <div class="col-12 col-lg-6">

                                <div class="form-group check-inner mb-4">

                                    <div class="d-flex gap-3">

                                        <label class="custom-radio custom-check">

                                        <input type="checkbox" name="status" class="d-none" v-model="selectedStatus" value="used">

                                        <span class="mark">

                                            <i class="fas fa-check icon"></i>

                                        </span>

                                        <p class="check-text hint">{{ $t('Auth.used') }}</p>

                                    </label>

                                    </div>

                                </div>

                            </div>

                            <div class="label">{{$t('Auth.year_manufacture')}}</div>

                            <div class="col-12 col-lg-6">

                                <label class="inner-radio">

                                    <input type="radio" class="d-none radio-input" name="year" v-model="year" value="singleYear">

                                    <div class="check-inner">

                                        <p class="hint-inner">

                                            <span class="radio-body"></span>

                                        </p>

                                        <p class="hint-text">

                                            {{ $t('Auth.specific_year') }}

                                        </p>

                                    </div>

                                </label>

                            </div>

                            <div class="col-12 col-lg-6">

                                <label class="inner-radio">

                                    <input type="radio" class="d-none radio-input" name="year" v-model="year" value="multipleYear">

                                    <div class="check-inner">

                                        <p class="hint-inner">

                                            <span class="radio-body"></span>

                                        </p>

                                        <p class="hint-text">

                                            {{ $t('Auth.all_years') }}

                                        </p>

                                    </div>

                                </label>

                            </div>

                            <div class="col-12 col-lg-6 mt-4" v-if="year == 'singleYear'">
                                <GlobalCustomDropdown
                                    v-model="fromyear"
                                    :options="startYears"
                                    :placeholder="$t('Auth.select_year')"
                                    :label="$t('Auth.from')"
                                />
                            </div>

                            <div class="col-12 col-lg-6 mt-4" v-if="year == 'singleYear'">
                                <GlobalCustomDropdown
                                    v-model="toyear"
                                    :options="toYears"
                                    :placeholder="$t('Auth.select_year')"
                                    :label="$t('Auth.to')"
                                />
                            </div>
                            
                        </div>
                        
                    </div>


                    <button type="submit" class="custom-btn w-100 mr-auto mt-4">
                        {{ $t('Auth.confirmation') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                    </button>

                </div>

            </div>

        </form>

    </div>
</template>



<script setup>

    import { submitApiForm } from '@/composables/useApiFetch';

    definePageMeta({

        // name: "Auth.create_account",

        layout: 'auth'

    });

    const specialization = ref(null);

    const fromyear = ref(null);

    const errors = ref([]);

    const { successToast, errorToast } = toastMsg();

    const { t } = useI18n({ useScope: 'global' });
    import { useI18n } from 'vue-i18n';

    const startYears = ref([

        { name: '2022', code: '2022', id: 1 },

        { name: '2021', code: '2021', id: 2 },

        { name: '2020', code: '2020', id: 3 },

        { name: '2019', code: '2019', id: 4 },
    ]);

    const toyear = ref(null);

    const toYears = ref([

        { name: '2022', code: '2022', id: 1 },

        { name: '2021', code: '2021', id: 2 },

        { name: '2020', code: '2020', id: 3 },

    ]);

    const cities = ref([

        { name: 'New York', code: 'NY', id: 1 },

        { name: 'Rome', code: 'RM', id: 2 },

        { name: 'London', code: 'LDN', id: 3 },

        { name: 'Istanbul', code: 'IST', id: 4 },

        { name: 'Paris', code: 'PRS', id: 5 },

        { name: 'Tokyo', code: 'TKY', id: 6 },

        { name: 'Beijing', code: 'BJG', id: 7 },

        { name: 'Shanghai', code: 'SHG', id: 8 },

    ]);

    const countryOrigin = ref(null);

    const carType = ref(null);

    const carModel = ref(null);

    const specializations = ref([

        { id: 1, name: 'Medicine' },

        { id: 2, name: 'Engineering' },

        { id: 3, name: 'Law' },

    ]);

    const subSpecializations = ref([

        { id: 1, name: 'Cardiology' },

        { id: 2, name: 'Software Engineering' },

        { id: 3, name: 'Corporate Law' },

    ]);
    
    const experienceLevels = ref([

        { id: 1, name: '0-2 years' },

        { id: 2, name: '3-5 years' },

        { id: 3, name: '5+ years' },

    ]);

    const year = ref('multipleYear');

    const selectedStatus = ref(['new']);

    const specializationform = ref(null);

    const loading = ref(false);

    // **************** methods ****************

    // validation Function
    const validate = () => {
        errors.value = []; // Reset errors array
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
            }
        }
        if(!specialization.value) {
            errors.value.push(t(`validation.specialization`));
        }

        if(!countryOrigin.value) {
            errors.value.push(t(`validation.country_origin`));
        }

        if(!carType.value) {
            errors.value.push(t(`validation.car_type`));
        }

        if(!carModel.value) {
            errors.value.push(t(`validation.car_model`));
        }
    }

    const showHiddenElements = computed(() => {
        return specialization?.value?.id === 2;
    });

    const handleSubmit = async () => {

        console.log(year.value, specialization?.value?.id, countryOrigin?.value?.id, carType?.value?.id, carModel?.value?.id, selectedStatus.value, "yarb");

        
        validate();
        
        // Check if there are any validation errors
        if (errors.value.length > 0) {
            // Show error toast with the first error message
            errorToast(errors.value[0]);
            return; // Stop execution if there are validation errors
        }
        loading.value = true;

        const formData = new FormData(specializationform.value);

        formData.append('specialization', specialization?.value?.id);
        formData.append('primary_specialization', countryOrigin?.value?.id);
        formData.append('sub_specialization', carType?.value?.id);
        formData.append('experience', carModel?.value?.id);

        try {
            const { data, error } = await submitApiForm('specialization', formData);
            if (error) {
                console.error('Error submitting form:', error);
                // Handle error here
            } else {
                errorToast(data.msg || "An error occurred");
                console.log('Success:', data);
                // Handle success here
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            // Handle unexpected error here
        } finally {
            loading.value = false;
        }
    };


</script>