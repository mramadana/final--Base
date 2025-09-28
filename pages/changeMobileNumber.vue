<template>

    <div>

        <div class="container">
            <div class="layout-form custom-width">
                <h1 class="main-title bold lg mb-5">{{ $t("Global.change_mobile_number") }}</h1>
                <form @submit.prevent="changePhone" ref="changePhoneForm">
                    <div class="row">
                        <div class="col-12 col-md-8 mr-auto">
                            <div class="text-center mb-5">
                                <img src="@/assets/images/restore-image.svg" loading="lazy" alt="restore-image" class="restore-image mb-4">
                                <p class="main-title">{{ $t("Global.enter_current_password_new_mobile") }}</p>
                            </div>
                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Auth.password') }}
                                    <span class="hint-red">*</span>
                                </label>
                                <div class="main_input with_icon">
                                    <input :type="inputType" name="password" class="custum-input-icon validInputs" valid="password" :placeholder=" $t('Auth.please_enter_password') ">
                                    <button class="static-btn with_eye" type="button" @click="togglePasswordVisibility" :class="{ 'active_class': passwordVisible }">
                                    <i class="far fa-eye icon"></i>
                                    </button>
                                </div>
                            </div>
    
                            <div class="form-group">
                                <label class="label">
                                    {{ $t('Global.new_mobile') }}
                                    <span class="hint-red">*</span>
                                </label>
                                <div class="with_cun_select">
                                    <div class="main_input">
                                        <i class="fas fa-mobile-alt sm-icon"></i>
                                        <input type="number" class="custum-input-icon validInputs" valid="phone" name="phone" v-model="phone" :placeholder="$t('Auth.please_mobile_number')">
                                    </div>
                                    <div class="card d-flex justify-content-center dropdown_card">
                                    <Dropdown
                                    v-model="selectedCountry"
                                    :options="countries"
                                    optionLabel="name"
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
    
                            <button class="custom-btn w-100 mr-auto mt-5">
                                {{ $t('Home.continuation') }}

                                <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                            </button>
    
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>

<script setup>
    definePageMeta({
        name: "Global.change_mobile_number",
        middleware: 'auth'
    });

    /******************* Import *******************/
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n({ useScope: 'global' });

    // success response
    const { response } = responseApi();

    // Toast
    const { successToast, errorToast } = toastMsg();

    // pinia store
    import { useAuthStore } from '~/stores/auth';

    /******************* Data *******************/

    // Store
    const store = useAuthStore();
    const { token } = storeToRefs(store);

    // Axios
    const axios = useApi();

    const phone = ref('');
    const changePhoneForm = ref(null);

    // countries
    const selectedCountry = ref({})
    const countries = ref([]);
    const passwordVisible = ref(false);
    const loading = ref(false);
    const errors = ref([]);

    const { phoneHandler } = store;

    const togglePasswordVisibility = (input) => {
        passwordVisible.value = !passwordVisible.value;
    }

    const inputType = computed(() => {
      return passwordVisible.value ? 'text' : 'password';
    });

    // Validation Function
    function validate() {
        let allInputs = document.querySelectorAll('.validInputs');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value === '') {
                errors.value.push(t(`validation.${allInputs[i].name}`));
            }
        }
    }

    // config
    const config = {
        headers: { Authorization: `Bearer ${token.value}` }
    };


    // changePhone
    const changePhone = async () => {
        loading.value = true;
        const fd = new FormData(changePhoneForm.value);
        fd.append('country_code', selectedCountry.value.key);

        validate();

        if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {

            loading.value = true;

            // Get Returned Data From Store
            const res = await phoneHandler(fd, phone.value);
            res.status == "success" ? successToast(res.msg) : errorToast(res.msg);

            loading.value = false;
        }
    }

    //  Get All countries
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

    onMounted(async () => {
        await getCountries();
    });
</script>

<!-- <script>
import dropdown_img from '@/assets/images/Flag.webp';
import dropdown_img_1 from '@/assets/images/messi.gif';

export default {
    
    data() {
        return {
            selectedCountry: {
                    key: "+966",
                    code: "SA",
                    image: dropdown_img,
            },
            countries: [
                {
                key: "+966",
                code: "SA",
                image: dropdown_img_1,
                },
                {
                key: "+20",
                code: "Eg",
                image: dropdown_img_1,
                },
            ],
            passwordVisible: {
                definitelyNewPassword: false,
            }
        }
    },

    methods: {
        togglePasswordVisibility(input) {
            this.passwordVisible[input] = !this.passwordVisible[input];
        },

        inputType(input) {
            return this.passwordVisible[input] ? 'text' : 'password';
        },

        submitData() {
            this.$router.push('/mobileActivateCode');
        }
    }
}
</script> -->
