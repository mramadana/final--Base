<template>

    <div>

        <div class="layout-form">
            <h1 class="main-title bold lg mb-4">{{ $t("Global.order_details") }}</h1>

            <!-- <ClientOnly> -->
            <div v-if="!loading && orderStatus != 4">

                <ul :class="{ 'steps': true, 'small': rentalOptionCheck && ordertype == 1 }">

                    <li :class="{ 'step-item active': true }" v-if="!rentalOptionCheck || ordertype == 0">
                        <div class="icon-done">
                            <i class="fas fa-check icon"></i>
                        </div>
                        <span class="progress-label"> {{ $t("Global.waiting") }} </span>
                    </li>

                    <li :class="{ 'step-item': true, 'active': orderStatus == 2 || orderStatus == 3 || orderStatus == 6 }"
                        v-if="!rentalOptionCheck || ordertype == 0">
                        <div class="icon-done">
                            <i class="fas fa-check icon"></i>
                        </div>
                        <span class="progress-label">{{ $t("Global.pay") }}</span>
                    </li>

                    <li
                        :class="{ 'step-item': true, 'active': orderStatus == 2 || orderStatus == 3 || orderStatus == 6 }">
                        <div class="icon-done">
                            <i class="fas fa-check icon"></i>
                        </div>
                        <span class="progress-label">{{ $t("Global.current") }}</span>
                    </li>

                    <li :class="{ 'step-item': true, 'active': orderStatus == 6 }">
                        <div class="icon-done">
                            <i class="fas fa-check icon"></i>
                        </div>
                        <span class="progress-label">{{ $t("Global.finished") }}</span>
                    </li>
                </ul>

            </div>

            <div class="d-flex align-items-center justify-content-center mb-5" v-if="loading">
                <skeleton shape="circle" size="2rem" class="customer-img" />
                <skeleton width="300px" height="10px" />
                <skeleton shape="circle" size="2rem" class="customer-img" />
            </div>

            <div :class="{ 'steps-content': true, 'mt-5': true, 'canceled': orderStatus == 4 }"
                v-if="ordertype == 1 && !orderData.is_rated || orderStatus == 4">
                <div class="hint" v-if="ordertype == 1 && !orderData.is_rated"> * &nbsp; &nbsp; {{
                    $t("Global.congratulations") }} !</div>
                <span class="cl-red" v-if="orderStatus == 4">{{ $t("order.order_rejected") }}</span>
                <span v-if="ordertype == 1 && !orderData.is_rated">{{ $t("Global.payment_successfully") }}</span>
            </div>
            <!-- </ClientOnly> -->

            <div class="row mt-5" v-if="!loading">
                <div class="col-12 col-md-6 mb-5">
                    <div class="layout-form sm-radius">
                        <div class="head-form">
                            <h3 class="main-title mb-0">{{ $t("Global.car_details") }} :</h3>
                        </div>
                        <div class="car-info">
                            <div class="info">
                                <span class="name">{{ $t("order.car_name") }}</span>
                                <span class="value">{{ orderData.name }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.car_brand") }}</span>
                                <span class="value">{{ orderData.brand }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.car_model") }}</span>
                                <span class="value">{{ orderData.modal }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.manufacturing_year") }}</span>
                                <span class="value">{{ orderData.manufacturing_year }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("order.driver") }}</span>
                                <span class="value">{{ orderData.type_text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-5">
                    <div class="layout-form sm-radius">
                        <div class="head-form">
                            <h3 class="main-title mb-0">{{ $t("Global.total") }} :</h3>
                        </div>
                        <div class="car-info">
                            <div class="info">
                                <span class="name" v-if="rentalOptionCheck">{{ $t('Global.the_monthly_rent') }}</span>
                                <span class="name" v-if="!rentalOptionCheck">{{ $t('Global.daily_rent') }}</span>
                                <span class="value"> {{ orderData.rental_price }} {{ $t("Global.Rs") }}</span>
                            </div>
                            <div class="info">
                                <span class="name" v-if="rentalOptionCheck">{{ $t("Global.number_rental_months")
                                    }}</span>
                                <span class="name" v-if="!rentalOptionCheck">{{ $t("Global.number_rental_days")
                                    }}</span>
                                <div class="value d-flex gap-1">
                                    {{ orderData.rental_period }}
                                    <p v-if="rentalOptionCheck">{{ $t("Global.month") }}</p>
                                    <p v-else>{{ $t("order.day") }}</p>
                                </div>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.total_rental_price") }}</span>
                                <span class="value">{{ orderData.total_rental_price }} {{ $t("Global.Rs") }}</span>
                            </div>
                            <div class="info" v-if="rentalOptionCheck">
                                <span class="name">{{ $t("Global.total_insurance_price") }}</span>
                                <span class="value">{{ orderData.insurance_price }} {{ $t("Global.Rs") }}</span>
                            </div>

                            <div class="info" v-if="!rentalOptionCheck">
                                <span class="name">{{ $t("Global.driver_fees") }}</span>
                                <span class="value">{{ orderData.driver_price }} {{ $t("Global.Rs") }}</span>
                            </div>

                            <div class="info" v-if="rentalOptionCheck">
                                <span class="name">{{ $t("Global.tamm_platform") }}</span>
                                <span class="value">{{ orderData.tam_price }} {{ $t("Global.Rs") }}</span>
                            </div>

                            <div class="info">
                                <span class="name">{{ $t("Global.value_added_tax") }}</span>
                                <span class="value">{{ orderData.vat_amount }} {{ $t("Global.Rs") }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.total_price") }}</span>
                                <span class="value main-cl">{{ orderData.final_total }} {{ $t("Global.Rs") }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-5">
                    <div class="layout-form sm-radius">
                        <div class="head-form">
                            <h3 class="main-title mb-0">{{ $t("Global.reservation_details") }} :</h3>
                        </div>
                        <div class="car-info">
                            <div class="info">
                                <span class="name">{{ $t("order.order_status") }}</span>
                                <span class="value">{{ orderData.status_text }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("order.date_of_order") }}</span>
                                <span class="value">{{ orderData.order_date }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Home.rental_type") }}</span>
                                <span class="value">{{ orderData.rental_type }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Home.rental_period") }}</span>
                                <span class="value">{{ orderData.rental_period }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.time_receipt") }}</span>
                                <span class="value">{{ orderData.receive_time }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.received_date") }}</span>
                                <span class="value">{{ orderData.receive_date }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.return_time") }}</span>
                                <span class="value">{{ orderData.return_time }}</span>
                            </div>
                            <div class="info">
                                <span class="name"> {{ $t("Global.return_date") }}</span>
                                <span class="value">{{ orderData.return_date }}</span>
                            </div>
                            <div class="info">
                                <span class="name">{{ $t("Global.place_of_delivery") }}</span>
                                <div class="value d-flex align-items-center gap-1 cl-red pointer"
                                    @click="place_of_deliveryDialog = true">
                                    {{ $t("order.Riyadh") }}
                                </div>
                            </div>
                            <div class="info" v-if="orderStatus == 6 || orderStatus == 4"
                                @click="place_of_deliveryDialog = true">
                                <span class="name">{{ $t("Global.return_location") }}</span>
                                <span class="value">
                                    <div class="value d-flex align-items-center gap-1 cl-red pointer">
                                        {{ $t("order.Riyadh") }}
                                    </div>
                                </span>
                            </div>
                            <div class="info" v-if="orderStatus == 6 || orderStatus == 4">
                                <span class="name">{{ $t("Global.id_photo") }}</span>
                                <div class="value">
                                    <img :src="orderData.identity_image" alt="id_photo" class="id_photo" loading="lazy">
                                </div>
                            </div>
                            <div class="info" v-if="orderStatus == 6 || orderStatus == 4">
                                <span class="name">{{ $t("Global.driver_license") }}</span>
                                <div class="value">
                                    <img :src="orderData.license_image" alt="id_photo" class="id_photo" loading="lazy">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-5">
                    <div class="layout-form sm-radius mb-4">
                        <div class="head-form">
                            <h3 class="main-title mb-0">{{ $t("Global.notes") }} :</h3>
                        </div>
                        <div class="car-info">
                            <div class="info">
                                <span class="name">{{ orderData.notes }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="layout-form sm-radius mb-4" v-if="orderStatus == 6 && orderData.is_rated">
                        <div class="head-form">
                            <h3 class="main-title mb-0">{{ $t("order.your_rating") }} :</h3>
                            <div class="d-flex justify-content-start rate-parent mt-2 mb-2 sm-rate">
                                <Rating readonly v-model="orderData.rate.rate" :cancel="false" :dir="'ltr'" />
                            </div>
                        </div>
                        <div class="car-info">
                            <div class="info">
                                <span class="name">{{ orderData.rate.comment }}</span>
                            </div>
                            <!-- <div class="info" v-else>
                                <p class="no-data text-center">{{ $t("Global.no_rates") }}</p>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="row" v-if="loading">
                <div class="col-12 col-md-6 mb-4" v-for="i in 4" :key="i">
                    <skeleton width="100%" height="190px" class="mx-auto" />
                </div>
            </div>


            <button type="button" v-if="orderStatus == 1" @click="orderPaying" class="custom-btn lg mr-auto">{{
                $t("Global.pay_now") }}</button>

            <button type="button" v-if="orderStatus == 2" @click="continuation" class="custom-btn lg mr-auto">{{
                $t("Global.receive") }}</button>

            <button type="button" v-if="orderStatus == 6 && orderData.is_rated != true" @click="serviceRating"
                class="custom-btn lg mr-auto">{{ $t("Global.service_evaluation") }}</button>

        </div>

        <!-- Dialog of activation Code -->

        <Dialog v-model:visible="verifyCode" modal class="custum_dialog_width md" :draggable="false">
            <div class="text-center">
                <h1 class="main-title bold mb-4">{{ $t('Global.verification_code') }}</h1>
                <h3 class="main-disc">{{ $t('Global.enter_activation_sent_your_mobile') }}</h3>
            </div>

            <form @submit.prevent="orderVerifyCode">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

                        <div class="layout-activate d-flex" dir="ltr">
                            <v-otp-input ref="otpInput" v-model:value="bindModal" input-classes="otp-input"
                                separator=" " :num-inputs="6" :should-auto-focus="true" :is-input-num="true" />
                        </div>

                        <button type="submit" class="custom-btn mr-auto">
                            {{ $t('Auth.confirmation') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                aria-hidden="true"></span>
                        </button>

                        <div class="new-sign mt-4">
                            {{ $t('Auth.havent_received_code') }}
                            <button type="button" @click="resendCode" :disabled="countStatus"
                                :class="{ 'disabledClass': countStatus }">{{ $t('Auth.resend_code') }}</button>
                        </div>

                        <div class="text-center mt-3 main-cl" v-if="countStatus">
                            <span>{{ countDown }} </span> : <span>00</span>
                        </div>

                    </div>
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="successfullySent" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check.png" loading="lazy" alt="check-img" class="check-img">
                <h3 class="main-title bold mb-4">{{ $t('Global.authorization_sent_to_mobile') }}</h3>
                <button type="button" @click="trackOrder" class="custom-btn mr-auto"> {{ $t('Global.track_your_order')
                    }} </button>
            </div>
        </Dialog>

        <!-- Dialog of service rating  -->

        <!-- start to rating the service -->
        <Dialog v-model:visible="serviceRatingDialog" modal class="custum_dialog_width" :draggable="false">
            <form @submit.prevent="orderRatingForm">
                <div class="text-center">
                    <h1 class="main-title bold mb-4">{{ $t('Global.service_rating') }}</h1>
                    <h3 class="main-disc mb-3">{{ $t('Global.leave_comment') }}</h3>
                    <div class="d-flex justify-content-center rate-parent mb-4">
                        <Rating v-model="customerRate" :cancel="false" :dir="'ltr'" />
                    </div>

                    <textarea class="main_input main_area mb-4 validInputs" valid="rate" v-model="comment"
                        :placeholder="$t('Global.write_comment')"></textarea>

                    <div class="section-btns">
                        <button type="submit" class="custom-btn sm">
                            {{ $t('Global.send_evaluation') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                aria-hidden="true"></span>
                        </button>
                        <button type="button" @click="serviceRatingDialog = false" class="custom-btn sm cancel">
                            {{ $t('Global.not_now') }} </button>
                    </div>
                </div>
            </form>
        </Dialog>

        <!-- start sent Successfully -->
        <Dialog v-model:visible="sent_Successfully" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check.png" alt="check-img" class="check-img">
                <h1 class="main-title bold mb-4">{{ $t('Global.evaluation_sent_successfully') }}</h1>
            </div>
        </Dialog>

        <!-- Dialog maaap -->
        <ClientOnly v-if="rentalOptionCheck">
            <Dialog v-model:visible="place_of_deliveryDialog" modal class="custum_dialog_width" :draggable="false">
                <div class="text-center">
                    <p class="main-title mb-4">{{ $t('Global.place_of_delivery') }}</p>
                    <Googlemap height="300px" apiKey="AIzaSyAboccHIj2gkfRleovrCxpYdePLR6ao1EY" :autocomplete="false"
                        :language="language" class="autocomplete-dropdown" :location="defaultLocation" />
                </div>
            </Dialog>
        </ClientOnly>

        <!-- order Paying dialog -->
        <DialogsOrdersOrderPaying ref="orderPayingDialog" @paymentDone="paymentDone" :loading="loading"
            @PaySelected="PaySelected" />
    </div>

</template>

<script setup>

import Googlemap from 'vue-google-maps-ui';

const globalStore = useGlobalStore();

// import plugin
import VOtpInput from "vue3-otp-input";

definePageMeta({
    middleware: 'auth',
    name: "order.order_details",
})

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
const pageTilte = ref(t("Sidebar.orders") + " " + '/' + " " + t("order.order_details"));

const { id } = useRoute().params;

// response
const { response } = responseApi();

// axios
const axios = useApi();

const loading = ref(true);

const place_of_deliveryDialog = ref(false);

const defaultLocation = ref({
    lat: '',
    lng: '',
});


// toast
const { successToast, errorToast } = toastMsg();

// pinia store
const store = useAuthStore();

// token
const { token } = storeToRefs(store);

const errors = ref([]);

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// variable
const countStatus = ref(false);
const countDown = ref(60);
const ratingData = ref({});
const comment = ref(null);
const orderPayingDialog = ref(false);
const verifyCode = ref(false);
const bindModal = ref('');
const successfullySent = ref(false);
const otpInput = ref(null);

const ordertype = ref(null);
const orderStatus = ref(null);
const orderData = ref([]);
const paymentID = ref(null);
const rentalOptionCheck = ref(false);

// variable for rating
const serviceRatingDialog = ref(false);
const sent_Successfully = ref(false);
const customerRate = ref(null);

// methods

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

// validation Function
const validate = () => {
    let allInputs = document.querySelectorAll('.validInputs');
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].value === '') {
            errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
        }
    }
};

const PaySelected = (id) => {
    paymentID.value = id;
    console.log(paymentID.value, "paymentID");
};

// payment order
const paymentDone = () => {
    loading.value = true;

    console.log("payment done");

    const fd = new FormData();
    fd.append("order_id", id);
    fd.append("pay_type", paymentID.value);

    axios.post("pay-order", fd, config).then(res => {
        if (response(res) == "success") {
            orderPayingDialog.value.orderpaying = false;
            orderDetails();
        } else {
            errorToast(res.data.msg)
        }
    }).catch(err => console.log(err));

}

// call api receive-order to send code 
const receiveOrder = () => {
    const fd = new FormData();
    fd.append("order_id", id);
    axios.post("receive-order", fd, config).then(res => {
        if (response(res) == "success") {
            console.log(res.data.data);
        }
    }).catch(err => console.log(err));
};

// resend code 
const resendCode = () => {
    const fd = new FormData();
    fd.append("order_id", id);
    axios.post("tm-resend-code", fd, config).then(res => {
        if (response(res) == "success") {
            successToast(res.data.msg);
            countStatus.value = true;
            countDownTimer();
        }
    }).catch(err => console.log(err));
};

// verify_code receive order
const orderVerifyCode = async () => {
    receiveOrder();
    loading.value = true;
    const fd = new FormData();
    fd.append("code", bindModal.value);

    fd.append("order_id", id);

    await axios.post("confirm-tm", fd, config).then(res => {
        if (response(res) == "success") {
            verifyCode.value = false;
            otpInput.value = null;
            successfullySent.value = true;
        } else {
            errorToast(res.data.msg)
        }
        loading.value = false;
    }).catch(err => console.log(err));

};

// Rate Order
const orderRatingForm = () => {
    loading.value = true;
    // serviceRatingDialog.value = false;
    // sent_Successfully.value = true;

    const fd = new FormData();
    fd.append("order_id", id);
    fd.append("rate", customerRate.value);
    fd.append("comment", comment.value);
    validate();
    if (errors.value.length) {
        errorToast(errors.value[0]);
        loading.value = false;
        errors.value = [];
    } else {
        axios.post("rate-order", fd, config).then(res => {
            if (response(res) == "success") {
                serviceRatingDialog.value = false;
                sent_Successfully.value = true;
                setTimeout(() => {
                    sent_Successfully.value = false;
                }, 500)
                console.log(res.data.data);
                successToast(res.data.msg);
                orderDetails();
            } else {
                errorToast(res.data.msg)
            }
            loading.value = false;
        }).catch(err => console.log(err));
    }
};

const trackOrder = () => {
    successfullySent.value = false;
    orderDetails();
}

const rentalOption = () => {
    const formDataString = localStorage.getItem('formData');
    if (formDataString) {
        const formData = JSON.parse(formDataString);
        if (formData.rentalOption == 1) {
            rentalOptionCheck.value = true;
            console.log(rentalOptionCheck.value, "rentalOptionCheck");
        }
    }
}

const continuation = () => {

    verifyCode.value = true;
    countDownTimer();
}

// service rating dialog
const serviceRating = () => {
    serviceRatingDialog.value = true;
}

// order paying dialog
const orderPaying = () => {
    orderPayingDialog.value.orderpaying = true;
}

// get order-details data
const orderDetails = async () => {
    loading.value = true;
    await axios.get(`order-details?order_id=${id}`, config).then(res => {
        if (response(res) == "success") {
            orderData.value = res.data.data;
            ordertype.value = res.data.data.type;
            orderStatus.value = res.data.data.status;
            ratingData.value = res.data.data.rate;
            defaultLocation.value.lat = Number(res.data.data.lat);
            defaultLocation.value.lng = Number(res.data.data.lng);
            console.log(orderData.value, "ordertype", orderStatus.value, "orderDetails");
        }
        loading.value = false;
    }).catch(err => console.log(err));
};

onMounted(() => {
    orderDetails()
    rentalOption();
    globalStore.title = pageTilte.value;
    console.log(globalStore.title, "globalStore.title000");
});




</script>

<style lang="scss">
.steps {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 700px;
    max-width: 100%;
    margin: 0 auto 20px;

    &::before {
        content: "";
        position: absolute;
        width: 71%;
        height: 2px;
        background: var(--main);
    }

    &.small {
        &::before {
            width: 50%;
        }
    }

    .icon-done {
        width: 28px;
        height: 28px;
        background-color: #BDBDBD;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        position: relative;
        transition: all 0.3s ease-out;
        z-index: 4;

        .icon {
            display: none;
        }

        &::before {
            content: "";
            width: 100%;
            height: 100%;
            padding: 17px;
            position: absolute;
            border: 1.6px dashed transparent;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 50%;
            transition: all 0.3s ease-out;
        }
    }

    .progress-label {
        color: #828282;
    }

    .step-item {
        flex-grow: 1;
        margin: 0 auto;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        transform: translateY(15px);
        gap: 10px;

        &.active,
        &.activeState {
            .icon-done {
                background-color: var(--main);
                color: #fff;

                .icon {
                    display: block;
                }

                &::before {
                    border-color: var(--main);
                }
            }

            .progress-label {
                color: #333333;
            }
        }
    }
}

.steps-content {
    width: 400px;
    background: rgba(224, 148, 65, 20%);
    margin: 0 auto;
    max-width: 100%;
    padding: 10px 15px;
    text-align: start;
    border-radius: 5px;
    gap: 10px;
    display: flex;
    font-size: 15px;
    font-weight: bold;

    .hint {
        color: var(--main);
    }
}
</style>