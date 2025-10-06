<template>
    <div>
        <form @submit.prevent="changePhone" ref="changePhoneForm">
            <div class="row">
                <div class="col-12 col-md-8">

                    <!-- Password -->
                    <FormInput 
                        v-model:modelValue="password" 
                        name="password" 
                        type="password" 
                        :label="$t('settings.current_password')"
                        :placeholder="$t('Auth.please_enter_password')" 
                        :validation-schema="validations.password"
                        :showErrors="showValidation" 
                    />

                    <!-- Submit button -->
                    <button type="submit" class="custom-btn md" :disabled="loading">
                        {{ $t('Auth.next') }}
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
    name: "settings.change_mobile",
    middleware: 'auth'
});

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { token } = storeToRefs(store);
const { phoneHandler } = store;

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form Data
const password = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    password: password.value
}));

const loading = ref(false);
const showValidation = ref(false);
const changePhoneForm = ref(null);

// use the composable for the validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Validation schemas
const {
    password: passwordValidation
} = useValidationSchema();

const validations = {
    password: passwordValidation("settings.current_password")
};

const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// changePhone
const changePhone = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);

    if (!isValid) {
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        const fd = new FormData(changePhoneForm.value);

        try {
            const res = await axios.post('provider/update-phone', fd, config);
            
            if (response(res) == "success") {
                successToast(res.data.msg);
                navigateTo('/settings');
            } else {
                errorToast(res.data.msg);
            }
        } catch (err) {
            console.log(err);
            errorToast('حدث خطأ أثناء تغيير رقم الجوال');
        }

        loading.value = false;
    }
};
</script>
