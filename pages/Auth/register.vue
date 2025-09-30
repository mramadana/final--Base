<template>
    <div class="container">

        <div class="custom-width with-auth">

            <h1 class="main-title bold lg mb-3">{{ $t("Auth.create_account") }}</h1>
            <h3 class="desc mb-4">{{ $t("Auth.enter_data_to_login") }}</h3>
            
            <!-- Sign up form -->
            <form @submit.prevent="signUp" ref="signUpForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

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
                            icon="/_nuxt/assets/images/sidebar/profile.svg"
                            :with_icon="true"
                        />

                        <!-- Mobile number input with country dropdown -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.mobile_number') }}
                            </label>
                            <div class="with_cun_select" :class="{ 'has-error': showValidation && phoneHasError }">
                                <FormInput 
                                    v-model:modelValue="phone"
                                    name="phone"
                                    type="number"
                                    :placeholder="$t('Auth.enter_mobile_number')"
                                    :validation-schema="validations.phone"
                                    :showErrors="false"
                                    :hasIcon="true"
                                    icon="/_nuxt/assets/images/sidebar/home.svg"
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

                        <!-- Email input -->
                        <FormInput 
                            v-model:modelValue="email"
                            name="email"
                            type="email"
                            :label="$t('Auth.email')"
                            :placeholder="$t('Auth.enter_email')"
                            :validation-schema="validations.email"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/sidebar/message.svg"
                            :with_icon="true"
                        />


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
                            icon="/_nuxt/assets/images/sidebar/home.svg"
                            :with_icon="true"
                        />

                        <!-- Confirm Password input -->
                        <FormInput 
                            v-model:modelValue="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            :label="$t('Auth.confirm_password_sm')"
                            :placeholder="$t('Auth.please_confirm_password')"
                            :validation-schema="validations.confirmPassword"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/sidebar/home.svg"
                            :with_icon="true"
                        />
                        
 
                        <!-- Submit button -->
                        <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                            {{ $t('Auth.confirmation') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                        </button>

                        <!-- Login link -->
                        <div class="new-sign mt-4">
                            {{ $t('Auth.already_have_account') }}
                            <nuxt-link to="/Auth/login" >{{ $t('Auth.login') }}</nuxt-link>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <!-- success modal -->
        <Dialog
            v-model:visible="successRegister"
            modal
            class="custum_dialog_width without-close"
            :draggable="false"
        >
            <div class="text-center">
                <h1 class="main-title bold mb-4 hint_success">
                    {{ $t('Auth.hint_success') }}
                </h1>
                <img
                    src="@/assets/images/check_img.svg"
                    alt="check-img"
                    class="check-img lg"
                    loading="lazy"
                />
            </div>
        </Dialog>

    </div>
</template>

<script setup>

    // Imports and utilities
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });
    
    // Form fields (moved before validation to avoid undefined errors)
    const name = ref('');
    const phone = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const address = ref('');
    
    // Validation schemas
    const { phoneNumber, password: passwordValidation, customerName, email: emailValidation } = useValidationSchema();
    
    // Validation schemas - exactly like login
    const validations = {
        name: customerName('Auth.customer_name'),
        phone: phoneNumber('Auth.mobile_number'),
        email: emailValidation('Auth.email'),
        password: passwordValidation('Auth.password'),
        confirmPassword: passwordValidation('Auth.confirm_password_sm')
    };

    // success response
    const { response } = responseApi();

    // Toast
    const { successToast, errorToast } = toastMsg();

    // Store
    const store = useAuthStore();
    const { signUpHandler } = store;
    const { lat, lng } = storeToRefs(store);

    // Form data
    const loading = ref(false);
    const showValidation = ref(false);
    const successRegister = ref(false);
    const signUpForm = ref(null);
    
    
    // Countries
    const selectedCountry = ref(null);
    
    // Form data (reactive object for validation)
    const formData = computed(() => ({
        name: name.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    }));

    // Phone validation computed properties (same as login)
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

    // Custom validation function for confirm password
    const validateConfirmPassword = (formData, validations) => {
        // First validate using the standard password validation
        try {
            validations.confirmPassword.validateSync(formData.confirmPassword);
        } catch (error) {
            return false;
        }
        
        // Then check if passwords match
        if (formData.password !== formData.confirmPassword) {
            return false;
        }
        
        return true;
    };


    // use the composable for the validation - exactly like login
    const { isFormValid, scrollToFirstError } = useFormValidation();


    // Password visibility
  

    // Sign up function - same validation pattern as login
    const signUp = async () => {
        showValidation.value = true;
        
        const isValid = isFormValid(formData.value, validations);
        const isConfirmPasswordValid = validateConfirmPassword(formData.value, validations);
        
        console.log('Is Valid:', isValid);
        console.log('Confirm Password Valid:', isConfirmPasswordValid);
        
        if(!isValid || !isConfirmPasswordValid){
            // if the form has validation errors
            if (!isConfirmPasswordValid && formData.value.password !== formData.value.confirmPassword) {
                errorToast(t('validation.confirmPassword'));
            }
            scrollToFirstError(formData.value, validations);
            console.log("Validation Failed");
        } else {
            console.log("Validation Passed");
            loading.value = true;
            
            try {
                const fd = new FormData();
                fd.append('name', name.value);
                fd.append('phone_email', phone.value);
                fd.append('email', email.value);
                fd.append('password', password.value);
                fd.append('password_confirmation', confirmPassword.value);
                fd.append('country_code', selectedCountry.value?.key || '');
                fd.append('device_id', 111);
                fd.append('device_type', 'web');
    
                // Get Returned Data From Store
                const res = await signUpHandler(fd);
                
                if (response(res) === "success") {
                    successToast(res.msg);
                    successRegister.value = true;
                    // Reset form on success
                    name.value = '';
                    phone.value = '';
                    email.value = '';
                    password.value = '';
                    confirmPassword.value = '';
                    selectedCountry.value = null;
                    showValidation.value = false;
                } else {
                    errorToast(res.msg);
                }
            } catch (error) {
                console.error('Register error:', error);
                errorToast(t('Auth.registration_failed'));
            } finally {
                loading.value = false;
            }
        }
    };

    // Page meta
    definePageMeta({
        name: "Auth.create_account",
        layout: 'auth'
    });
</script>

<style scoped>
.with_cun_select.has-error {
    border: 1px solid #e74c3c !important;
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
}

.main_input.is-invalid {
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