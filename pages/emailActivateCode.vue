<template>

    <div>

        <div class="container">
            <div class="layout-form custom-width">
                <h1 class="main-title bold lg mb-5">{{ $t("Auth.activation_code") }}</h1>
                <form @submit.prevent="verificationCode">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">
                            <div class="text-center mb-5">
                                <img src="@/assets/images/restore-image.svg" loading="lazy" alt="restore-image" class="restore-image mb-4">
                                <p class="main-title">{{ $t("Global.Please_activation_email") }}</p>
                            </div>
    
                            <div class="layout-activate d-flex" dir="ltr">
                                <v-otp-input
                                ref="otpInput"
                                v-model:value="bindModal"
                                input-classes="otp-input"
                                separator=" "
                                :num-inputs="6"
                                :should-auto-focus="true"
                                :is-input-num="true"
                                />
                            </div>
    
                            <button type="submit" class="custom-btn w-100 mr-auto">
                                 {{ $t('Auth.confirmation') }} 
                                 <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                            </button>
                            
    
                            <div class="new-sign mt-4">
                                {{ $t('Auth.havent_received_code') }}
                                <button type="button" @click="resendCode" :disabled="countStatus" :class="{'disabledClass' : countStatus}">{{ $t('Auth.resend_code') }}</button>
                            </div>

                            <div class="text-center mt-3 main-cl" v-if="countStatus">
                                <span>{{ countDown }} </span> : <span>00</span> 
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>

        <Dialog v-model:visible="successfullySent" modal class="custum_dialog_width without-close" :draggable="false" >
            <div class="text-center">
                <img src="@/assets/images/check.png" loading="lazy" alt="check-img" class="check-img">
                <h3 class="main-title bold mb-4">{{ $t('Global.email_changed_successfully') }}</h3>
            </div>
        </Dialog>

    </div>
    
</template>

<script setup>

definePageMeta({
    name: "Global.activation_code",
    middleware: 'auth'
});
/******************* Import *******************/
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

// OTP
import VOtpInput from "vue3-otp-input";

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

const {user, token, currentPasword, currentemail} = storeToRefs(store);

const countStatus = ref(false);
const countDown = ref(60);

const loading = ref(false);

const bindModal = ref("");

const successfullySent = ref(false);

const config = {
        headers: { Authorization: `Bearer ${token.value}` }
};

const countDownTimer = () => {
    countStatus.value = true;
    if (countDown.value > 0) {
        setTimeout(() => {
            countDown.value -= 1;
            countDownTimer();
        }, 1000);
    } else {
        // Hide the countdown when countDown reaches 0
        countStatus.value = false; 
        countDown.value = 60;
    }
};

// verificationCode Function
const verificationCode = async () => {
    loading.value = true;
    const fd = new FormData();
    fd.append('email', currentemail.value);
    fd.append('code', bindModal.value);
    await axios.post("change-email-check-code", fd, config).then(res => {
        if (response(res) == "success") {
            successfullySent.value = true;
            successToast(res.data.msg);
            setTimeout(() => {
                successfullySent.value = false;
                navigateTo('/settings');
            }, 1000);
        } else {
            errorToast(res.data.msg)
        }
        loading.value = false;
    }).catch(err => console.log(err));
}

//  resendCode Function
const resendCode = async () => {
    const fd = new FormData();
    fd.append('email', currentemail.value);
    fd.append('password', currentPasword.value);
    await axios.post(`change-email-resend-code`, fd, config).then(res => {
        if (response(res) == "success") {
            successToast(res.data.msg);
            countStatus.value = true;
            countDownTimer();
        } else {
            errorToast(res.data.msg);
        }
    }).catch(err => console.log(err));
}

onMounted(() => {
    countDownTimer();
});

</script>
