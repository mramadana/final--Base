<template>
    <div>
        <form @submit.prevent="changePassword" ref="changePasswordForm">
            <div class="row">
                <div class="col-12 col-md-8">

                    <!-- Old Password -->
                    <FormInput 
                        v-model:modelValue="oldPassword" 
                        name="old_password" 
                        type="password" 
                        :label="$t('settings.current_password')"
                        :placeholder="$t('Auth.please_enter_password')" 
                        :validation-schema="validations.oldPassword"
                        :showErrors="showValidation" 
                    />

                    <!-- New Password -->
                    <FormInput 
                        v-model:modelValue="password" 
                        name="password" 
                        type="password" 
                        :label="$t('Auth.new_password')"
                        :placeholder="$t('Auth.please_enter_password')" 
                        :validation-schema="validations.password"
                        :showErrors="showValidation" 
                    />

                    <!-- Confirm Password -->
                    <FormInput 
                        v-model:modelValue="confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        :label="$t('Auth.definitely_new_password')"
                        :placeholder="$t('Auth.please_confirm_password')" 
                        :validation-schema="validations.confirmPassword"
                        :showErrors="showValidation" 
                    />

                    <!-- Submit button -->
                    <button type="submit" class="custom-btn md" :disabled="loading">
                        {{ $t('settings.change_password') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                    </button>

                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
    name: "settings.change_password",
    middleware: 'auth',
});

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form Data
const oldPassword = ref('');
const password = ref('');
const confirmPassword = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    oldPassword: oldPassword.value,
    password: password.value,
    confirmPassword: confirmPassword.value
}));

const loading = ref(false);
const showValidation = ref(false);
const changePasswordForm = ref(null);

// use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Validation schemas
const {
    password: passwordValidation,
} = useValidationSchema();

const validations = {
    oldPassword: passwordValidation("settings.current_password"),
    password: passwordValidation("Auth.new_password"),
    confirmPassword: passwordValidation("Auth.definitely_new_password"),
};

const config = {
    headers: { Authorization: `Bearer ${token.value}` }
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

const changePassword = async () => {
    showValidation.value = true;

    const fd = new FormData(changePasswordForm.value);

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
            const res = await axios.post(`provider/update-password`, fd, config);
            
            if (response(res) == "success") {
                successToast(res.data.msg);
                navigateTo('/settings');
            } else {
                errorToast(res.data.msg);
            }
        } catch (err) {
            console.log(err);
            errorToast('حدث خطأ أثناء تغيير كلمة المرور');
        }

        loading.value = false;
    }
};
</script>
