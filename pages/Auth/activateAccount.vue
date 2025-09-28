<template>
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

                        <button type="submit" class="custom-btn w-100 mr-auto"> {{ $t('Auth.confirmation') }} </button>

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
</template>


<!-- <script>

definePageMeta({
        name: "Home.activation_code",
    });
import VOtpInput from "vue3-otp-input";

export default {
    components: {
        VOtpInput,
    },
  data() {
    return {
      otpInput: null,
      bindModal: "",
    };
  },
  methods: {

    submitData() {   
        this.$router.push('/')
    }

  },
  
  mounted() {
    this.otpInput = this.$refs.otpInput;
  },
};
</script> -->


<script setup>

definePageMeta({
        name: "Home.activation_code",
    });
/******************* Import *******************/
import VOtpInput from "vue3-otp-input";

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { verificationHandler } = store;
const { user, notificationToken } = storeToRefs(store);

// variable
const countStatus = ref(false);
const countDown = ref(60);
const loading = ref(false);
const otpInput = ref(null);
const bindModal = ref("");

/******************* Methods *******************/

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

const verificationCode = async () => {
    loading.value = true;
    const fd = new FormData();

    fd.append('code', bindModal.value);
    fd.append('phone', user.value.phone);
    fd.append('country_code', user.value.country_code);
    fd.append('device_id', notificationToken.value);
    fd.append('device_type', 'web');

    // Get Returned Data From Store
    const res = await verificationHandler(fd);
    res.status == "success" ? successToast(res.msg) : errorToast(res.msg);

    loading.value = false;

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

/******************* Computed *******************/

/******************* Watch *******************/

/******************* Mounted *******************/

</script>
