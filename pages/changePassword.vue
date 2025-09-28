<template>
    <div class="container">
        <div class="layout-form custom-width">
            <h1 class="main-title bold lg mb-5">{{ $t("Global.change_password") }}</h1>

            <form @submit.prevent="changePassword" ref="changePasswordForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">
                        <div class="text-center mb-5">
                            <img src="@/assets/images/restore-image.svg" loading="lazy" alt="restore-image" class="restore-image mb-4">
                            <p class="main-title">{{ $t("Global.enter_old_password_new_password") }}</p>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Global.old_password') }}
                                <span class="hint-red">*</span>
                            </label>
                            <div class="main_input with_icon">
                                <input :type="inputType('oldPassword')" name="password" v-model="oldpassword" class="custum-input-icon validInputs" :placeholder=" $t('Auth.please_enter_password') ">
                                <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('oldPassword')" :class="{ 'active_class': passwordVisible.oldPassword }">
                                <i class="far fa-eye icon"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.new_password') }}
                                <span class="hint-red">*</span>
                            </label>
                            <div class="main_input with_icon">
                                <input :type="inputType('definitelyNewPassword')" name="password" v-model="password" class="custum-input-icon validInputs" :placeholder=" $t('Auth.please_enter_password') ">
                                <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('definitelyNewPassword')" :class="{ 'active_class': passwordVisible.definitelyNewPassword }">
                                <i class="far fa-eye icon"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.definitely_new_password') }}
                                <span class="hint-red">*</span>
                            </label>
                            <div class="main_input with_icon">
                                <input :type="inputType('definitelyNewPassword_2')" name="confirmPassword" valid="confirmPassword" v-model="confirmPassword" class="custum-input-icon validInputs" :placeholder=" $t('Auth.please_confirm_password') ">
                                <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('definitelyNewPassword_2')" :class="{ 'active_class': passwordVisible.definitelyNewPassword_2 }">
                                <i class="far fa-eye icon"></i>
                                </button>
                            </div>
                        </div>

                        <button class="custom-btn w-100 mr-auto">
                            {{ $t('Global.save') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                        </button>

                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Global.change_password",
        middleware: 'auth',
    });

    const { t } = useI18n({ useScope: 'global' });
    import { useI18n } from 'vue-i18n';
    const store = useAuthStore();
    const { token } = storeToRefs(store);
    const oldpassword = ref('');
    const errors = ref([]);
    const password = ref('');
    const confirmPassword = ref('');
    const { response } = responseApi();
    const { successToast, errorToast } = toastMsg();
    const axios = useApi();
    const loading = ref(false);
    const changePasswordForm = ref(null);
    const passwordVisible = ref({
        definitelyNewPassword: false,
        definitelyNewPassword_2: false
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

        if (password.value !== confirmPassword.value) {
            errors.value.push(t(`validation.confirmPassword`));
        }
    }

    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };

    const changePassword = async () => {
        loading.value = true;
        const fd = new FormData(changePasswordForm.value);
        validate();
        if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {
            await axios.patch(`update-password?old_password=${oldpassword.value}&password=${password.value}`, fd, config).then(res => {
                if (response(res) == "success") {
                    successToast(res.data.msg);
                    navigateTo('/settings');
                } else {
                    errorToast(res.data.msg)
                }
                loading.value = false;
            }).catch(err => console.log(err))
        }


        
    }

</script>
