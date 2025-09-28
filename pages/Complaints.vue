<template>
    <div class="container">
        <div class="layout-form custom-width">
            <h1 class="main-title bold lg mb-5">{{ $t("Global.complaints_suggestions") }}</h1>
            <form @submit.prevent="submitData" ref="complaintsForm">
                <div class="row">
                    <div class="col-12 col-md-8 mr-auto">

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.username') }}
                            </label>
                            <div class="main_input">
                                <i class="fas fa-user sm-icon"></i>
                                <input type="text" class="custum-input-icon validInputs" valid="name" name="user_name" v-model="name" :placeholder="$t('Auth.enter_username')">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label">
                                {{ $t('Auth.mobile_number') }}
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
                                        loading="lazy"
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
                                        loading="lazy"
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
                                {{ $t('Global.complaintsuggestion') }}
                            </label>
                            <textarea  class="main_input main_area mb-4 validInputs" valid="complaint" name="complaint" :placeholder="$t('Global.please_enter_complaints')"></textarea>
                        </div>

                        
                        <button class="custom-btn w-100 mr-auto mt-4">
                            {{ $t('Global.send') }}
                            <span class="spinner-border spinner-border-sm" v-if="loading" role="status"
                                    aria-hidden="true"></span>
                        </button>

                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    name: "Global.complaints_suggestions",
});


import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const complaintsForm = ref(null);

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
const store = useAuthStore();

// token
const { token } = storeToRefs(store);

// config
const config = {
    headers: { Authorization: `Bearer ${token.value}` }
};

const name = ref(null);
const phone = ref(null);

const loading = ref(false);
const errors = ref([]);

const selectedCountry = ref(null);
const countries = ref([]);

// methods

// validation Function
const validate = () => {
    let allInputs = document.querySelectorAll('.validInputs');
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].value === '') {
            errors.value.push(t(`validation.${allInputs[i].getAttribute('valid')}`));
        }
    }
}

const submitData = async () => {
    loading.value = true;
    const fd = new FormData(complaintsForm.value);
    fd.append('country_code', selectedCountry.value.key);
    validate();
    if (errors.value.length) {
            errorToast(errors.value[0]);
            loading.value = false;
            errors.value = [];
        } else {
            axios.post("new-complaint", fd).then(res => {
                if (response(res) == "success") {
                    successToast(res.data.msg);
                    complaintsForm.value.reset();
                    phone.value = null;
                    name.value = null;
                } else {
                    errorToast(res.data.msg);
                }
                
                loading.value = false;
            })
        }
};

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
