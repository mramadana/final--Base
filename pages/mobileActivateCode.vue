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
                                <p class="main-title">{{ $t("Auth.please_enter_activation_code") }}</p>
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
    
                            <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                                 {{ $t('Auth.confirmation') }}
                                 <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
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
                <h3 class="main-title bold mb-4">{{ $t('Global.mobile_changed_successfully') }}</h3>
            </div>
        </Dialog>

    </div>
    
</template>


<script setup>
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

const { token, user , newPhone} = storeToRefs(store);

const loading = ref(false);

const bindModal = ref("");

const countStatus = ref(false);
const countDown = ref(60);

// Modal
const successfullySent = ref(false);

/******************* Provide && Inject *******************/

/******************* Props *******************/

/******************* Methods *******************/

// config
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

// newPhone Function
const verificationCode = async () => {
    loading.value = true;
    const fd = new FormData();
    fd.append('code', bindModal.value);
    fd.append('phone', newPhone.value);
    fd.append('country_code', user.value.country_code);
    await axios.post("change-phone-check-code", fd, config).then(res => {
        if (response(res) == "success") {
            successfullySent.value = true;
            newPhone.value = null
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

// resendCode Function
const resendCode = async () => {
    await axios.get(`resend-code?country_code=${user.value.country_code}&phone=${user.value.phone}`).then(res => {
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

definePageMeta({
    name: "Titles.activation_code",
    middleware: 'auth'
});

</script>


<!-- <script>
definePageMeta({
    name: "Titles.activation_code",
})

import VOtpInput from "vue3-otp-input";

export default {
    components: {
        VOtpInput,
    },
  data() {
    return {
      successfullySent: false,
      otpInput: null,
      bindModal: "",
    };
  },
  methods: {

    submitData() {   
        this.successfullySent = true;
        setTimeout(() => {
            this.successfullySent = false;
            this.$router.push('/settings');
        }, 1000);
    }

  },
  
  mounted() {
    this.otpInput = this.$refs.otpInput;
  },
};
</script> -->

