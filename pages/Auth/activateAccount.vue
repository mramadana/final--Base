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
                        <button type="submit" class="custom-btn w-100 mr-auto"> {{ $t('Titles.verification_code') }} </button>

                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

definePageMeta({
    name: "Auth.activation_code_auth",
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
const { verificationHandler } = store;
const { user, notificationToken } = storeToRefs(store);

// Variables
const loading = ref(false);
const bindModal = ref("");
const otpComponent = ref(null);

// Verification function
const verificationCode = async () => {
    if (!bindModal.value) {
        errorToast(t("validation.verification_code"));
        return;
    }
    loading.value = true;
    const fd = new FormData();

    // Get stored data from localStorage
    let storedData = {};
    if (process.client) {
        const stored = localStorage.getItem('verificationCode');
        if (stored) {
            storedData = JSON.parse(stored);
        }
    }

    fd.append('code', bindModal.value);
    fd.append('phone', user.value.phone);
    fd.append('country_id', user.value.country_id);
    fd.append('device_id', 111);
    fd.append('device_type', 'web');
    // Append stored data from register
    if (storedData.name) fd.append('name', storedData.name);
    if (storedData.email) fd.append('email', storedData.email);
    if (storedData.password) fd.append('password', storedData.password);

    // Get Returned Data From Store
    const res = await verificationHandler(fd);
    res.status == "success" ? successToast(res.msg) : errorToast(res.msg);

    loading.value = false;
}

// Resend code function
const resendCode = async () => {
    try {
        const fd = new FormData();
        fd.append("country_code", user.value.country_id);
        fd.append("phone", user.value.phone);

        const res = await axios.post("provider/auth/resend-code", fd);

        if (response(res) === "success") {
            successToast(res.data.msg);
        } else {
            errorToast(res.data.msg);
        }
    } catch (err) {
        console.error("Resend Code Error:", err);

        errorToast(
            err?.response?.data?.msg ||
            "حدث خطأ أثناء إعادة إرسال الكود"
        );
    }
};


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