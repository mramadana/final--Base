<template>
    <div>

        <div class="container">
            <div class="layout-form custom-width lg">
                <h1 class="main-title bold lg mb-5">{{ $t("Home.settings") }}</h1>
                <div class="row justify-content-center card-setting">
                    <div class="col-12 col-md-11">
    
                        <router-link class="layout-form sm" to="/editProfile">
                            {{ $t("Global.edit_profile") }}
                            <i class="fas fa-chevron-left"></i>
                        </router-link>
    
                        <router-link class="layout-form sm" to="/changeMobileNumber">
                            {{ $t("Global.change_mobile_number") }}
                            <i class="fas fa-chevron-left"></i>
                        </router-link>
    
                        <router-link class="layout-form sm" to="/changeEmail">
                            {{ $t("Global.change_email") }}
                            <i class="fas fa-chevron-left"></i>
                        </router-link>
    
                        <router-link class="layout-form sm" to="/changePassword">
                            {{ $t("Global.change_password") }}
                            <i class="fas fa-chevron-left"></i>
                        </router-link>
    
                        <router-link class="layout-form sm" to="/notificationSettings">
                            {{ $t("Global.notification_settings") }}
                            <i class="fas fa-chevron-left"></i>
                        </router-link>
    
                        <button @click="deleteAcount = true" class="layout-form sm del-color w-100">
                            {{ $t("Global.delete_account") }}
                            <i class="fas fa-chevron-left"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        
        <!-- logout Dialog -->
        <Dialog v-model:visible="deleteAcount" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/noun_warning.png" loading="lazy" alt="check-img" class="check-img">
                <h1 class="main-title bold mb-4">{{ $t('Global.sure_delete_account') }}</h1>
                <h1 class="main-title normal mb-4">{{ $t('Global.delete_account_info') }}</h1>
                <div class="section-btns mt-5">
                    <button type="button" class="custom-btn sm d-inline-flex" @click="deleteAcount = false">{{ $t('Home.retreat') }}</button>
                    <button type="button" class="custom-btn logout sm d-inline-flex" @click="deletedAcount">{{ $t('Global.delete') }}</button>
                </div>
            </div>
        </Dialog>

        <!-- delete successfully dialog -->

        <!-- <Dialog v-model:visible="delete_Successfully" modal class="custum_dialog_width without-close" :draggable="false">
            <div class="text-center">
                <img src="@/assets/images/check.png" loading="lazy" alt="check-img" class="check-img">
                <h1 class="main-title bold mb-4">{{ $t('Global.account_deleted') }}</h1>
                <NuxtLink class="custom-btn sm d-inline-flex" to="/Auth/register">{{ $t('Auth.create_account') }}</NuxtLink>
            </div>
        </Dialog> -->

    </div>
</template>

<script setup>
    definePageMeta({
        name: "Home.settings",
        middleware: "auth",
    });


    // pinia store
    import { useAuthStore } from '~/stores/auth';

    const { response } = responseApi();

    const { successToast, errorToast } = toastMsg();

    const axios = useApi();

    const store = useAuthStore();

    const { deleteAccountHandler } = store;

    const delete_Successfully = ref(false)

    const deleteAcount = ref(false)

    const deletedAcount = async () => {
        delete_Successfully.value = true;
        deleteAcount.value = false;
        localStorage.clear();

        // Get Returned method From Store
        const res = await deleteAccountHandler();
        res.status == "success" ? successToast(res.msg) : errorToast(res.msg);
        navigateTo("/Auth/register");
    }
</script>

<!-- <script>
    definePageMeta({
        name: "Home.settings",
        middleware: "auth",
    })

    export default {
        data() {
            return {
                deleteAcount: false,
                delete_Successfully: false,
            };
        },

        methods: {
            deletedAcount() {
                localStorage.clear();
                this.delete_Successfully = true
                this.deleteAcount = false
            }
        }
    }
</script> -->
