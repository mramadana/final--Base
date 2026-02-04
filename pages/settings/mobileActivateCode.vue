<template>
    <div class="text-center">

        <p class="desc mb-4 auth-desc">{{ $t("settings.confirm_code") }} {{ user.phone }}</p>

        <form @submit.prevent="verificationCode">
            <div class="row">
                <div class="col-12 col-md-8 mx-auto">

                    <FormOtpVerification 
                        v-model="bindModal"
                        :num-inputs="4"
                        :initial-countdown="60"
                        @resend-code="resendCode"
                        ref="otpComponent"
                    />

                    <div class="d-flex justify-content-center">

                        <button type="submit" class="custom-btn md mt-4" :disabled="loading">
                            {{ $t('settings.change_mobile') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                        </button>

                    </div>


                </div>
            </div>
        </form>

        <Dialog v-model:visible="successfullySent" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check.png" loading="lazy" alt="check-img" class="check-img">
                <h3 class="main-title bold mb-4">{{ $t('Global.mobile_changed_successfully') }}</h3>
            </div>
        </Dialog>
    </div>
</template>


<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

definePageMeta({
    name: "تغيير رقم الجوال",
    middleware: 'auth'
});

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Store
const store = useAuthStore();
const { token, user, newPhone } = storeToRefs(store);

// Variables
const loading = ref(false);
const bindModal = ref("");
const otpComponent = ref(null);
const successfullySent = ref(false);

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// Verification function
const verificationCode = async () => {
    if (!bindModal.value) {
        errorToast(t("validation.verification_code"));
        return;
    }
    
    loading.value = true;
    const fd = new FormData();
    
    fd.append('code', bindModal.value);
    
    try {
        const res = await axios.post("provider/profile/change-phone/verify-current-phone", fd, config);
        
        if (response(res) == "success") {
            successToast(res.data.msg);
            navigateTo('/settings/newMobileNumber');
        } else {
            errorToast(res.data.msg);
        }
    } catch (err) {
        console.log(err);
        errorToast('حدث خطأ أثناء التحقق من الكود');
    }
    
    loading.value = false;
}

// Resend code function
const resendCode = async () => {
    try {
        const fd = new FormData();
        fd.append('phone', user.value.phone);
        fd.append('country_code', user.value.country_id);
        
        const res = await axios.post(`provider/profile/change-phone/check-current-password-and-send-code`, fd, config);
        
        if (response(res) == "success") {
            successToast(res.data.msg);
        } else {
            errorToast(res.data.msg);
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


