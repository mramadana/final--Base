<template>
    <div class="container_layout">
        <h1 class="main-title bold lg mb-3">{{ $t("Auth.login") }}</h1>
        <h3 class="desc mb-4">{{ $t("Auth.enter_data_to_login") }}</h3>
        <form @submit.prevent="login" ref="loginForm">
            <img src="@/assets/images/Logo.svg" alt="login-image" class="logo-image d-block mt-5 mx-auto mb-4">
            <div class="row">
                <div class="col-12 col-md-8 mr-auto">

                    <div class="form-group">
                        <label class="label">
                            {{ $t('Auth.mobile_number') }}
                        </label>
                        <div class="with_cun_select" :class="{ 'has-error': showValidation && phoneHasError }">
                            <FormInput 
                                v-model:modelValue="phone"
                                name="phone"
                                type="number"
                                :placeholder="$t('Auth.mobile_number')"
                                :validation-schema="validations.phone"
                                :showErrors="false"
                                :hasIcon="true"
                                icon="/_nuxt/assets/images/auth-img/mobile.svg"
                                :with_icon="true"
                            />
                            <GlobalCountryDropdown
                              v-model="selectedCountry"
                              :placeholder="$t('Auth.select_country')"
                            />
                        </div>
                        <!-- Display validation error message for phone -->
                        <p v-if="showValidation && phoneHasError" class="error-message text-danger mt-1">{{ phoneErrorMessage }}</p>
                    </div>

                    <FormInput 
                        v-model:modelValue="password"
                        name="password"
                        type="password"
                        :label="$t('Auth.password')"
                        :placeholder="$t('Auth.please_enter_password')"
                        :validation-schema="validations.password"
                        :showErrors="showValidation"
                        :hasIcon="true"
                        icon="/_nuxt/assets/images/auth-img/lock.svg"
                        :with_icon="true"
                    />

                    <nuxt-link to="restorePassword">
                        <p class="f-password">{{ $t('Auth.forget_password') }}</p>
                    </nuxt-link>

                    <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                        {{ $t('Auth.login') }}
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                aria-hidden="true"></span>
                    </button>

                    <div class="new-sign mt-4">
                        {{ $t('Auth.dont_have_account') }}
                        <nuxt-link to="/Auth/register" >{{ $t('Auth.create_account') }}</nuxt-link>
                    </div>
                    
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>

    import { useI18n } from 'vue-i18n';

    definePageMeta({
        name: "Auth.login",
        layout: 'auth'
    })

    const { t } = useI18n({ useScope: 'global' });

    // Validation schemas
    const { phoneNumber, password: passwordValidation } = useValidationSchema();
    const validations = {
        phone: phoneNumber('Auth.mobile_number'),
        password: passwordValidation('Auth.password')
    };

    // success response
    const { response } = responseApi();

    // Toast
    const { successToast, errorToast } = toastMsg();

    // Store
    const store = useAuthStore();

    const { signInHandler } = store;

    const loading = ref(false);
    const showValidation = ref(false);
    
    // countries
    const selectedCountry = ref(null);
    const loginForm = ref(null);
    const phone = ref('');
    const password = ref('');
    const passwordVisible = ref(false);
    
    // Form data (reactive object for validation)
    const formData = computed(() => ({
        phone: phone.value,
        password: password.value
    }));

    // Phone validation computed properties
    const phoneHasError = computed(() => {
        if (!validations.phone) return false;
        try {
            validations.phone.validateSync(phone.value);
            return false;
        } catch (error) {
            return true;
        }
    });

    const phoneErrorMessage = computed(() => {
        if (!phoneHasError.value) return '';
        try {
            validations.phone.validateSync(phone.value);
            return '';
        } catch (error) {
            return error.message;
        }
    });

    // use the composable for the validation - exactly like your example
    const { isFormValid, scrollToFirstError } = useFormValidation();


    // login Function
    const login = async () => {
        showValidation.value = true;
        
        const isValid = isFormValid(formData.value, validations);
        console.log('Is Valid:', isValid);
        

        if(!isValid){
            // if the images are valid but the inputs have errors
            scrollToFirstError(formData.value, validations);
            console.log("22222222222");
        } else {
            console.log("11111111111 - Validation Passed");
            loading.value = true;
            
            try {
                const fd = new FormData();
                fd.append('phone_email', phone.value);
                fd.append('password', password.value);
                fd.append('country_code', selectedCountry.value?.key || '');
                fd.append('device_id', 111);
                fd.append('device_type', 'web');
    
                // Get Returned Data From Store
                const res = await signInHandler(fd);
                
                if (response(res) === "success") {
                    successToast(res.msg);
                    // Reset form on success
                    phone.value = '';
                    password.value = '';
                    showValidation.value = false;
                } else {
                    errorToast(res.msg);
                }
            } catch (error) {
                console.error('Login error:', error);
                errorToast(t('Auth.login_failed'));
            } finally {
                loading.value = false;
            }
        }
        
    }



</script>

<style scoped>
.with_cun_select.has-error {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}

.error-message {
    font-size: 12px;
    color: #e74c3c;
    font-weight: 500;
    margin-top: 5px;
}
</style>
