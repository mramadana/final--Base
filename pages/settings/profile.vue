<template>
    <div>
        <h1 class="main-title bold mb-5 head-title">{{ $t("Home.profile_personly") }}</h1>
        <div class="container">
            <form @submit.prevent="editProfile" ref="editProfileform">
                <div class="row pb-4">
                    <div class="col-12 col-md-6">


                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.username') }}
                            </label>
                            <div class="main_input">
                                <i class="fas fa-user sm-icon"></i>
                                <input type="text" class="custum-input-icon" name="name" readonly v-model="name" :placeholder="$t('Auth.enter_username')">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.mobile_number') }}
                            </label>
                            <div class="with_cun_select">
                                <div class="main_input">
                                    <i class="fas fa-mobile-alt sm-icon"></i>
                                    <input type="number" class="custum-input-icon" name="phone" readonly v-model="phone" :placeholder="$t('Auth.please_mobile_number')">
                                </div>
                                <div class="card d-flex justify-content-center dropdown_card">
                                <Dropdown
                                v-model="selectedCountry"
                                :options="countries"
                                optionLabel="name"
                                disabled
                                >
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex-group-me">
                                    <img
                                        :alt="slotProps.value.label"
                                        :src="slotProps.value.image"
                                        :class="`mr-2 flag flag-${slotProps.value.key}`"
                                        style="width: 24px"
                                    />
                                    <div>{{ slotProps.value.key }}</div>
                                    </div>
                                    <span v-else>
                                    {{ slotProps.placeholder }}
                                    </span>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex-group-me">
                                    <img
                                        :alt="slotProps.option.label"
                                        :src="slotProps.option.image"
                                        :class="`mr-2 flag flag-${slotProps.option.key}`"
                                        style="width: 24px"
                                    />
                                    <div>{{ slotProps.option.key }}</div>
                                    </div>
                                </template>
                                </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.email') }}
                            </label>
                            <div class="main_input">
                                <i class="fas fa-envelope sm-icon"></i>
                                <input type="email" class="custum-input-icon" name="email" readonly v-model="email" :placeholder="$t('Auth.please_enter_email')">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Global.city') }}
                            </label>
                            <div class="flex justify-content-center dropdown_card main_input special-custom">
                                <i class="fa-solid fa-city sm-icon"></i>
                                <Dropdown v-model="city" :options="cities" disabled optionLabel="name" class="w-full md:w-14rem custum-dropdown" />
                            </div>
                        </div>

                        <div class="form-group" @click="openMapModal">
                            <label class="label">
                                {{ $t('Auth.location') }}
                            </label>
                            <div class="main_input pointer">
                                <i class="fas fa-user sm-icon"></i>
                                <input type="text" class="custum-input-icon pointer validInputs" name="location_required" readonly  v-model="mainAddress"  :placeholder="$t('Auth.enter_loaction')">
                            </div>
                        </div>

                        <div class="parent-imgs">

                            <div class="form-group">
                                <div class="input_auth without-edit parent-remove">
                                    <span :class="{'hidden-default': uploadedImage.length !== 0}">{{ $t("Auth.attach_commercial_register") }}</span>

                                </div>
                            </div>

                            <div class="form-group">
                                <div class="input_auth without-edit parent-remove">
                                    <span :class="{'hidden-default': uploadedImage_2.length !== 0}">{{ $t("Auth.attach_file") }}</span>

                                </div>
                            </div>

                            <div class="form-group">
                                <div class="input_auth without-edit parent-remove">
                                    <span :class="{'hidden-default': uploadedImage_3.length !== 0}">{{ $t("Auth.add_logo") }}</span>

                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>
            </form>
        </div>

        <GlobalGoogleMap
            v-model:visible="visible"
            :lat="lat"
            :lng="lng"
            @handleClose="handleClose"
            :closeModal_btn="closeModal_btn"
            :isDraggable="false"
            :title= "$t('Auth.location')"
            :mapAddress="mapAddress"
            :submit_location="submit_location"
            :AutoComplete="true"
        />

        <!-- if no lat and lng -->
        <Dialog v-model:visible="emptyLocation" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <h1 class="main-title bold">
                    {{ $t("order.location_determined") }}
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    name: "Home.profile_personly",
    middleware: 'auth',
});
// pinia store
const submit_location = ref(true);
// success response
const { response } = responseApi();

const mapAddress = ref('');

// // Axios
const axios = useApi();


/******************* Data *******************/

// Store
const store = useAuthStore();

const mainAddress = ref('');

const loading = ref(false);

const { token } = storeToRefs(store);

const selectedCountry = ref({})
const countries = ref([]);
const image = ref('');
const name = ref('');
const phone = ref('');
const email = ref('');
const city = ref(null);
const cities = ref([]);

const commercial_image = ref([]);
const file = ref([]);
const logo = ref([]);

const emptyLocation = ref(false);

// google map customize

const visible = ref(false);
const closeModal_btn = ref(true);
const lat = ref(null);
const lng = ref(null);

const city_id = ref(null);
// image upload

const uploadedImage = ref([]);
const uploadedImage_2 = ref([]);
const uploadedImage_3 = ref([]);
const uploadedImage_4 = ref([]);

const openMapModal = () => {
    if(lat.value == 0 || lng.value == 0) {
        emptyLocation.value = true;
    } else {

        visible.value = true;
    }
};
const handleClose = () => {
    visible.value = false;
};

const editProfileform = ref(null);

    // config
    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };

    const getCities = async () => {
        await axios.get('cities').then(res => {
            if (response(res) == "success") {
                cities.value = res.data.data;
                for (let i = 0; i < cities.value.length; i++) {
                if (cities.value[i].id == city_id.value) {
                    city.value = cities.value[i];
                }
            }
            }
        }).catch(err => console.log(err));
    };

    const getCountries = async () => {
        await axios.get('countries').then(res => {
        if (response(res) == "success") {
            countries.value = res.data.data;
            for (let i = 0; i < countries.value.length; i++) {
                if (countries.value[i].id == 1) {
                    selectedCountry.value = countries.value[i];
                    }
                }
            }
        }).catch(err => console.log(err));
    };
    

    //  get profile data
    const profile = async () => {
        await axios.get('provider/show-profile', config).then(res => {
            name.value = res.data.data.name;
            phone.value = res.data.data.phone;
            email.value = res.data.data.email;
            selectedCountry.value.key = res.data.data.country_code;
            image.value = res.data.data.image;
            mainAddress.value = res.data.data.map_desc;
            lat.value = +res.data.data.lat;
            lng.value = +res.data.data.lng;
            logo.value = res.data.data.logo;
            commercial_image.value = res.data.data.commercial_image;
            mapAddress.value = res.data.data.map_desc;
            city_id.value = res.data.data.city_id;
            file.value = res.data.data.file;
        }).catch(err => console.log(err));
    }

    onMounted(async () => {
        await profile();
        await getCountries();
        await getCities();
    });
</script>


<style lang="scss" scoped>

    .without-edit {
        input {
            pointer-events: none;
        }

        .edit-label, .remove-btn {
            display: none !important;
        }
        display: flex;
    }
</style>



