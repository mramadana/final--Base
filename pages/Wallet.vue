<template>
    <div class="container">
        <div class="layout-form custom-width">
            <h1 class="main-title bold lg mb-5">{{ $t("Global.wallet") }}</h1>
            <div class="row">
                <div class="col-12 col-md-8 mr-auto">
                    <div class="text-center mb-5">
                        <img src="@/assets/images/walletillustration.png" alt="restore-image" class="restore-image mb-4">
                        <div class="mb-3">
                            <h4 class="main-disc mb-3">{{ $t("Global.current_balance") }}</h4>
                            <h2 v-if="!loading" class="main-title">{{ walletValue }}</h2>
                            <div class="d-flex align-items-center justify-content-center mt-3 mb-3" v-if="loading">
                                <Skeleton height=".9rem" width="4rem"></Skeleton>
                            </div>
                            <h4 class="main-title normal">{{ $t("Global.SR") }}</h4>
                        </div>
                    </div>
                    <button type="button" @click="successfullySent = true"  class="custom-btn w-100 mr-auto">
                         {{ $t('Global.charge_balance') }} 
                    </button>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="successfullySent" modal class="custum_dialog_width" :draggable="false" >
            <div class="mt-3">
                <div class="form-group">
                    <label class="label">
                        {{ $t('order.enter_amount') }}
                    </label>
                    <div class="main_input">
                        <input type="text" class="custum-input-icon" name="amount" v-model="amount" :placeholder="$t('order.enter_amount')">
                    </div>
                </div>

                <button type="button" @click="chargeWallet" class="custom-btn w-100 mr-auto">
                    {{ $t('Global.send') }} 
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>

    definePageMeta({
        name: "Global.wallet",
        middleware: 'auth'
    })

    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    const amount = ref('');

    const successfullySent = ref(false);

    const walletValue = ref('');

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
        headers: { Authorization: `Bearer ${token.value}` }
    };

    // get wallet
    const getWallet = async () => {
        await axios.get(`show-wallet`, config).then(res => {
        if (response(res) == "success") {
            walletValue.value = res.data.data.available_balance;
            console.log(res.data.data.available_balance);
        }
        loading.value = false;
        }).catch(err => {
            console.error(err);
        });
    };

    const chargeWallet = async () => {
        loading.value = true;
        const fd = new FormData();
        fd.append('amount', amount.value);
        if (amount.value == '') {
            errorToast(t(`order.enter_amount`));
            loading.value = false;
        } else if (amount.value <= 0) {
            errorToast(t(`order.enter_amount`));
            amount.value = null;
            loading.value = false;
        } else {

            await axios.post(`charge-wallet`, fd, config).then(res => {
                if (response(res) == "success") {
                    amount.value = null;
                    successfullySent.value = false;
                    redirectUrl.value = res.data.data.redirect_url;
                    window.open(redirectUrl.value, '_blank');
                    console.log(redirectUrl.value);
                    getWallet();
                    successToast(res.data.msg);
                } else {
                    errorToast(res.data.msg);
                }
                loading.value = false;
            }).catch(err => {
                console.error(err);
            });
        }
        
    };

    onMounted(() => {
        getWallet();
    })
</script>