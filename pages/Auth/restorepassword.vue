<template>
    <div class="custom-width with-auth">
        <h1 class="main-title bold lg mb-4">{{ $t("Auth.restore_password") }}</h1>
        <form @submit.prevent="forgetPassword" ref="forgetForm">
            <div class="row">
                <div class="col-12 col-md-8 mr-auto">
                    <div class="text-center mb-5">
                        <p class="main-title">{{ $t("Auth.Please_enter_mobile_number") }}</p>
                    </div>

                    <div class="form-group mb-5">
                        <label class="label">
                            {{ $t('Auth.mobile_number') }}
                        </label>
                        <div class="with_cun_select">
                            <input type="number" class="main_input validInputs" name="phone" v-model="phone" :placeholder="$t('Auth.please_mobile_number')">
                            <GlobalCountryDropdown
                              v-model="selectedCountry"
                              :placeholder="$t('Auth.select_country')"
                            />
                        </div>
                    </div>
                    <button type="submit" class="custom-btn w-100 mr-auto"> 
                        {{ $t('Global.send') }} 
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>

definePageMeta({
    name: "Auth.restore_password",
    layout: 'auth'
});

/******************* Plugins *******************/
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

const { locale, t } = useI18n({ useScope: 'global' });
const selectedCountry = ref(null);

// success response
const { response } = responseApi();

// Toast
const { successToast, errorToast } = toastMsg();

// Axios
const axios = useApi();

// pinia store
import { useAuthStore } from '~/stores/auth';

/******************* Data *******************/

// Store
const store = useAuthStore();
const { user } = storeToRefs(store);

// success response

const forgetForm = ref(null);
const phone = ref('');
const loading = ref(false);
const errors = ref([]);



/******************* Methods *******************/

// validate Func
function validate() {
    let allInputs = document.querySelectorAll('.validInputs');
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].value === '') {
            errors.value.push(t(`validation.${allInputs[i].name}`));
        }
    }
}

// forgetPassword Function

// const forgetPassword = async () => {
//     loading.value = true;
//     const fd = new FormData(forgetForm.value);
//     fd.append('country_code', selectedCountry.value.key);

//     validate();

//     if (errors.value.length) {
//         errorToast(errors.value[0]);
//         loading.value = false;
//         errors.value = [];
//     } else {

//         await axios.post('forget-password-send-code', fd).then(res => {
//             if (response(res) == "success") {
//                 user.value.phone = phone.value;
//                 user.value.country_code = selectedCountry.value.key;

//                 successToast(res.data.msg);
//                 navigateTo('/Auth/restorepassword-check-code');

//             } else {
//                 errorToast(res.data.msg);
//             }
//             loading.value = false;
//         }).catch(err => console.log(err));

//     }
// }

// forgetPassword Function
const forgetPassword = async () => {
  loading.value = true;
  const fd = new FormData(forgetForm.value);
  fd.append('country_code', selectedCountry.value.key);

  validate();

  if (errors.value.length) {
    errorToast(errors.value[0]);
    loading.value = false;
    errors.value = [];
  } else {
    const { data, error } = await submitApiForm('forget-password-send-code', fd);

    if (error) {
      console.error("Forget Password error:", error);
      errorToast(error.message || "An error occurred");
      loading.value = false;
      return;
    }

    if (data.key === "success") {
      user.value.phone = phone.value;
      user.value.country_code = selectedCountry.value.key;
      successToast(data.msg);
      navigateTo('/Auth/restorepassword-check-code');
    } else {
      errorToast(data.msg);
    }
    loading.value = false;
  }
};

</script>
