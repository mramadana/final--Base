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
                                :showErrors="showValidation" :moveErrorToParent="true" :hasIcon="true" :icon="mobileIcon"
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

// Icons
import mobileIcon from '@/assets/images/auth-img/mobile.svg';

definePageMeta({
    name: "settings.change_mobile_title",
    middleware: 'auth'
});

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { token, newPhone } = storeToRefs(store);
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
        loading.value = true;

        const fd = new FormData(changePhoneForm.value);
        fd.append('country_code', selectedCountry.value.id);

        try {
            const res = await axios.post('provider/profile/change-phone/send-code-to-new-phone', fd, config);
            
            if (response(res) == "success") {
                successToast(res.data.msg);
                navigateTo('/settings/changeMobileActivateCode');
                newPhone.value = phone.value;
            } else {
                errorToast(res.data.msg);
            }
        } catch (err) {
            console.log(err);
            errorToast('حدث خطأ أثناء إرسال الكود');
        }

        loading.value = false;
    }
};
</script>

