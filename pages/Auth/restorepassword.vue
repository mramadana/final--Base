<template>
  <div class="custom-width with-auth">
    <form @submit.prevent="forgetPassword" ref="forgetForm">
      <div class="row">
        <div class="col-12 col-md-8 mr-auto">
          <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mt-5 mx-auto mb-4">
          <div class="text-center mb-5">
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.restore_password") }}</h1>
            <p class="main-title disc">{{ $t("Auth.Please_enter_mobile_number") }}</p>
          </div>

          <div class="form-group">
            <label class="label">
              {{ $t('Auth.mobile_number') }}
            </label>
            <div class="with_cun_select" 
                 :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
              <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                :placeholder="$t('Auth.enter_mobile_number')" :validation-schema="validations.phone"
                :showErrors="showValidation" :moveErrorToParent="true" :hasIcon="true" icon="/_nuxt/assets/images/auth-img/mobile.svg"
                :with_icon="true" />
              <GlobalCountryDropdown v-model="selectedCountry"
                :placeholder="$t('Auth.select_country')" />
            </div>
            <!-- Display validation error message for phone -->
            <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1" 
               :class="phoneInputRef?.localeDir">
              {{ phoneInputRef?.errorMessage }}
            </p>
          </div>

          <button type="submit" class="custom-btn w-100 mr-auto">
            {{ $t('Auth.send_code') }}
            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
          </button>

          <div class="new-sign mt-4">
              {{ $t('Auth.remember_your_password') }}
              <nuxt-link to="/Auth/login" >{{ $t('Auth.login') }}</nuxt-link>
          </div>

        </div>
      </div>
    </form>
  </div>
</template>

<script setup>

definePageMeta({
  name: "Auth.restore_password",
  layout: 'auth'
});

/******************* Plugins *******************/
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

const { locale, t } = useI18n({ useScope: 'global' });

// Validation schemas
const { phoneNumber } = useValidationSchema();
const validations = {
  phone: phoneNumber('Auth.mobile_number')
};

const selectedCountry = ref(null);

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { user, token } = storeToRefs(store);

// Config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

const forgetForm = ref(null);
const phone = ref('');
const loading = ref(false);
const errors = ref([]);
const showValidation = ref(false);

// FormInput ref for phone
const phoneInputRef = ref(null);

// Form data (reactive object for validation)
const formData = computed(() => ({
  phone: phone.value
}));

// Phone validation computed properties - removed since using FormInput ref

// use the composable for the validation - exactly like your example
const { isFormValid, scrollToFirstError } = useFormValidation();



/******************* Methods *******************/



// forgetPassword Function
const forgetPassword = async () => {
  showValidation.value = true;

  const isValid = isFormValid(formData.value, validations);
  console.log('Is Valid:', isValid);

  if (!isValid) {
    // if the validation fails, scroll to first error
    scrollToFirstError(formData.value, validations);
    console.log("22222222222");
  } else {
    console.log("11111111111 - Validation Passed");
    loading.value = true;

    try {
      const fd = new FormData(forgetForm.value);
      fd.append('country_id', selectedCountry.value?.id || '');

      const res = await axios.post('provider/auth/forget-password/send-code', fd);

      if (response(res) === "success") {
        // Store phone and country_id in localStorage for next page
        localStorage.setItem('forgetPasswordPhone', phone.value);
        localStorage.setItem('forgetPasswordCountryId', selectedCountry.value?.id || selectedCountry.value?.key || '');
        
        successToast(res.data.msg);
        // Reset form on success
        phone.value = '';
        showValidation.value = false;
        navigateTo('/Auth/restorepassword-check-code');
      } else {
        errorToast(res.data.msg);
      }
    } catch (error) {
      console.error('Forget Password error:', error);
      errorToast(t('Auth.error_occurred'));
    } finally {
      loading.value = false;
    }
  }
};

</script>

<style scoped>
.with_cun_select.is-invalid {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
  border-radius: 8px;
}
</style>
