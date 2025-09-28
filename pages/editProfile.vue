<template>
    <div>
        <div class="layout-form">
            <h1 class="main-title bold lg mb-5">{{ $t("Home.edit_profile") }}</h1>
            <form @submit.prevent="editProfile" ref="editProfileform">
                <div class="form-group">
                    <div class="input_auth">
                        <div class="edit-label">
                            <i class="fas fa-edit"></i>
                        </div>
                        <GlobalImgUploader acceptedFiles="image/*" :newImages="image" name="image" @uploaded-images-updated="updateUploadedImages_1" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="label">
                        {{ $t('profile.store_name') }}
                    </label>
                    <div class="main_input">
                        <i class="fas fa-store sm-icon"></i>
                        <input type="text" class="custum-input-icon" name="name" readonly v-model="name" :placeholder="$t('Auth.enter_username')">
                    </div>
                </div>

                <!-- Scope of work input -->
                <div class="form-group">
                    <label class="label">
                        {{ $t('Auth.scope_work') }}
                    </label>
                    <div class="main_input">
                        <i class="far fa-building sm-icon"></i>
                        <input type="text" class="custum-input-icon" name="scope_work" v-model="scope_work" :placeholder="$t('Auth.enter_scope_work')">
                    </div>
                </div>

                <!-- Shop images upload (optional) -->
                <div class="form-group">
                    <label class="label">{{ $t('Auth.shop_images') }}</label>
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

                <!-- google_maps_link -->

                <!-- <label for="" class="label">google_maps_link</label>
                <div class="main_input">
                    <input type="text" class="custum-input-icon" name="google_maps_link" v-model="google_maps_link" :placeholder="$t('Auth.enter_scope_work')">
                </div>

                <button type="button" class="custom-btn mt-5" @click="openGoogleMaps(google_maps_link)">{{ $t('Global.open_in_google_maps') }}</button> -->
                
                
                <button class="custom-btn mt-5">
                    {{ $t('Global.Saving_changes') }}
                    <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                        aria-hidden="true"></span>
                </button>
            </form>
        </div>

        <Dialog v-model:visible="successfullyChange" modal class="custum_dialog_width without-close" :draggable="false" >
            <div class="text-center">
                <img src="@/assets/images/check.png" alt="check-img" class="check-img">
                <h3 class="main-title bold mb-4">{{ $t('Global.Saving_changes_success') }}</h3>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Home.edit_profile",
        middleware: 'auth',
    });

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

// Store
const store = useAuthStore();

// success response
const { response } = responseApi();

const { profileHandler } = store;

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// const google_maps_link = ref('');


/******************* Data *******************/

const image = ref('');
const name = ref('');
const successfullyChange = ref(false);
const errors = ref([]);

const loading = ref(false);

const { token } = storeToRefs(useAuthStore());

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


const uploadedImage = ref([]);

const uploadedImage_2 = ref([]);

const delivery = ref('is_delivery');
const delivery_country = ref('in_iraq');

const editProfileform = ref(null);

    // config
    const config = computed(()=> {
       return { headers: { Authorization: `Bearer ${token.value}` } }
    });

//  ************************ methods **********************

    const updateUploadedImages_1 = (images) => {
        uploadedImage.value = images;
    };

    const updateUploadedImages_2 = (images) => {
        uploadedImage_2.value = Array.isArray(images) ? images : [images];
        console.log(uploadedImage_2.value, "uploadedImage_2.value")
    };

    // Validation Function
    function validate() {
        errors.value = [];
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }
    };

    const { data: profile , refresh } = await useApiFetch("profile", config.value);

    if (profile.value?.data) {
        name.value = profile.value?.data?.name;
        image.value = profile?.value?.data?.image;
    }

    //  get profile data
    // const profile = async () => {
    //     const { data: response, refresh } = await useApiFetch('profile', config.value);
    //     if (response.value?.data) {
    //         name.value = response.value.data.name;
    //         image.value = response?.value?.data?.image;
    //     }

    // };

    // profile();

    const editProfile = async () => {
        loading.value = true;
        const fd = new FormData(editProfileform.value);
        loading.value = true;

        validate();

        // Get Returned Data From Store
        const res = await profileHandler(fd);

        if (res.status == "success") {
            successToast(res.msg);
            successfullyChange.value = true;
            setTimeout(() => {
                successfullyChange.value = false
                navigateTo("/settings");
            }, 1000);
        } else {
            errorToast(res.msg);
        }

        loading.value = false;

    }

    // open google maps
    const openGoogleMaps = (link) => {
        if (link) {
            if(link.startsWith('http') || link.startsWith('https')) {
                const url = `${link}`;  
                window.open(url, '_blank');
            } else {
                const url = `http://maps.google.com/?q=${link}`;
                window.open(url, '_blank');
            }
        }
    };

    onMounted( async () => {
        await refresh();
    });
    

</script>
