<template>
    <div class="container">
        <div class="layout-form">
            <h1 class="main-title bold md mb-3">
                إضافة طاولة جديدة
            </h1>

            <!-- Add Table Form -->
            <form @submit.prevent="submitTable" ref="addTableForm">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- Table Number -->
                        <FormInput 
                            v-model:modelValue="tableNumber" 
                            name="tableNumber" 
                            type="text"
                            label="رقم الطاولة"
                            placeholder="رقم الطاولة"
                            :validation-schema="validations.tableNumber"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/sidebar/table-img.png"
                            :with_icon="true"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <!-- Number of People -->
                        <FormInput 
                            v-model:modelValue="numberOfPeople" 
                            name="numberOfPeople" 
                            type="number"
                            label="عدد أفراد الطاولة"
                            placeholder="عدد أفراد الطاولة"
                            :validation-schema="validations.numberOfPeople"
                            :showErrors="showValidation"
                            :hasIcon="true"
                            icon="/_nuxt/assets/images/auth-img/user.svg"
                            :with_icon="true"
                        />
                    </div>

                    <!-- Booking Price -->
                    <FormInput 
                        v-model:modelValue="bookingPrice" 
                        name="bookingPrice" 
                        type="number"
                        label="سعر الحجز الخاص بالطاولة"
                        placeholder="سعر الحجز الخاص بالطاولة"
                        :validation-schema="validations.bookingPrice"
                        :showErrors="showValidation"
                        :hasIcon="true"
                        icon="/_nuxt/assets/images/money.svg"
                        :with_icon="true"
                    />

                    <!-- Description in Arabic -->
                    <div class="form-group">
                        <label class="label">وصف الطاولة بالعربي</label>
                        <textarea 
                            v-model="descriptionAr" 
                            class="main_input main_area"
                            :class="{ 'is-invalid': showValidation && !descriptionAr }"
                            placeholder="وصف الطاولة بالعربي"
                            rows="4">
                        </textarea>
                        <p v-if="showValidation && !descriptionAr" class="error-message text-danger mt-1">
                            يرجى إدخال وصف الطاولة بالعربي
                        </p>
                    </div>

                    <!-- Description in English -->
                    <div class="form-group">
                        <label class="label">وصف الطاولة بالانجليزي</label>
                        <div class="position-relative with_icon">
                            <textarea 
                                v-model="descriptionEn" 
                                class="main_input main_area"
                                :class="{ 'is-invalid': showValidation && !descriptionEn }"
                                placeholder="وصف الطاولة بالانجليزي"
                                rows="4"
                            ></textarea>
                            <img src="/_nuxt/assets/images/auth-img/user.svg" alt="icon" class="input-icon with-area" />
                        </div>
                        <p v-if="showValidation && !descriptionEn" class="error-message text-danger mt-1">
                            يرجى إدخال وصف الطاولة بالانجليزي
                        </p>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="custom-btn w-100 mr-auto" :disabled="loading">
                        التالي
                        <span class="spinner-border spinner-border-sm" v-if="loading" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Success Modal -->
        <Dialog v-model:visible="successDialog" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/Success.gif" alt="check-img" class="check-img lg" loading="lazy" />
                <h1 class="main-title md mb-0 hint_success">
                    تم إضافة الطاولة بنجاح
                </h1>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

// Form fields
const tableNumber = ref("");
const numberOfPeople = ref("");
const bookingPrice = ref("");
const descriptionAr = ref("");
const descriptionEn = ref("");

// Validation schemas
const {
    required,
    customerName
} = useValidationSchema();

// Validation schemas
const validations = {
    tableNumber: customerName("رقم الطاولة"),
    numberOfPeople: required("عدد أفراد الطاولة"),
    bookingPrice: required("سعر الحجز"),
};

// Toast
const { successToast, errorToast } = toastMsg();

// Form state
const loading = ref(false);
const showValidation = ref(false);
const successDialog = ref(false);
const addTableForm = ref(null);
const fileInput = ref(null);

// Form data (reactive object for validation)
const formData = computed(() => ({
    tableNumber: tableNumber.value,
    numberOfPeople: numberOfPeople.value,
    bookingPrice: bookingPrice.value,
}));

// Use the composable for validation
const { isFormValid, scrollToFirstError } = useFormValidation();

// Submit table function
const submitTable = async () => {
    showValidation.value = true;

    const isValid = isFormValid(formData.value, validations);
    const hasDescriptionAr = !!descriptionAr.value;
    const hasDescriptionEn = !!descriptionEn.value;

    if (!isValid || !hasDescriptionAr || !hasDescriptionEn) {
        if (!hasDescriptionAr) {
            errorToast("يرجى اختيار صورة الطاولة");
        }
        if (!hasDescriptionAr) {
            errorToast("يرجى إدخال وصف الطاولة بالعربي");
        }
        if (!hasDescriptionEn) {
            errorToast("يرجى إدخال وصف الطاولة بالانجليزي");
        }
        scrollToFirstError(formData.value, validations);
        console.log("Validation Failed");
    } else {
        console.log("Validation Passed");
        loading.value = true;

        try {
            const fd = new FormData();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            successDialog.value = true;
            successToast("تم إضافة الطاولة بنجاح");

            // Reset form on success
            setTimeout(() => {
                successDialog.value = false;
                navigateTo('/tables');
            }, 2000);

        } catch (error) {
            console.error("Add table error:", error);
            errorToast("حدث خطأ أثناء إضافة الطاولة");
        } finally {
            loading.value = false;
        }
    }
};

// Page meta
definePageMeta({
    name: "tables.add_table",
    layout: "default",
});
</script>

<style scoped>
.with-area {
    top: 20px;
}
</style>