<template>
    <div>
        <div class="layout-form">
            <h1 class="main-title md bold mb-4">{{ $t('users.contact_admin') }}</h1>
            <form @submit.prevent="addInquiry" ref="addInquiryForm">
                <!-- Number of People -->
                <FormInput 
                    v-model:modelValue="name"
                    name="message" 
                    type="text"
                    :label="$t('users.message_title')"
                    :placeholder="$t('users.message_title')"
                    :validation-schema="validations.numberOfPeople"
                    :showErrors="showValidation"
                />

                <div class="form-group">
                    <label class="label">{{ $t('users.message_content') }}</label>
                    <div class="position-relative">
                        <textarea 
                            v-model="descriptionAr"
                            @input="descriptionArTouched = true"
                            name="descriptionAr"
                            class="main_input main_area"
                            :class="{ 'is-invalid': descriptionArError }"
                            :placeholder="$t('users.message_content')"
                            rows="4">
                        </textarea>
                    </div>
                    <p v-if="descriptionArError" class="error-message text-danger mt-1">
                        {{ descriptionArError }}
                    </p>
                </div>

                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t('Global.send') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

// Axios
const axios = useApi();

const { successToast, errorToast } = toastMsg();

const name = ref('');
const descriptionAr = ref('');
const descriptionArTouched = ref(false);
const showValidation = ref(false);
const loading = ref(false);
const addInquiryForm = ref(null);
// Validation schemas
const {
    tableNumber,
} = useValidationSchema();

const validations = {
    numberOfPeople: tableNumber(t('users.message_title')),
    descriptionAr: tableNumber(t('users.message_content')),
};

const { isFormValid, scrollToFirstError } = useFormValidation();

const getValidationError = (field, value, touched) => {
    if (!showValidation.value && !touched) return '';
    try {
        validations[field].validateSync(value);
        return '';
    } catch (error) {
        return error.message;
    }
};

// Computed error messages
const descriptionArError = computed(() => 
    getValidationError('descriptionAr', descriptionAr.value, descriptionArTouched.value)
);

const addInquiry = async () => {
    showValidation.value = true;

    // إنشاء object يحتوي على القيم الفعلية للحقول
    const formData = {
        numberOfPeople: name.value,
        descriptionAr: descriptionAr.value
    };

    const isValid = isFormValid(formData, validations);
    if (!isValid) {
        // if the form has validation errors
        scrollToFirstError(formData, validations);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData(addInquiryForm.value);
            const res = await axios.post("inquiry", fd);
            if (response(res) === "success") {
                successToast(res.msg);
            } else {
                errorToast(res.msg);
            }
        } catch (error) {
            console.error("Register error:", error);
            errorToast(t("Auth.registration_failed"));
        } finally {
            loading.value = false;
        }
    }
};

</script>