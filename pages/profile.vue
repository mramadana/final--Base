<template>
        <div class="layout-form">

            <h1 class="main-title bold lg mb-5">{{ $t("profile.profile_img") }}</h1>

            <form @submit.prevent="editProfile" ref="editProfileform" v-if="status != 'pending'">
                <div class="d-flex align-items-center gap-3">

                    <div class="form-group">
                        <div class="input_auth without_label">
                            <div class="edit-label">
                                <i class="fas fa-edit"></i>
                            </div>
                            <GlobalImgUploader acceptedFiles="image/*" :newImages="profile?.data?.image" name="image" @uploaded-images-updated="updateUploadedImages_1" />
                        </div>
                    </div>

                    <NuxtLink to="/editProfile" class="custom-btn sm main_2">
                        {{ $t("Home.edit_profile") }}
                    </NuxtLink>
    
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

                <div class="form-group">
                    <label class="label">
                        {{ $t('Auth.mobile_number') }}
                    </label>
                    <div class="with_cun_select main_input">
                        <i class="fas fa-mobile-alt sm-icon"></i>
                        <input type="number" class="main_input" name="phone_email" v-model="phone" :placeholder="$t('Auth.please_mobile_number')">
                        <GlobalCountryDropdown
                            v-model="selectedCountry"
                            ref="countryDropdownRef"
                            :placeholder="$t('Auth.select_country')"
                        />
                    </div>
                </div>

                <GlobalCustomDropdown
                    v-model="specialization"
                    :options="specializations"
                    :placeholder="$t('Auth.specialization')"
                    :label="$t('Auth.specialization')"
                    :hasIcon="true"
                    icon="fa-box"
                />

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

                <label class="label">
                    {{ $t('profile.type_delivery') }}
                </label>

                <p class="main-title sm fw-500">dsdssd</p>

            </form>
        </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });

definePageMeta({
    name: "Home.profile_personly",
    // middleware: 'auth'
});
// pinia store

// success response
const { response } = responseApi();

const specialization = ref(null);
const specializations = ref([

{ id: 1, name: 'Medicine' },

{ id: 2, name: 'Engineering' },

{ id: 3, name: 'Law' },

]);

// // Axios
const axios = useApi();

const uploadedImage_2 = ref([]);


/******************* Data *******************/

// Store
const store = useAuthStore();


const loading = ref(false);

const { token } = storeToRefs(store);

const uploadedImage = ref([]);

const selectedCountry = ref(null);
const image = ref('');
const name = ref('');
const phone = ref('');
const email = ref('');

const editProfileform = ref(null);

const countryDropdownRef = ref(null);

    // method to update images
    const updateUploadedImages_1 = (images) => {
        uploadedImage.value = images;
    };

    const updateUploadedImages_2 = (images) => {
        uploadedImage_2.value = Array.isArray(images) ? images : [images];
        console.log(uploadedImage_2.value, "uploadedImage_2.value")
    };

     // config
     const config = computed(()=> {
       return { headers: { Authorization: `Bearer ${token.value}` } }
    });

    //  get profile data
    // const profile = async () => {
    //     const { data: response } = await useApiFetch('profile', config.value);
    //     if (response.value?.data) {
    //         name.value = response.value.data.name;
    //         phone.value = response.value.data.phone;
    //         image.value = response?.value?.data?.image;

    //         // Use the countries data from the CountryDropdown component

    //         if(!countryDropdownRef.value?.countries?.data) return;
    //         watch(() => countryDropdownRef.value?.countries?.data, (countries) => {
    //             if (countries?.length) {
    //                 selectedCountry.value = countries.find(
    //                     country => country.id === response.value?.data?.country_id
    //                 ) || countries[0] || null;
    //             }
    //         }, { immediate: true });
    //         }

    // };

    const { data: profile , refresh } = await useApiFetch("profile", config.value);

    if (profile.value?.data) {
        name.value = profile.value?.data?.name;
        phone.value = profile.value?.data?.phone;
        image.value = profile.value?.data?.image;
        if(countryDropdownRef.value?.countries?.data) {
            watch(() => countryDropdownRef.value?.countries?.data, (countries) => {
                if (countries?.length) {
                    selectedCountry.value = countries.find(
                        country => country.id === profile.value?.data?.country_id
                    ) || countries[0] || null;
                }
            }, { immediate: true });
        }
    }

    onMounted(() => {
         refresh();
    })
</script>
