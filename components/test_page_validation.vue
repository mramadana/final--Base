<template>
    <div>
        <main>
            
            <div class="container">

                <h2>remove text </h2>

                <h1>Home page 23333333333</h1>

                <FormInput 
                    v-model:modelValue="phone" 
                    name="phone" 
                    type="number"
                    :label="$t('Auth.mobile_number')" 
                    :placeholder="$t('Auth.mobile_number')" 
                    :validation-schema="validationSchema.phoneNumber"
                />

                <FormInput 
                    name="fullName" 
                    type="email"
                    :label="$t('Auth.email')" 
                    :placeholder="$t('Auth.email')" 
                    :validation-schema="validationSchema.email"
                />

                <FormInput 
                    name="fullName" 
                    type="text"
                    :label="$t('validation.fullName')" 
                    :placeholder="$t('validation.fullName')" 
                    :validation-schema="validationSchema.fullname"
                />

                <button @click="submit">submit</button>

            </div>
            

    
        </main>
    </div>
</template>

<script setup>

definePageMeta({
    name: "Titles.home",
});

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const phone = ref(null);
const text = ref(null);
const fullname = ref(null);

const submit = () => {

    console.log(fullname.value, "5555555");
}
const { phoneNumber, email, fullName } = useValidationSchema();
const validationSchema = {
  phoneNumber: phoneNumber(),
  email: email(),
  fullname: fullName(),
};

</script>
