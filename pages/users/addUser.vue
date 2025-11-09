<template>
    <div>
        <div class="layout-form">
            <form @submit.prevent="signUp" ref="signUpForm">

                <div class="row">

                    <div class="col-12 col-md-6">
                        <!-- Customer name input -->
                        <FormInput v-model:modelValue="name" name="name" type="text" :label="$t('Auth.customer_name')"
                            :placeholder="$t('Auth.customer_name')" :validation-schema="validations.name"
                            :showErrors="showValidation" :hasIcon="true" icon="/_nuxt/assets/images/auth-img/user.svg"
                            :with_icon="true" />
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Mobile number input with country dropdown -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t("Auth.mobile_number") }}
                            </label>
                            <div class="with_cun_select" :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                                <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                                    :placeholder="$t('Auth.enter_mobile_number')" :validation-schema="validations.phone"
                                    :showErrors="showValidation" :moveErrorToParent="true" :hasIcon="true"
                                    icon="/_nuxt/assets/images/auth-img/mobile.svg" :with_icon="true" />
                                <GlobalCountryDropdown v-model="selectedCountry"
                                    :placeholder="$t('Auth.select_country')" />
                            </div>
                            <!-- Display validation error message for phone -->
                            <p v-if="phoneInputRef?.shouldShowError" class="error-message text-danger mt-1"
                                :class="phoneInputRef?.localeDir">
                                {{ phoneInputRef?.errorMessage }}
                            </p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Email input -->
                        <FormInput v-model:modelValue="email" name="email" type="email" :label="$t('Auth.email')"
                            :placeholder="$t('Auth.enter_email')" :validation-schema="validations.email"
                            :showErrors="showValidation" :hasIcon="true" icon="/_nuxt/assets/images/auth-img/sms.svg"
                            :with_icon="true" />
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Password input -->
                        <FormInput v-model:modelValue="password" name="password" type="password"
                            :label="$t('Auth.password')" :placeholder="$t('Auth.please_enter_password')"
                            :validation-schema="validations.password" :showErrors="showValidation" :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/lock.svg" :with_icon="true" />
                    </div>

                    <div class="col-12">
                        <h4 class="main-title md mb-4">الصلاحيات</h4>
                        
                        <div class="permissions-section d-flex flex-wrap align-items-center gap-3 mt-4">

                            <div v-for="(permission, index) in fakePermissions" :key="index" class=" mb-3">
                                <div class="d-flex align-items-center justify-content-between payment-field">
                                    <div class="check-text hint d-flex ml-4">
                                        <div class="main-title mb-0">
                                            {{ permission.label }}
                                        </div>
                                    </div>

                                    <!-- Checkbox -->
                                    <div class="radios form-group check-inner mb-0">
                                        <div class="d-flex align-items-center justify-content-between gap-3">
                                            <label class="custom-radio custom-check">
                                                <input type="checkbox" v-model="permission.selected" class="d-none" />
                                                <span class="mark m-0">
                                                    <i class="fas fa-check icon"></i>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="showValidation && validations.permissions" class="text-danger mt-1">
                            <span v-if="getValidationError('permissions')">{{ getValidationError('permissions')
                                }}</span>
                        </div>
                    </div>

                </div>
                <!-- Submit button -->
                <button type="submit" class="custom-btn md mt-4" :disabled="loading">
                    {{ $t("Auth.create_acc") }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                        aria-hidden="true"></span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
// Imports and utilities
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

// Form fields (moved before validation to avoid undefined errors)
const name = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");

// Validation schemas
const {
    phoneNumber,
    customerName,
    email: emailValidation,
    multipleCheckboxes,
} = useValidationSchema();

const fakePermissions = ref([
    { key: "edit", label: "تعديل", selected: false },
    { key: "delete_user", label: "حذف مستخدم", selected: false },
    { key: "add", label: "إضافة", selected: true },
    { key: "manage_offers", label: "إدارة العروض", selected: false },
    { key: "support", label: "الدعم الفني", selected: false },
]);

const selectedPermissions = computed(() =>
    fakePermissions.value
        .filter((p) => p.selected)
        .map((p) => p.key)
);

const savePermissions = () => {
    console.log("Selected Permissions:", selectedPermissions.value);
    // ممكن بعدين تبعتها بالـ API
    // axios.post('/save-permissions', { permissions: selectedPermissions.value })
};


// Validation schemas - exactly like login
const validations = {
    name: customerName("Auth.customer_name"),
    phone: phoneNumber("Auth.mobile_number"),
    email: emailValidation("Auth.email"),
    permissions: multipleCheckboxes("Auth.permissions", 1),
};

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Store
const store = useAuthStore();
const { signUpHandler } = store;

// Form data
const loading = ref(false);
const showValidation = ref(false);
const successRegister = ref(false);
const signUpForm = ref(null);

// Countries
const selectedCountry = ref(null);

// FormInput ref for phone
const phoneInputRef = ref(null);

// Form data (reactive object for validation)
const formData = computed(() => ({
    name: name.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    permissions: selectedPermissions.value, // Add permissions here
}));

// use the composable for the validation - exactly like login
const { isFormValid, scrollToFirstError } = useFormValidation();

// function to get validation error for a specific field
const getValidationError = (field) => {
    if (!showValidation.value || !validations[field]) return null;
    try {
        validations[field].validateSync(formData.value[field]);
        return null;
    } catch (error) {
        return error.message;
    }
};

// Sign up function - same validation pattern as login
const signUp = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);

    console.log("Is Valid:", isValid);

    if (!isValid) {
        // if the form has validation errors
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData();
            fd.append("name", name.value);
            fd.append("phone_email", phone.value);
            fd.append("email", email.value);
            fd.append("password", password.value);
            fd.append("country_code", selectedCountry.value?.key || "");
            fd.append("device_id", 111);
            fd.append("device_type", "web");

            // Get Returned Data From Store
            const res = await signUpHandler(fd);

            if (response(res) === "success") {
                successToast(res.msg);
                successRegister.value = true;
                // Reset form on success
                name.value = "";
                phone.value = "";
                email.value = "";
                selectedCountry.value = null;
                showValidation.value = false;
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

// Page meta
definePageMeta({
    // name: "Auth.create_account",
    layout: "default",
});
</script>

<style scoped>
.with_cun_select.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
    border-radius: 8px;
}

.main_input.is-invalid {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}
</style>

<style lang="scss" scoped>
.payment-field {
    padding: 20px 15px;
    background-color: #FFFFFF0F;
    border-radius: 10px;
    min-width: 200px;
    max-width: auto;

    @media (max-width: 550px) {
        min-width: 150px;
    }
}

.custom-radio {
    cursor: pointer;

    .mark {
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;

        .icon {
            display: none;
            color: #000;
            font-size: 12px;
        }
    }

    input:checked+.mark {
        background: #848484;
        border-color: #848484;

        .icon {
            display: block;
            color: #fff;
        }
    }
}
</style>
