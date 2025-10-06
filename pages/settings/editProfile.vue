<template>
    <div>
        <form @submit.prevent="editProfile" ref="editProfileform">
            <div class="row pb-4">

                <div class="col-12 col-md-8">
                    <!-- اسم العميل -->
                    <FormInput v-model:modelValue="name" name="name" type="text" :label="$t('Auth.customer_name')"
                        :placeholder="$t('Auth.customer_name')" :validation-schema="validations.name"
                        :showErrors="showValidation" />

                    <!-- البريد الإلكتروني -->
                    <FormInput v-model:modelValue="email" name="email" type="email" :label="$t('Auth.email')"
                        :placeholder="$t('Auth.enter_email')" :validation-schema="validations.email"
                        :showErrors="showValidation" />

                    <!-- اسم البنك -->
                    <FormInput v-model:modelValue="bankNameField" name="bankName" type="text"
                        :label="$t('Auth.bank_name')" :placeholder="$t('Auth.bank_name')"
                        :validation-schema="validations.bankName" :showErrors="showValidation" />

                    <!-- رقم الحساب -->
                    <FormInput v-model:modelValue="accountNumberField" name="accountNumber" type="text"
                        :label="$t('Auth.account_number')" :placeholder="$t('Auth.account_number')"
                        :validation-schema="validations.accountNumber" :showErrors="showValidation" />

                    <!-- اسم صاحب الحساب -->
                    <FormInput v-model:modelValue="accountHolderNameField" name="accountHolderName" type="text"
                        :label="$t('Auth.account_holder_name')" :placeholder="$t('Auth.account_holder_name')"
                        :validation-schema="validations.accountHolderName" :showErrors="showValidation" />

                    <!-- Submit button -->
                    <button type="submit" class="custom-btn md" :disabled="loading">
                        {{ $t('Global.Saving_changes') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                            aria-hidden="true"></span>
                    </button>


                </div>
            </div>
        </form>

        <!-- Success Dialog -->
        <Dialog v-model:visible="successfullyChange" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check.png" alt="check-img" class="check-img">
                <h3 class="main-title bold mb-4">{{ $t('Global.Saving_changes_success') }}</h3>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
    name: "settings.edit_account",
    middleware: 'auth',
});

const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();
const { profileHandler } = store;
const { token } = storeToRefs(store);

// Response & Toast
const { response } = responseApi();
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form Data
const name = ref('');
const email = ref('');
const bankNameField = ref('');
const accountNumberField = ref('');
const accountHolderNameField = ref('');

// Form data (reactive object for validation)
const formData = computed(() => ({
    name: name.value,
    email: email.value,
    bankName: bankNameField.value,
    accountNumber: accountNumberField.value,
    accountHolderName: accountHolderNameField.value
}));

const successfullyChange = ref(false);
const loading = ref(false);
const showValidation = ref(false);
const editProfileform = ref(null);

// use the composable for the validation - exactly like login
const { isFormValid, scrollToFirstError } = useFormValidation();

// Validation schemas
const {
    customerName,
    email: emailValidation,
    bankName,
    accountNumber,
    accountHolderName
} = useValidationSchema();

const validations = {
    name: customerName("Auth.customer_name"),
    email: emailValidation("Auth.email"),
    bankName: bankName("Auth.bank_name"),
    accountNumber: accountNumber("Auth.account_number"),
    accountHolderName: accountHolderName("Auth.account_holder_name")
};

const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

// Get profile data
const getProfile = async () => {
    try {
        const res = await axios.get('provider/show-profile', config);
        if (response(res) == "success") {
            name.value = res.data.data.name || '';
            email.value = res.data.data.email || '';
            bankNameField.value = res.data.data.bank_name || '';
            accountNumberField.value = res.data.data.account_number || '';
            accountHolderNameField.value = res.data.data.account_holder_name || '';
        }
    } catch (err) {
        console.log(err);
        errorToast('حدث خطأ أثناء تحميل البيانات');
    }
};

// Edit Profile
const editProfile = async () => {
    showValidation.value = true;

    const fd = new FormData(editProfileform.value);

    const isValid = isFormValid(formData.value, validations);

    if (!isValid) {
        // if the inputs have errors
        scrollToFirstError(formData.value, validations);
        console.log("22222222222");
    } else {
        console.log("11111111111 - Validation Passed");
        loading.value = true;

        try {
            const res = await profileHandler(fd);

            if (res.status == "success") {
                successToast(res.msg);
                successfullyChange.value = true;
                setTimeout(() => {
                    successfullyChange.value = false;
                    navigateTo("/settings");
                }, 1000);
            } else {
                errorToast(res.msg);
            }
        } catch (err) {
            console.log(err);
            errorToast('حدث خطأ أثناء حفظ البيانات');
        }

        loading.value = false;
    }
};

onMounted(async () => {
    await getProfile();
});
</script>
