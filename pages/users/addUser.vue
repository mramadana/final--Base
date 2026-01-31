<template>
    <div>
        <div class="layout-form">
            <form @submit.prevent="addUser" ref="addUserForm">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- Customer name input -->
                        <FormInput
                            v-model:modelValue="name"
                            name="name"
                            type="text"
                            :label="$t('Auth.customer_name')"
                            :placeholder="$t('Auth.customer_name')"
                            :validation-schema="validations.name"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            :icon="userIcon"
                            :with_icon="true"
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Mobile number input with country dropdown -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t("Auth.mobile_number") }}
                            </label>
                            <div
                                class="with_cun_select"
                                :class="{
                                    'is-invalid':
                                        phoneInputRef?.shouldShowError,
                                }"
                            >
                                <FormInput
                                    ref="phoneInputRef"
                                    v-model:modelValue="phone"
                                    name="phone"
                                    type="number"
                                    :placeholder="
                                        $t('Auth.enter_mobile_number')
                                    "
                                    :validation-schema="validations.phone"
                                    :showErrors="showValidation"
                                    :moveErrorToParent="true"
                                    :hasIcon="true"
                                    :icon="mobileIcon"
                                    :with_icon="true"
                                />
                                <GlobalCountryDropdown
                                    v-model="selectedCountry"
                                    :placeholder="$t('Auth.select_country')"
                                />
                            </div>
                            <!-- Display validation error message for phone -->
                            <p
                                v-if="phoneInputRef?.shouldShowError"
                                class="error-message text-danger mt-1"
                                :class="phoneInputRef?.localeDir"
                            >
                                {{ phoneInputRef?.errorMessage }}
                            </p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Password input -->
                        <FormInput
                            v-model:modelValue="password"
                            name="password"
                            type="password"
                            :label="$t('Auth.password')"
                            :placeholder="$t('Auth.please_enter_password')"
                            :validation-schema="validations.password"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            :icon="lockIcon"
                            :with_icon="true"
                        />
                    </div>

                    <div class="col-12">
                        <!-- Permissions -->
                        <h4 class="main-title lg mb-4">
                            {{ $t("users.permissions") }}
                        </h4>

                        <!-- Loading state -->
                        <div v-if="loadingPermissions" class="text-center py-4">
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            <span class="ms-2">{{
                                $t("users.loading_permissions")
                            }}</span>
                        </div>

                        <!-- Permissions Sections -->
                        <div v-else class="permissions-wrapper">
                            <div
                                v-for="(
                                    section, sectionIndex
                                ) in permissionSections"
                                :key="sectionIndex"
                                class="permission-section mb-4"
                            >
                                <!-- Section Title -->
                                <h5 class="section-title mb-3">
                                    {{ section.title }}
                                </h5>

                                <!-- Permissions in this section -->
                                <div
                                    class="permissions-section d-flex flex-wrap align-items-center gap-3"
                                >
                                    <div
                                        v-for="(
                                            permission, permIndex
                                        ) in section.permissions"
                                        :key="permIndex"
                                        class="mb-3"
                                    >
                                        <div
                                            class="d-flex align-items-center justify-content-between payment-field"
                                        >
                                            <div
                                                class="check-text hint d-flex ml-4"
                                            >
                                                <div class="main-title mb-0">
                                                    {{ permission.title }}
                                                </div>
                                            </div>

                                            <!-- Checkbox -->
                                            <div
                                                class="radios form-group check-inner mb-0"
                                            >
                                                <div
                                                    class="d-flex align-items-center justify-content-between gap-3"
                                                >
                                                    <label
                                                        class="custom-radio custom-check"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            v-model="
                                                                permission.is_selected
                                                            "
                                                            class="d-none"
                                                        />
                                                        <span class="mark m-0">
                                                            <i
                                                                class="fas fa-check icon"
                                                            ></i>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="showValidation && validations.permissions"
                            class="text-danger mt-1"
                        >
                            <span v-if="getValidationError('permissions')">
                                {{ getValidationError("permissions") }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Submit button -->
                <button
                    type="submit"
                    class="custom-btn md mt-4"
                    :disabled="loading"
                >
                    {{ $t("sideMenu.add_user") }}
                    <span
                        class="spinner-border spinner-border-sm"
                        v-if="loading"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
// Imports and utilities
import { useI18n } from "vue-i18n";

// Icons
import userIcon from '@/assets/images/auth-img/user.svg';
import mobileIcon from '@/assets/images/auth-img/mobile.svg';
import lockIcon from '@/assets/images/auth-img/lock.svg';

const { t } = useI18n({ useScope: "global" });

// Form fields (moved before validation to avoid undefined errors)
const name = ref("");
const phone = ref("");
const password = ref("");
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const config = computed(() => ({
    headers: { Authorization: `Bearer ${token.value}` },
}));
// Validation schemas
const {
    phoneNumber,
    customerName,
    multipleCheckboxes,
    password: passwordValidation,
} = useValidationSchema();

// Permissions data
const permissionSections = ref([]);
const loadingPermissions = ref(false);

// Fetch permissions from API
const fetchPermissions = async () => {
    loadingPermissions.value = true;
    try {
        const res = await axios.get(
            "provider/admins/permissions",
            config.value,
        );
        if (response(res) === "success") {
            permissionSections.value = res?.data?.data || [];
        } else {
            errorToast(res?.data?.msg || t("users.failed_to_load_permissions"));
        }
    } catch (error) {
        console.error("Error fetching permissions:", error);
        errorToast(t("users.failed_to_load_permissions"));
    } finally {
        loadingPermissions.value = false;
    }
};

// Get selected permissions (slugs)
const selectedPermissions = computed(() => {
    const selected = [];
    permissionSections.value.forEach((section) => {
        section.permissions?.forEach((permission) => {
            if (permission.is_selected) {
                selected.push(permission.slug);
            }
        });
    });
    return selected;
});

// Validation schemas - exactly like login
const validations = {
    name: customerName("Auth.customer_name"),
    phone: phoneNumber("Auth.mobile_number"),
    permissions: multipleCheckboxes("Auth.permissions", 1),
    password: passwordValidation("Auth.password"),
};

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form data
const loading = ref(false);
const showValidation = ref(false);
const addUserForm = ref(null);

// Countries
const selectedCountry = ref(null);

// FormInput ref for phone
const phoneInputRef = ref(null);

// Form data (reactive object for validation)
const formData = computed(() => ({
    name: name.value,
    phone: phone.value,
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

// Add user function - same validation pattern as login
const addUser = async () => {
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
            const fd = new FormData(addUserForm.value);
            fd.append("country_id", selectedCountry.value?.id || "");
            selectedPermissions.value.forEach((slug) => {
                fd.append("permissions[]", slug);
            });
            const res = await axios.post(
                "provider/admins/store",
                fd,
                config.value,
            );
            console.log(res?.data.key, "res");
            if (response(res) === "success") {
                successToast(res?.data?.msg);
                navigateTo("/users");
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
globalStore.title = t("users.users");
globalStore.titleIcon = "fa-solid fa-angle-left";
globalStore.titleLink = "/users";
globalStore.subtitle = t("sideMenu.add_user");

// Fetch permissions on component mount
onMounted(() => {
    fetchPermissions();
});

// Page meta
definePageMeta({
    name: "sideMenu.add_user",
    layout: "default",
    middleware: "auth",
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
.permissions-wrapper {
    .permission-section {
        border-bottom: 1px solid #ffffff1a;
        padding-bottom: 20px;

        &:last-child {
            border-bottom: none;
        }

        .section-title {
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
        }
    }
}

.payment-field {
    padding: 20px 15px;
    background-color: #ffffff0f;
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

    input:checked + .mark {
        background: #848484;
        border-color: #848484;

        .icon {
            display: block;
            color: #fff;
        }
    }
}

.main_input,
.with_cun_select,
.dropdown_card,
.dropdown_card .p-dropdown {
    background-color: #262626 !important;
}

.dropdown_card :deep(.p-dropdown) {
    background-color: transparent;
}
</style>
