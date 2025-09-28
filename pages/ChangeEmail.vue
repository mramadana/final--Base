<template>

    <div>

        <div class="container">
            <div class="layout-form custom-width">
                <h1 class="main-title bold lg mb-5">{{ $t("Global.change_email") }}</h1>
                <form @submit.prevent="submitData" ref="changeEmailForm">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">
                            <div class="text-center mb-5">
                                <img src="@/assets/images/restore-image.svg" loading="lazy" alt="restore-image" class="restore-image mb-4">
                                <p class="main-title">{{ $t("Global.enter_current_password_new_email") }}</p>
                            </div>
                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.password') }}
                                    <span class="hint-red">*</span>
                                </label>
                                <div class="main_input with_icon">
                                    <input :type="inputType('definitelyNewPassword')" name="password" v-model="password" class="custum-input-icon validInputs" valid="password" :placeholder=" $t('Auth.please_enter_password') ">
                                    <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('definitelyNewPassword')" :class="{ 'active_class': passwordVisible.definitelyNewPassword }">
                                    <i class="far fa-eye icon"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Global.new_email') }}
                                    <span class="hint-red">*</span>
                                </label>
                                <div class="main_input">
                                    <i class="fas fa-envelope sm-icon"></i>
                                    <input type="email" class="custum-input-icon validInputs" name="email" v-model="email" :placeholder="$t('Global.please_enter_new_email')">
                                </div>
                            </div>
    
                            <button class="custom-btn w-100 mr-auto mt-5">
                                {{ $t('Home.continuation') }}
                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                            </button>
    
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>

<script setup>
    definePageMeta({
        name: "Global.change_email",
        middleware: 'auth'
    });

    const { t } = useI18n({ useScope: 'global' });
    import { useI18n } from 'vue-i18n';
    const errors = ref([]);
    const { response } = responseApi();
    const { successToast, errorToast } = toastMsg();
    const password = ref('');
    const axios = useApi();
    const store = useAuthStore();
    const { token } = storeToRefs(store);
    const { changeMailHandler } = store;
    const loading = ref(false);
    const email = ref('');
    const changeEmailForm = ref(null);
    const passwordVisible = ref({
        definitelyNewPassword: false,
    });

    const togglePasswordVisibility = (input) => {
        passwordVisible.value[input] = !passwordVisible.value[input];
    };

    const inputType = (input) => {
        return passwordVisible.value[input] ? 'text' : 'password';
    };

    function validate() {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }
    }

    const submitData = async () => {
    const fd = new FormData(changeEmailForm.value);
    validate();
    if (errors.value.length) {
        errorToast(errors.value[0]);
        loading.value = false;
        errors.value = [];
    } else {
        loading.value = true;

        const res = await changeMailHandler(fd, email.value, password.value);
        res.status == "success" ? successToast(res.msg) : errorToast(res.msg);

        loading.value = false;
    }
    };

</script>

