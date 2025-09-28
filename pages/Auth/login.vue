<template>
    <div class="custom-width with-auth">
        <h1 class="main-title bold lg mb-3">{{ $t("Auth.login") }}</h1>
        <h3 class="desc mb-4">{{ $t("Auth.enter_data_to_login") }}</h3>
        <form @submit.prevent="login" ref="loginForm">
            <div class="row">
                <div class="col-12 col-md-8 mr-auto">

                    <div class="form-group">
                        <label class="label">
                            {{ $t('Auth.mobile_number') }}
                        </label>
                        <div class="with_cun_select">
                            <!-- <input type="number" class="main_input validInputs" valid="phone" name="phone_email" v-model="phone" :placeholder="$t('Auth.please_mobile_number')"> -->
                            <FormInput 
                                v-model:modelValue="phone"
                                name="phone"
                                type="number"
                                :placeholder="$t('Auth.mobile_number')"
                                :validation-schema="validations.phone"
                                :showErrors="showValidation"
                                :hasIcon="true"
                                icon="/_nuxt/assets/images/sidebar/home.svg"
                                :with_icon="true"
                            />
                            <GlobalCountryDropdown
                              v-model="selectedCountry"
                              :placeholder="$t('Auth.select_country')"
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="label edit_label">
                            {{ $t('Auth.password') }} 
                        </label>
                        <div class="main_input with_icon">
                            <input :type="inputType" class="custum-input-icon validInputs" valid="password" name="password" v-model="password"
                                :placeholder="$t('Auth.please_enter_password')">
                            <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility"
                                :class="{ 'active_class': passwordVisible }">
                                <i class="far fa-eye icon"></i>
                            </button>
                        </div>
                    </div>

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
    const { phoneNumber } = useValidationSchema();
    const validations = {
        phone: phoneNumber('Auth.mobile_number')
    };

    // success response
    const { response } = responseApi();

    // Toast
    const { successToast, errorToast } = toastMsg();

    // Store
    const store = useAuthStore();

    const { signInHandler } = store;

    const loading = ref(false);
    const errors = ref([]);
    const showValidation = ref(false);
    
    // countries
    const selectedCountry = ref(null);
    const loginForm = ref(null);
    const phone = ref('');
    const password = ref('');
    const passwordVisible = ref(false);

    // validation Function
    const validate = () => {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
            }
        }
    }


    // login Function
    const login = async () => {
        loading.value = true;
        const fd = new FormData(loginForm.value);
        fd.append('country_code', selectedCountry.value.key);
        fd.append('device_id', 111);
        fd.append('device_type', 'web');

        // fd.append('device_id', notificationToken.value);

        validate();

        if (errors.value.length) {
            showValidation.value = true;
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {

            loading.value = true;

            // Get Returned Data From Store
            const res = await signInHandler(fd);
            res.status == "success" ? successToast(res.msg) : errorToast(res.msg);

            loading.value = false;
        }
    }

    // toggle password
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value
    }

    // input type

    
    const inputType = computed(() => {
      return passwordVisible.value ? 'text' : 'password';
    });


</script>
