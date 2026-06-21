<template>
  <div class="custom-width with-auth">
    <form @submit.prevent="forgetPassword" ref="forgetForm">
      <div class="row">
        <div class="col-12 col-md-8 mr-auto">
          <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mt-5 mx-auto mb-4">
          <div class="text-center mb-5">
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.restore_password") }}</h1>
            <p class="main-title disc">{{ $t("Auth.Please_enter_email") }}</p>
          </div>

          <!-- Email input -->
            <FormInput v-model:modelValue="email" name="email" type="email" :label="$t('Auth.email')"
                :placeholder="$t('Auth.enter_email')" :validation-schema="validations.email"
                :showErrors="showValidation" :hasIcon="true" :icon="smsIcon"
                :with_icon="true" />
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

// Icons
import smsIcon from '@/assets/images/auth-img/sms.svg';

const { locale, t } = useI18n({ useScope: 'global' });

// Validation schemas
const { email: emailValidation } = useValidationSchema();
const validations = {
  email: emailValidation('Auth.email')
};


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
const email = ref('');
const loading = ref(false);
const showValidation = ref(false);

// Form data (reactive object for validation)
const formData = computed(() => ({
  email: email.value
}));

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

      const res = await axios.post('provider/auth/forget-password/send-code', fd);

      if (response(res) === "success") {
        // Store email in localStorage for next page
        localStorage.setItem('forgetPasswordEmail', email.value);
        
        successToast(res.data.msg);
        // Reset form on success
        email.value = '';
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
