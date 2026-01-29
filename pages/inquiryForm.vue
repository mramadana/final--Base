<template>
    <div>
        <div class="layout-form">
            <h1 class="main-title md bold mb-4">
                {{ $t("users.contact_admin") }}
            </h1>
            <form @submit.prevent="addInquiry" ref="addInquiryForm">
                <!-- Number of People -->
                <FormInput
                    v-model:modelValue="name"
                    name="subject"
                    type="text"
                    :label="$t('users.message_title')"
                    :placeholder="$t('users.message_title')"
                    :validation-schema="validations.numberOfPeople"
                    :showErrors="showValidation"
                />

                <div class="form-group">
                    <label class="label">{{
                        $t("users.message_content")
                    }}</label>
                    <div class="position-relative">
                        <textarea
                            v-model="descriptionAr"
                            @input="descriptionArTouched = true"
                            name="message"
                            class="main_input main_area"
                            :class="{ 'is-invalid': descriptionArError }"
                            :placeholder="$t('users.message_content')"
                            rows="4"
                        >
                        </textarea>
                    </div>
                    <p
                        v-if="descriptionArError"
                        class="error-message text-danger mt-1"
                    >
                        {{ descriptionArError }}
                    </p>
                </div>

                <button type="submit" class="custom-btn md" :disabled="loading">
                    {{ $t("Global.send") }}
                    <span
                        class="spinner-border spinner-border-sm"
                        v-if="loading"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </button>
            </form>
        </div>
        <!-- Success Modal -->
        <Dialog
            v-model:visible="showInquirySuccessModal"
            modal
            class="custum_dialog_width without-close"
            :draggable="false"
        >
            <div class="text-center">
                <img
                    src="@/assets/images/Success.gif"
                    alt="check-img"
                    class="check-img lg"
                    loading="lazy"
                />
                <h1 class="main-title bold mb-3 hint_success">
                    {{ $t("users.inquiry_sent_successfully") }}
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

// Page meta
definePageMeta({
    name: "Sidebar.booking_form",
    layout: "default",
});

// Axios
const axios = useApi();

const { successToast, errorToast } = toastMsg();

// success response
const { response } = responseApi();

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` },
}));

const name = ref("");
const descriptionAr = ref("");
const descriptionArTouched = ref(false);
const showValidation = ref(false);
const loading = ref(false);
const addInquiryForm = ref(null);
const showInquirySuccessModal = ref(false);

// Validation schemas
const { tableNumber } = useValidationSchema();

const validations = {
    numberOfPeople: tableNumber(t("users.message_title")),
    descriptionAr: tableNumber(t("users.message_content")),
};

const { isFormValid, scrollToFirstError } = useFormValidation();

const getValidationError = (field, value, touched) => {
    if (!showValidation.value && !touched) return "";
    try {
        validations[field].validateSync(value);
        return "";
    } catch (error) {
        return error.message;
    }
};

// Computed error messages
const descriptionArError = computed(() =>
    getValidationError(
        "descriptionAr",
        descriptionAr.value,
        descriptionArTouched.value,
    ),
);

const addInquiry = async () => {
    showValidation.value = true;

    // إنشاء object يحتوي على القيم الفعلية للحقول
    const formData = {
        numberOfPeople: name.value,
        descriptionAr: descriptionAr.value,
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
            const res = await axios.post("send-help-message", fd, config.value);
            if (response(res) === "success") {
                showInquirySuccessModal.value = true;
                setTimeout(() => {
                    showInquirySuccessModal.value = false;
                    navigateTo("/");
                }, 2000);
                successToast(res?.data?.msg);
            } else {
                errorToast(res?.data?.msg);
            }
        } catch (error) {
            console.error("Register error:", error);
            errorToast(t("Auth.registration_failed"));
        } finally {
            loading.value = false;
        }
    }
};

const globalStore = useGlobalStore();
globalStore.title = t("Sidebar.booking_form");
</script>
