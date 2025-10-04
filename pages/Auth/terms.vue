<template>
    <div>

        <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mx-auto mb-4" />

        <h1 class="main-title text-center md bold mb-4">{{ $t("Auth.terms_and_conditions") }}</h1>

        <div class="text-layout w-100 mb-4">


            <div class="main-title normal mt-3 about_disc" v-if="loading">
                عند إتمام الحجز سيتم إرسال رسالة تأكيد عبر التطبيق أو البريد الإلكتروني.بعض المطاعم قد تطلب دفع مبلغ
                مقدم لتأكيد الحجز.في حال التأخير عن الموعد المحدد قد يتم إلغاء الحجز دون استرداد المبلغ المدفوع
            </div>

            <!-- <div v-if="loading">
                <div v-for="i in 8" :key="i">
                    <Skeleton height=".5rem" width="100%" class="rounded-0 mb-2 mx-auto"></Skeleton>
                </div>
            </div> -->

            <div class="radios form-group check-inner mt-4 mb-4">
                <div class="d-flex gap-3">
                    <label class="custom-radio custom-check">
                        <input type="checkbox" name="terms" v-model="terms" class="d-none" />
                        <span class="mark">
                            <i class="fas fa-check icon"></i>
                        </span>
                        <div class="check-text hint d-flex">
                            <div class="new-sign mb-0">
                                <NuxtLink to="/terms" class="anchor">
                                    {{ $t("Auth.terms_conditions") }}
                                </NuxtLink>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <button class="custom-btn w-100">
                {{ $t("Auth.create_terms_account") }}
            </button>
        </div>

        <!-- success modal -->
        <Dialog v-model:visible="accept_create_acount" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check_img.svg" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.hint_success") }}
                </h1>
                <p class="desc lg">{{ $t("Auth.hint_success_desc") }}</p>
            </div>
        </Dialog>

    </div>
</template>

<script setup>

definePageMeta({
    name: "Auth.terms_and_conditions",
    layout: "auth",
    showBackLink: true,
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const globalStore = useGlobalStore();

const accept_create_acount = ref(false);

const loading = ref(true);

const { response } = responseApi();

const axios = useApi();

const terms = ref('');

const getTerms = async () => {
    loading.value = true;
    await axios.get(`terms`).then(res => {
        if (response(res) == "success") {
            terms.value = res.data.data;
        }
        loading.value = false;
    }).catch(err => {
        console.error(err);
    });
};

onMounted(() => {
    getTerms();
    // globalStore.title = t('Auth.terms_and_conditions');
})
</script>

<style lang="scss" scoped>
.about_disc {
    * {
        &:first-child {
            font-size: 16px;
            font-weight: bold;
        }
    }
}

.text-layout {
    padding: 15px 25px 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 25px;
    margin: 0 auto;
}
</style>
