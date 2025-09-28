<template>
    <div class="container">
        <div class="custom-width with-auth">
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.restore_password") }}</h1>
            <form @submit.prevent="submitData" ref="confirmPasswordForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">
                        <div class="text-center mb-5">
                            <p class="main-title">{{ $t("Auth.confirm_password") }}</p>
                        </div>
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.password') }}
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
                                {{ $t('Auth.confirm_password_sm') }}
                            </label>
                            <div class="main_input with_icon">
                                <input :type="inputType('definitelyNewPassword_2')" name="password_confirmation" v-model="confirmPassword" class="custum-input-icon validInputs" :placeholder=" $t('Auth.please_confirm_password') ">
                                <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('definitelyNewPassword_2')" :class="{ 'active_class': passwordVisible.definitelyNewPassword_2 }">
                                <i class="far fa-eye icon"></i>
                                </button>
                            </div>
                        </div>

                        <button class="custom-btn w-100 mr-auto">
                            {{ $t('Auth.confirmation') }}
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
        name: "Auth.new_password",
        layout: 'auth'
    });

    const { t } = useI18n({ useScope: 'global' });
    import { useI18n } from 'vue-i18n';
    const errors = ref([]);
    const password = ref('');
    const confirmPassword = ref('');
    const { successToast, errorToast } = toastMsg();
    const store = useAuthStore();
    const { user } = storeToRefs(store);
    const loading = ref(false);
    const confirmPasswordForm = ref(null);
    const passwordVisible = ref({
        definitelyNewPassword: false,
        definitelyNewPassword_2: false
    });

    // Validation Function
    function validate() {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }

        if (password.value !== confirmPassword.value) {
            errors.value.push(t(`validation.confirmPassword`));
            console.log(password.value, "password");
            console.log(confirmPassword.value, "confirmPassword");
        }
    }

    const inputType = (input) => {
        return passwordVisible.value[input] ? 'text' : 'password';
    };

    const togglePasswordVisibility = (input) => {
        passwordVisible.value[input] = !passwordVisible.value[input];
    };

    const submitData = async () => {
        const fd = new FormData(confirmPasswordForm.value);
        fd.append('phone', user.value.phone);
        fd.append('country_code', user.value.country_code);
        fd.append('code', localStorage.getItem('newCode'));

        validate();

        if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {
            loading.value = true;
            const { data, error } = await submitApiForm("reset-password", fd);

            if (error) {
                console.error("Reset Password error:", error);
                errorToast(error.message || "An error occurred");
                loading.value = false;
                return;
            }

            if (data.key === "success") {
                successToast(data.msg);
                navigateTo('/Auth/login');
            } else {
            errorToast(data.msg);
            }
            loading.value = false;
        }
    };
</script>
