<template>
    <div class="container">

        <div class="custom-width with-auth">

            <h1 class="main-title bold lg mb-3">{{ $t("Auth.create_account") }}</h1>
            <h3 class="desc mb-4">{{ $t("Auth.enter_data_to_login") }}</h3>
            
            <!-- Sign up form -->
            <form @submit.prevent="signUp" ref="signUpForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

                        <!-- Profile image upload -->
                        <div class="form-group">
                            <label class="label">{{ $t('Auth.image') }}</label>
                            <div class="input_auth without-edit">
                                <img src="@/assets/images/noun_upload.svg" loading="lazy" alt="default-img" :class="{'hidden-default' : uploadedImage.length > 0, 'default-class': true}">
                                <span>{{ $t("Global.attach_photo") }}</span>
                                <GlobalImgUploader acceptedFiles="image/*" :newImages="logo" name="image" @uploaded-images-updated="updateUploadedImages_1" />
                            </div>
                        </div>

                        <!-- Provider name input -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.provider_Name') }}
                            </label>
                            <div class="main_input">
                                <input type="text" class="custum-input-icon validInputs" valid="name" name="name" v-model="name" :placeholder="$t('Auth.full_name')">
                            </div>
                        </div>

                        <!-- Mobile number input with country dropdown -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.mobile_number') }}
                            </label>
                            <div class="with_cun_select">
                                <input type="number" class="main_input validInputs" valid="phone" name="phone_email" v-model="phone" :placeholder="$t('Auth.please_mobile_number')">
                                <GlobalCountryDropdown
                                    v-model="selectedCountry"
                                    :placeholder="$t('Auth.select_country')"
                                />          
                            </div>
                        </div>

                        <!-- Scope of work input -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.scope_work') }}
                            </label>
                            <div class="main_input">
                                <input type="text" class="custum-input-icon validInputs" valid="job" name="scope_work" v-model="scope_work" :placeholder="$t('Auth.enter_scope_work')">
                            </div>
                        </div>

                        <!-- Service provider location input -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.service_provider_location') }}
                            </label>
                            <div class="main_input pointer" @click="openmodal">
                                <input name="address" v-model="address" class="custum-input-icon validInputs pointer" valid="password" readonly :placeholder=" $t('Auth.enter_service_provider_location') ">
                                <button class="static-btn" type="button">
                                    <font-awesome-icon :icon="['fas', 'location-crosshairs']" class="icon" />
                                </button>
                            </div>
                        </div>

                        <!-- Password input with visibility toggle -->
                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.password') }}
                            </label>
                            <div class="main_input">
                                <input :type="inputType('definitelyNewPassword')" name="password" v-model="password" class="custum-input-icon validInputs" valid="password" :placeholder=" $t('Auth.please_enter_password') ">
                                <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility('definitelyNewPassword')" :class="{ 'active_class': passwordVisible.definitelyNewPassword }">
                                    <i class="far fa-eye icon"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Shop images upload (optional) -->
                        <div class="form-group">
                            <label class="label">{{ $t('Auth.shop_images') }} {{ $t('Auth.optional') }}</label>
                            <div class="position-relative">
                                <div class="input_auth without-edit">
                                    <img src="@/assets/images/noun_upload.svg" loading="lazy" alt="default-img" :class="{'hidden-default' : uploadedImage_2.length > 0, 'default-class': true}">
                                    <span>{{ $t("Global.attach_photos") }}</span>
                                </div>
                                <GlobalImgUploader
                                    acceptedFiles="image/*, application/*" 
                                    :IsMultible="true"
                                    :newImages="logo" 
                                    name="image" 
                                    @uploaded-images-updated="updateUploadedImages_2" 
                                />
                            </div>
                        </div>

                        <!-- Delivery options -->
                        <div class="row mb-3">
                            <div class="col-12 col-lg-6">
                                <label class="inner-radio">
                                    <input type="radio" class="d-none radio-input" name="delivery" v-model="delivery" value="is_delivery">
                                    <div class="check-inner">
                                        <p class="hint-inner">
                                            <span class="radio-body"></span>
                                        </p>
                                        <p class="hint-text">
                                            {{ $t('Auth.delivery_available') }}
                                        </p>
                                    </div>
                                </label>
                            </div>
    
                            <div class="col-12 col-lg-6">
                                <label class="inner-radio">
                                    <input type="radio" class="d-none radio-input" name="delivery" v-model="delivery" value="not_delivery">
                                    <div class="check-inner">
                                        <p class="hint-inner">
                                            <span class="radio-body"></span>
                                        </p>
                                        <p class="hint-text">
                                            {{ $t('Auth.delivery_not_available') }}
                                        </p>
                                    </div>
                                </label>
                            </div>
    
                            <div class="col-12 col-lg-6">
                                <label class="inner-radio">
                                    <input type="radio" class="d-none radio-input" name="in_iraq" value="in_iraq" v-model="delivery_country">
                                    <div class="check-inner">
                                        <p class="hint-inner">
                                            <span class="radio-body"></span>
                                        </p>
                                        <p class="hint-text">
                                            {{ $t('Auth.all_over_Iraq') }}
                                        </p>
                                    </div>
                                </label>
                            </div>
    
                            <div class="col-12 col-lg-6">
                                <label class="inner-radio">
                                    <input type="radio" class="d-none radio-input" name="in_iraq" value="out_iraq" v-model="delivery_country">
                                    <div class="check-inner">
                                        <p class="hint-inner">
                                            <span class="radio-body"></span>
                                        </p>
                                        <p class="hint-text">
                                            {{ $t('Auth.within_specific_governorates') }}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Governorates selection for out-of-Iraq delivery -->
                        <div v-if="delivery_country === 'out_iraq'">
                            <div class="form-group">
                                <label class="label">{{$t('Auth.governorates_delivery')}}</label>
                                <div class="card flex justify-content-center dropdown_card">
                                    <MultiSelect v-model="selectedCities" display="chip" :options="cities" optionLabel="name" :placeholder="$t('Auth.select_governorates')"
                                    :maxSelectedLabels="cities.length" class="custum-dropdown" />
                                </div>
                            </div>
                        </div>
                        
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

        <!-- global google map component -->
        <GlobalGoogleMap
            v-model:visible="visible"
            @closeModal="updateAddress"
            @updateAddress="handleUpdateAddress"
            @handleClose="handleClose"
            :show_inputs="show_inputs"
            :lat="location.lat"
            :lng="location.lng"
            :current_location="currentLocation"
            :isDraggable="true"
            :closeModal_btn="closeModal_btn"
            :current_location_button="true"
            :title= "$t('Global.current_location')"
        />
    </div>
