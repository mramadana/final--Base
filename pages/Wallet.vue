<template>
    <div>
        <div class="layout-form">
            <h1 class="main-title bold lg mb-4">
                {{ $t("users.completion_shipping_process") }}
            </h1>
            <p class="main-disc mb-5">{{ $t("users.wallet_balance_desc") }}</p>
            <div class="row">
                <div class="col-12 col-md-8 mr-auto">
                    <div class="text-center mb-5">
                        <img
                            src="@/assets/images/Illustration.svg"
                            alt="restore-image"
                            class="restore-image mb-4"
                        />
                        <h4 class="main-disc mb-3">
                            {{ $t("Global.wallet_balance") }}
                        </h4>
                        <div
                            class="mb-3 d-flex align-items-center justify-content-center gap-2"
                        >
                            <h2 v-if="!loading" class="main-title mb-0">
                                {{ walletValue }}
                            </h2>
                            <h4 v-if="!loading" class="main-title normal mb-0">
                                {{ $t("Auth.sar") }}
                            </h4>
                            <div
                                class="d-flex align-items-center justify-content-center mt-3 mb-3"
                                v-if="loading"
                            >
                                <Skeleton
                                    height=".9rem"
                                    width="4rem"
                                ></Skeleton>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        @click="successfullySent = true"
                        class="custom-btn lg mr-auto"
                    >
                        {{ $t("Global.charge_balance") }}
                    </button>
                </div>
            </div>
        </div>

        <Dialog
            v-model:visible="successfullySent"
            modal
            class="custum_dialog_width"
            :draggable="false"
        >
            <div class="mt-3">
                <div class="form-group">
                    <label class="label">
                        {{ $t("Global.charge_balance") }}
                    </label>
                    <div class="main_input with_icon">
                        <input
                            type="text"
                            class="custum-input-icon"
                            name="amount"
                            v-model="amount"
                            :placeholder="$t('Global.amount_to_charge')"
                        />
                        <img
                            src="@/assets/images/money-recive.svg"
                            alt="icon"
                            class="input-icon"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    @click="chargeWallet"
                    class="custom-btn w-100 mr-auto"
                >
                    {{ $t("Global.charge_balance") }}
                    <span
                        class="spinner-border spinner-border-sm"
                        v-if="loading"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
definePageMeta({
    name: "Auth.portfolio",
    middleware: "auth",
});

import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const amount = ref("");

const successfullySent = ref(false);

const walletValue = ref("");

const redirectUrl = ref(null);

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// loading
const loading = ref(true);

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` },
};

// get wallet
const getWallet = async () => {
    await axios
        .get(`provider/profile/wallet`, config)
        .then((res) => {
            if (response(res) == "success") {
                walletValue.value = res?.data?.data?.wallet_balance;
                console.log(res?.data?.data?.wallet_balance);
            }
            loading.value = false;
        })
        .catch((err) => {
            console.error(err);
        });
};

const chargeWallet = async () => {
    loading.value = true;
    const fd = new FormData();
    fd.append("amount", amount.value);
    if (amount.value == "") {
        errorToast(t(`order.enter_amount`));
        loading.value = false;
    } else if (amount.value <= 0) {
        errorToast(t(`order.enter_amount`));
        amount.value = null;
        loading.value = false;
    } else {
        await axios
            .post(`provider/profile/wallet/charge`, fd, config)
            .then((res) => {
                if (response(res) == "success") {
                    amount.value = null;
                    walletValue.value = res?.data?.data?.wallet_balance;
                    successfullySent.value = false;
                    // redirectUrl.value = res.data.data.redirect_url;
                    // window.open(redirectUrl.value, "_blank");
                    console.log(redirectUrl.value);
                    // getWallet();
                    successToast(res.data.msg);
                } else {
                    errorToast(res.data.msg);
                }
                loading.value = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }
};

onMounted(() => {
    getWallet();
});

const globalStore = useGlobalStore();
globalStore.title = t("Global.charge_balance");
</script>

<style scoped>
.custum-input-icon {
    padding-inline-start: 20px !important;
}
</style>
