<template>
    <div>
        <div class="layout-form">
            <form ref="addUserForm">

                <div class="row">

                    <div class="col-12 col-md-6">
                        <!-- Customer name input -->
                        <FormInput v-model:modelValue="name" name="name" type="text" :label="$t('Auth.customer_name')"
                            :placeholder="$t('Auth.customer_name')" :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/user.svg" :with_icon="true" :readonly="true" />
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Mobile number input with country dropdown -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t("Auth.mobile_number") }}
                            </label>
                            <div class="with_cun_select" :class="{ 'is-invalid': phoneInputRef?.shouldShowError }">
                                <FormInput ref="phoneInputRef" v-model:modelValue="phone" name="phone" type="number"
                                    :placeholder="$t('Auth.enter_mobile_number')"
                                    :moveErrorToParent="true" :hasIcon="true"
                                    icon="/_nuxt/assets/images/auth-img/mobile.svg" :with_icon="true" :readonly="true" />
                                <GlobalCountryDropdown v-model="selectedCountry"
                                    :placeholder="$t('Auth.select_country')" :disabled="true" />
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Email input -->
                        <FormInput v-model:modelValue="email" name="email" type="email" :label="$t('Auth.email')"
                            :placeholder="$t('Auth.enter_email')" :hasIcon="true" icon="/_nuxt/assets/images/auth-img/sms.svg"
                            :with_icon="true" :readonly="true" />
                    </div>

                    <div class="col-12 col-md-6">
                        <!-- Password input -->
                        <FormInput v-model:modelValue="password" name="password" type="password"
                            :label="$t('Auth.password')" :placeholder="$t('Auth.please_enter_password')"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/lock.svg" :with_icon="true" :readonly="true" />
                    </div>

                    <div class="col-12">
                        <h4 class="main-title md mb-4">{{ $t('users.permissions') }}</h4>
                        
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
                                                <input type="checkbox" v-model="permission.selected" class="d-none" disabled />
                                                <span class="mark m-0">
                                                    <i class="fas fa-check icon"></i>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
// Imports and utilities
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const route = useRoute();
const userId = ref(route.query.id || null);

// Form fields (moved before validation to avoid undefined errors)
const name = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");

const fakePermissions = ref([
    { key: "edit", label: t('users.permission_edit'), selected: false },
    { key: "delete_user", label: t('users.permission_delete_user'), selected: false },
    { key: "add", label: t('users.permission_add'), selected: false },
    { key: "manage_offers", label: t('users.permission_manage_offers'), selected: false },
    { key: "support", label: t('users.permission_support'), selected: false },
]);

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// Form data
const showValidation = ref(false);
const addUserForm = ref(null);

// Countries
const selectedCountry = ref(null);

// FormInput ref for phone
const phoneInputRef = ref(null);

// Fetch user data for display
const fetchUserData = async () => {
    try {
        const res = await axios.get(`users?id=${userId.value}`);
        if (response(res) === "success") {
            const userData = res.data.user;
            name.value = userData.name || "";
            phone.value = userData.phone || "";
            email.value = userData.email || "";
            password.value = "••••••••"; // Mask password for display
            selectedCountry.value = userData.country ? { key: userData.country_code, name: userData.country } : null;
            
            // Set permissions
            if (userData.permissions) {
                const userPermissions = Array.isArray(userData.permissions) ? userData.permissions : JSON.parse(userData.permissions);
                fakePermissions.value.forEach(permission => {
                    permission.selected = userPermissions.includes(permission.key);
                });
            }
        }
    } catch (error) {
        console.error("Fetch user error:", error);
        errorToast(t("Auth.fetch_failed"));
    }
};

// OnMounted - Get user data on page load
onMounted(async () => {
    await fetchUserData();
});

// Set page title
const globalStore = useGlobalStore();
globalStore.title = t('users.users');
globalStore.titleIcon = 'fa-solid fa-angle-left';
globalStore.subTitleIcon = 'fa-solid fa-angle-left';
globalStore.titleLink = '/users';
globalStore.subtitle = t('sideMenu.view_users');
globalStore.subSubTitle = t('users.user_details');

// Page meta
definePageMeta({
    name: "users.user_details",
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