</template>

<script setup>

    // Cities data
    const selectedCities = ref(null);
    const cities = ref([
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Tokyo', code: 'TKY' },
        { name: 'Beijing', code: 'BJG' },
        { name: 'Shanghai', code: 'SHG' },
    ]);

    // Imports and utilities
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });
    const { successToast, errorToast } = toastMsg();

    // Form data
    const successRegister = ref(false);
    const phone = ref(null);
    const { signUpHandler } = useAuthStore();
    const store = useAuthStore();
    const { lat, lng } = storeToRefs(store);
    const delivery = ref('is_delivery');
    const delivery_country = ref('in_iraq');
    const signUpForm = ref(null);
    const selectedCountry = ref(null);
    const uploadedImage = ref([]);
    const uploadedImage_2 = ref([]);
    const errors = ref([]);
    const loading = ref(false);
    const password = ref('');

    // Google map related
    const closeModal_btn = ref(true);
    const handleClose = () => {
        visible.value = false
    }
    const address = ref("");
    const handleUpdateAddress = (newAddress) => {
        location.value = newAddress;
    };
    const updateAddress = () => {
        address.value = location.value.address;
        handleClose();
    };
    const currentLocation = ref(false);
    const openmodal = () => {
        visible.value = true;
        setTimeout(() => {
            currentLocation.value = true;
        }, 300);
    };
    const location = ref({
        lat: lat.value,
        lng: lng.value
    });
    const show_inputs = ref(false);
    const visible = ref(false);

    // Password visibility
    const passwordVisible = ref({
        definitelyNewPassword: false,
    });

    // Image upload handlers
    const updateUploadedImages_1 = (images) => {
        uploadedImage.value = images;
    };
    const updateUploadedImages_2 = (images) => {
        uploadedImage_2.value = Array.isArray(images) ? images : [images];
        console.log(uploadedImage_2.value, "uploadedImage_2.value 222222")
    };

    // Password visibility toggle
    const togglePasswordVisibility = (input) => {
        passwordVisible.value[input] = !passwordVisible.value[input];
    };
    const inputType = (input) => {
        return passwordVisible.value[input] ? 'text' : 'password';
    }

    // Form validation
    function validate() {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }
        if( address.value == '') {
            errors.value.push(t(`validation.address`));
        }
        if(phone.value == 0) {
            phone.value = null
        }
    };

    // Sign up function
    const signUp = async () => {
        const fd = new FormData(signUpForm.value);
        fd.append('country_code', selectedCountry.value.key);
        validate();
        if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {
            loading.value = true;
            const res = await signUpHandler(fd);
            res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
            loading.value = false;
        }
    };

    // Page meta
    definePageMeta({
        name: "Auth.create_account",
        layout: 'auth'
    });
</script>