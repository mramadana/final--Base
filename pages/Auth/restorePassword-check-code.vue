<template>
    <div class="container container_layout">
        <div class="custom-width with-auth p-0 mt-4">
            <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.activation_code_auth") }}</h1>
            <p class="desc mb-4 auth-desc">{{ $t("Auth.verification_info") }}</p>
            <form @submit.prevent="verificationCode">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

                        <FormOtpVerification 
                            v-model="bindModal"
                            :num-inputs="4"
                            :initial-countdown="60"
                            @resend-code="resendCode"
                            ref="otpComponent"
                        />

                        <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                            {{ $t('Titles.verification_code') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                        </button>

                    </div>
                </div>
            </form>
        </div>
        
        <!-- Success Modal -->
        <Dialog v-model:visible="showSuccessModal" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.password_reset_success") }}
                </h1>
                <p class="desc lg">{{ $t("Auth.password_reset_success_desc") }}</p>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

definePageMeta({
  name: "Auth.activation_code_profile",
  layout: "auth",
  showBackLink: true,
});

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

// Store
const store = useAuthStore();
const { user } = storeToRefs(store);

// Variables
const loading = ref(false);
const bindModal = ref("");
const otpComponent = ref(null);
const showSuccessModal = ref(false);
// Verification function
const verificationCode = async () => {
  if (!bindModal.value) {
    errorToast(t("validation.verification_code"));
    return;
  }
  loading.value = true;
  const fd = new FormData();

  fd.append('code', bindModal.value);
  fd.append('phone', user.value.phone);
  fd.append('country_code', user.value.country_code);

  try {
    const { data, error } = await submitApiForm("forget-password-check-code", fd);

    if (error) {
      console.error("Verification Code error:", error);
      errorToast(error.message || "An error occurred");
      loading.value = false;
      return;
    }

    if (data.key === "success") {
      successToast(data.msg);
      showSuccessModal.value = true;
      setTimeout(() => {
        navigateTo('/Auth/login');
      }, 3000);
    } else {
      errorToast(data.msg);
    }
  } catch (error) {
    console.error('Verification error:', error);
    errorToast(t('Auth.error_occurred'));
  } finally {
    loading.value = false;
  }
}

// Resend code function
const resendCode = async () => {
  try {
    const { data, error } = await fetchApiData(`forget-password-resend-code?country_code=${user.value.country_code}&phone=${user.value.phone}`);

    if (error) {
      console.error("Resend Code error:", error);
      errorToast(error.message || "An error occurred");
      return;
    }

    if (data.key === "success") {
      successToast(data.msg);
    } else {
      errorToast(data.msg);
    }
  } catch (err) {
    console.log(err);
    errorToast('حدث خطأ أثناء إعادة الإرسال');
  }
}

// Start countdown on mount
onMounted(() => {
  if (otpComponent.value) {
    otpComponent.value.startCountdown();
  }
});

</script>

<style lang="scss">
.auth-desc {
  width: 50%;
  margin: auto;
  max-width: 100%;
}
</style>


