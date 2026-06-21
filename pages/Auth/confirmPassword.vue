<template>
    <div class="container">
        <div class="custom-width with-auth">
            <h1 class="main-title bold lg mb-4">{{ $t("Auth.restore_password") }}</h1>
            <form @submit.prevent="resetPassword" ref="confirmPasswordForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">
                        <div class="text-center mb-5">
                            <p class="main-title">{{ $t("Auth.confirm_password") }}</p>
                        </div>

                        <!-- Password -->
                        <FormInput 
                            v-model:modelValue="password" 
                            name="password" 
                            type="password" 
                            :label="$t('Auth.password')"
                            :placeholder="$t('Auth.please_enter_password')" 
                            :validation-schema="validations.password"
                            :showErrors="showValidation" 
                        />

                        <!-- Confirm Password -->
                        <FormInput 
                            v-model:modelValue="confirmPassword" 
                            name="password_confirmation" 
                            type="password" 
                            :label="$t('Auth.confirm_password_sm')"
                            :placeholder="$t('Auth.please_confirm_password')" 
                            :validation-schema="validations.confirmPassword"
                            :showErrors="showValidation" 
                        />

                        <!-- Submit button -->
                        <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                            {{ $t('Auth.confirmation') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                        </button>

                    </div>
                </div>
            </form>

            <!-- Success Dialog -->
            <Dialog v-model:visible="successfullyChange" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("Auth.password_reset_success") }}
                </h1>
                <p class="desc lg">{{ $t("Auth.password_reset_success_desc") }}</p>
            </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
    name: "Auth.new_password",
    layout: 'auth'
});

const { t } = useI18n({ useScope: 'global' });

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Get email and code from localStorage
const forgetPasswordEmail = ref('');
const forgetPasswordCode = ref('');

// Form Data
const password = ref('');
const confirmPassword = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    password: password.value,
    confirmPassword: confirmPassword.value
}));

const loading = ref(false);
const showValidation = ref(false);
const confirmPasswordForm = ref(null);
const successfullyChange = ref(false);

// use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Validation schemas
const {
    password: passwordValidation,
} = useValidationSchema();

const validations = {
    password: passwordValidation("Auth.password"),
    confirmPassword: passwordValidation("Auth.confirm_password_sm"),
};

// Custom validation function for confirm password
const validateConfirmPassword = (formData, validations) => {
    try {
        validations.confirmPassword.validateSync(formData.confirmPassword);
    } catch (error) {
        return false;
    }

    if (formData.password !== formData.confirmPassword) {
        return false;
    }

    return true;
};

const resetPassword = async () => {
    showValidation.value = true;

    const fd = new FormData(confirmPasswordForm.value);

    const isValid = isFormValid(formData.value, validations);
    const isConfirmPasswordValid = validateConfirmPassword(formData.value, validations);

    if (!isValid) {
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
    } else if (!isConfirmPasswordValid) {
        errorToast(t("validation.confirmPassword"));
        console.log("Confirm Password doesn't match");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            // Add email and code from localStorage
            fd.append('email', forgetPasswordEmail.value);
            fd.append('code', forgetPasswordCode.value);

            const res = await axios.post(`provider/auth/forget-password/reset-password`, fd);
            
            if (response(res) == "success") {
                successToast(res.data.msg);
                successfullyChange.value = true;
                setTimeout(() => {
                    successfullyChange.value = false;
                    navigateTo('/Auth/login');
                }, 2000);
            } else {
                errorToast(res.data.msg);
            }
        } catch (err) {
            console.log(err);
            errorToast(t('Auth.error_occurred'));
        }

        loading.value = false;
    }
};

// Load data from localStorage on mount
onMounted(() => {
    // Get email and code from localStorage
    forgetPasswordEmail.value = localStorage.getItem('forgetPasswordEmail') || '';
    forgetPasswordCode.value = localStorage.getItem('forgetPasswordCode') || '';
});

</script>
