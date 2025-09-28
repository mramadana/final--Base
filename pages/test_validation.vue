<template>
    <div>
        <main>
            
            <div class="container">

                <h1 class="mb-4">validation page</h1>

                <form @submit.prevent="submitForm">

                    <div class="position-relative single-input-upload mb-4">
                        <div class="main_input special-input without-edit">
                            <div
                                class="d-flex align-items-center justify-content-center gap-2 flex-grow-1 gray">
                                <span>{{ $t("settings.attach_image") }}</span>
                            </div>
                        </div>
                        <!-- if you want to remove the validation, you can set the required to false
                        and remove showValidation -->
                        <GlobalImgUploader 
                            ref="imageUploader"
                            acceptedFiles="image/*" 
                            :IsMultible="true" 
                            :resetTrigger="resetImageTrigger"
                            :showValidation="showValidation"
                            :required="true"
                            :errorMessage="t('validation.image_required')"
                            @uploaded-images-updated="updateUploadedImages" />
                    </div>

                    <FormInput 
                        v-model:modelValue="formData.phone"
                        name="phone"
                        type="number"
                        :label="$t('Auth.mobile_number')"
                        :placeholder="$t('Auth.mobile_number')"
                        :validation-schema="validations.phone"
                        :showErrors="showValidation"
                        :hasIcon="true"
                        icon="/_nuxt/assets/images/sidebar/home.svg"
                        :with_icon="true"
                    />

                    <FormInput 
                        v-model:modelValue="formData.email"
                        name="email"
                        type="email"
                        :label="$t('Auth.email')"
                        :placeholder="$t('Auth.email')"
                        :validation-schema="validations.email"
                        :showErrors="showValidation"
                    />

                    <FormInput 
                        v-model:modelValue="formData.fullname"
                        name="fullname"
                        type="text"
                        :label="$t('validation.fullName')"
                        :placeholder="$t('validation.fullName')"
                        :validation-schema="validations.fullname"
                        :showErrors="showValidation"
                    />

                    <FormInput 
                        v-model:modelValue="formData.lastnameee"
                        name="lastnameee"
                        type="text"
                        :label="$t('validation.lastnameee')"
                        :placeholder="$t('validation.lastnameee')"
                        :validation-schema="validations.lastnameee"
                        :showErrors="showValidation"
                    />
                    <FormInput 
                        v-model:modelValue="formData.iban"
                        name="iban"
                        type="text"
                        :label="$t('Auth.iban')"
                        :placeholder="$t('Auth.iban')"
                        :validation-schema="validations.iban"
                        :showErrors="showValidation"
                    />

                    <GlobalCustomDropdown 
                        v-model="formData.defaultSection" 
                        :options="defaultSections"
                        option-value="value"
                        placeholder="اختر القسم الأول" 
                        :label="$t('categories.default_section')"
                        :showValidation="showValidation"
                    />

                    <GlobalCustomDropdown 
                        v-model="formData.defaultSection2" 
                        :options="defaultSections"
                        option-value="value"
                        placeholder="اختر القسم الثاني" 
                        :label="$t('categories.default_section2')"
                        :showValidation="showValidation"
                    />

                    <GlobalCustomDropdown 
                        v-model="formData.defaultSection3" 
                        :options="defaultSections"
                        option-value="value"
                        placeholder="اختر القسم الثاني" 
                        :label="$t('categories.default_section2')"
                    />

                    <!-- Checkbox Example -->
                    <div class="mb-3">
                        <label class="form-label">{{ $t('Auth.terms_and_conditions') }}</label>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                id="termsCheckbox"
                                name="terms"
                                v-model="formData.acceptTerms">
                            <label class="form-check-label" for="termsCheckbox">
                                {{ $t('Auth.accept_terms') }}
                            </label>
                        </div>
                        <div v-if="showValidation && validations.acceptTerms" class="text-danger mt-1">
                            <span v-if="getValidationError('acceptTerms')">{{ getValidationError('acceptTerms') }}</span>
                        </div>
                    </div>

                    <!-- Radio Button Example -->
                    <div class="mb-3">
                        <label class="form-label">{{ $t('Auth.gender') }}</label>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="gender" 
                                id="male"
                                value="male"
                                v-model="formData.gender">
                            <label class="form-check-label" for="male">
                                {{ $t('Auth.male') }}
                            </label>
                        </div>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="radio" 
                                name="gender" 
                                id="female"
                                value="female"
                                v-model="formData.gender">
                            <label class="form-check-label" for="female">
                                {{ $t('Auth.female') }}
                            </label>
                        </div>
                        <div v-if="showValidation && validations.gender" class="text-danger mt-1">
                            <span v-if="getValidationError('gender')">{{ getValidationError('gender') }}</span>
                        </div>
                    </div>

                    <!-- Multiple Checkboxes Example -->
                    <div class="mb-3">
                        <label class="form-label">{{ $t('Auth.interests') }}</label>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                id="sports"
                                value="sports"
                                v-model="formData.interests">
                            <label class="form-check-label" for="sports">
                                {{ $t('Auth.sports') }}
                            </label>
                        </div>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                id="music"
                                value="music"
                                v-model="formData.interests">
                            <label class="form-check-label" for="music">
                                {{ $t('Auth.music') }}
                            </label>
                        </div>
                        <div class="form-check">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                id="reading"
                                value="reading"
                                v-model="formData.interests">
                            <label class="form-check-label" for="reading">
                                {{ $t('Auth.reading') }}
                            </label>
                        </div>
                        <div v-if="showValidation && validations.interests" class="text-danger mt-1">
                            <span v-if="getValidationError('interests')">{{ getValidationError('interests') }}</span>
                        </div>
                    </div>

                    <div class="d-flex gap-3">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="button" class="btn btn-secondary" @click="handleResetForm">
                            Reset Form
                        </button>
                    </div>

                </form>

            </div>
            

    
        </main>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const showValidation = ref(false);

