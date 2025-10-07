<template>
    <div>
        <form @submit.prevent="changePhone" ref="changePhoneForm">
            <div class="row">
                <div class="col-12 col-md-8">

                    <div class="form-group">
                        <label class="label">
                            {{ $t("Global.new_mobile") }}
                        </label>
                        <div class="with_cun_select" 
                             :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                            <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                                :placeholder="$t('Global.new_mobile')" :validation-schema="validations.phone"
                                :showErrors="showValidation" :moveErrorToParent="true" :hasIcon="true" icon="/_nuxt/assets/images/auth-img/mobile.svg"
                                :with_icon="true" />
                            <GlobalCountryDropdown v-model="selectedCountry"
                                :placeholder="$t('Global.select_country')" />
                        </div>
                        <!-- Display validation error message for phone -->
                        <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1" 
                           :class="phoneInputRef?.localeDir">
                            {{ phoneInputRef?.errorMessage }}
                        </p>
                    </div>

                    <!-- Submit button -->
                    <button type="submit" class="custom-btn md" :disabled="loading">
                        {{ $t('Auth.next') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                    </button>

                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
    // name: "settings.change_mobile",
    middleware: 'auth'
});

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);
const { phoneHandler } = store;

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form Data
const phone = ref('');
const selectedCountry = ref(null);
const phoneInputRef = ref(null);

// Form data (reactive object for validation)
const formData = computed(() => ({
    phone: phone.value
}));

const loading = ref(false);
const showValidation = ref(false);
const changePhoneForm = ref(null);

// use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Validation schemas
const {
    phoneNumber
} = useValidationSchema();

const validations = {
    phone: phoneNumber('Auth.mobile_number')
};

const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// changePhone
const changePhone = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);

    if (!isValid) {
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        navigateTo('/settings/changeMobileActivateCode');
        // loading.value = true;

        // const fd = new FormData(changePhoneForm.value);

        // try {
        //     const res = await axios.post('provider/update-phone', fd, config);
            
        //     if (response(res) == "success") {
        //         successToast(res.data.msg);
        //         navigateTo('/settings');
        //     } else {
        //         errorToast(res.data.msg);
        //     }
        // } catch (err) {
        //     console.log(err);
        //     errorToast('حدث خطأ أثناء تغيير رقم الجوال');
        // }

        // loading.value = false;
    }
};
</script>

<style scoped>
.with_cun_select.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    border-radius: 8px;
}

.error-message {
    font-size: 12px;
    color: #e74c3c;
    font-weight: 500;
    margin-top: 5px;
}
</style>