const { response } = responseApi();

const loading = ref(false);

const axios = useApi();

// image uploader
const imageUploader = ref(null);

// simple data
const formData = reactive({
    phone: null,
    email: null,
    fullname: null,
    lastnameee: null,
    defaultSection: null,
    defaultSection2: null,
    defaultSection3: null,
    iban: null,
    acceptTerms: false,  // checkbox
    gender: null,        // radio button
    interests: []        // multiple checkboxes
});

const resetImageTrigger = ref(0);

// dropdown data
const defaultSections = ref([
    { name: 'مستلزمات الأطفال', value: 'baby_supplies' },
    { name: 'الأعشاب', value: 'herbs' },
    { name: 'الطبخ', value: 'cuisine' }
]);
                                                                                                                                
// validations simple
const { phoneNumber, email, fullName, lastnameee, iban, checkbox, radioButton, multipleCheckboxes } = useValidationSchema();
const validations = {
    phone: phoneNumber(),
    email: email(), 
    fullname: fullName(),
    lastnameee: lastnameee(),
    iban: iban(),
    acceptTerms: checkbox('Auth.terms_and_conditions'),
    gender: radioButton('Auth.gender'),
    interests: multipleCheckboxes('Auth.interests', 2) // minimum 2 checkboxes
};

// use the composable for the validation
const { isFormValid, resetForm, scrollToFirstError } = useFormValidation();

const uploadedImage = ref([]);
// function to reset the form (can be called from anywhere)
const handleResetForm = () => {
    resetForm(formData, showValidation);
    uploadedImage.value = []; // reset the images in the page
    
    resetImageTrigger.value++; // trigger for the component
    console.log('Reset triggered:', resetImageTrigger.value);
};

// simple function to update the images
const updateUploadedImages = (images) => {
    uploadedImage.value = images;
};

// function to get validation error for a specific field
const getValidationError = (field) => {
    if (!showValidation.value || !validations[field]) return null;
    try {
        validations[field].validateSync(formData[field]);
        return null;
    } catch (error) {
        return error.message;
    }
};

const submitForm = async () => {
    showValidation.value = true;
    
    // check the images first (if the ImgUploader is at the beginning of the form)
    const imagesValid = imageUploader.value?.validate() || false;
    const isValid = isFormValid(formData, validations);

    if(!isValid || !imagesValid){
        // first check the images
        if (!imagesValid) {
            console.log("Images validation failed");
        } else if (!isValid) {
            // if the images are valid but the inputs have errors
            scrollToFirstError(formData, validations);
        }
        console.log("22222222222");
    } else {
        console.log("11111111111");
        try {
        
        // إنشاء FormData ودمج كل البيانات
        const fd = new FormData();
        
        // إضافة بيانات الفورم العادية
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                fd.append(key, value);
            }
        });
        
        // إضافة الصور
        if (uploadedImage.value.length > 0) {
            uploadedImage.value.forEach((file, index) => {
                fd.append(`images[${index}]`, file);
            });
        }
        
        const res = await axios.post('test_page_validation', fd);
        
        if (response(res) == "success") {
          console.log("Form submitted successfully!");
          // إعادة تعيين الفورم بعد النجاح
          Object.keys(formData).forEach(key => {
            formData[key] = null;
          });
          showValidation.value = false;
        } else {
          console.log("Server returned error");
        }
        
        loading.value = false;
      } catch (error) {
        console.error('Form submission error:', error);
        loading.value = false;
      }
    }

}
</script>


<style lang="scss">
.single-input-upload {
    .special-input {
        +input {
            width: 100%;
            height: 45px;
            top: 0;
            position: absolute;
            opacity: 0;
            cursor: pointer;
            z-index: 100;
            overflow: hidden;
        }
    }

    .uploaded-block {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 10px;
        transition: all 0.3s ease;
        will-change: transform, opacity;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }
}



.special-input {
    border: 1.5px dashed #C7C7C7;
}
</style>