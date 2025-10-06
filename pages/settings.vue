<template>
    <div>

        <div class="container">
            
            <h1 class="main-title bold lg">{{ $t("Home.settings") }}</h1>
            <p class="main-disc">{{ $t('Home.welcome') }} {{ user?.name }} ، {{ $t('Home.welcome_back') }}</p>
            
            <div class="section-btns justify-content-start mb-4">
    
                <router-link class="custom-btn order-btn sm" to="/settings/editProfile">
                    {{ $t("settings.edit_account") }}
                </router-link>

                <router-link class="custom-btn order-btn sm" to="/settings/changePassword">
                    {{ $t("settings.change_password") }}
                </router-link>

                <router-link class="custom-btn order-btn sm" to="/settings/changeMobileNumber">
                    {{ $t("settings.change_mobile") }}
                </router-link>

                <router-link class="custom-btn order-btn sm" to="/settings/changeEmail">
                    {{ $t("settings.change_email") }}
                </router-link>

                <router-link class="custom-btn order-btn sm" to="/settings/profile">
                    {{ $t("settings.view_profile") }}
                </router-link>

                <button class="custom-btn order-btn sm" @click="deleteAcount = true">
                    {{ $t("settings.delete_account") }}
                </button>

            </div>

            <!-- nested routes -->
            <div class="custom-width layout-form text-start w-100">
                <NuxtPage />
            </div>
        </div>

        <!-- logout Dialog -->
        <Dialog v-model:visible="deleteAcount" modal class="custum_dialog_width" :draggable="false">
            <div class="text-center">
                <h1 class="main-title bold mb-4">{{ $t('settings.sure_delete_account')}}</h1>
                <!-- <img src="@/assets/images/noun_warning.svg" loading="lazy" alt="check-img" class="lgg"> -->
                <div class="section-btns mt-5">
                    <button type="button" class="custom-btn logout sm d-inline-flex" @click="deletedAcount">{{ $t('Global.delete') }}</button>
                    <button type="button" class="custom-btn sm d-inline-flex" @click="deleteAcount = false">{{ $t('Auth.retreat') }}</button>
                </div>
            </div>
        </Dialog>

    </div>
</template>

<script setup>
    definePageMeta({
        name: "Home.settings",
        middleware: 'auth',
    });


    // pinia store
    import { useAuthStore } from '~/stores/auth';

    const { response } = responseApi();

    const { successToast, errorToast } = toastMsg();

    const axios = useApi();

    const store = useAuthStore();

    const { deleteAccountHandler } = store;

    const { user } = storeToRefs(store);

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

        // تعيين عنوان الصفحة مع أيقونة وعنوان فرعي
        const globalStore = useGlobalStore();
        globalStore.title = 'الإعدادات';
        globalStore.titleIcon = 'fa-solid fa-gear';
        globalStore.titleLink = null;
        globalStore.subtitle = 'إدارة حسابك';
    }
</script>

<style lang="scss" scoped>
    .order-btn {
        border-color: #fff;
        background-color: transparent;
        color: #fff;
        font-weight: bold;
        border: 2px solid #fff !important;
        &.router-link-active, &:hover {
            background-color: #3a3a3a !important;
            border-color: #fff !important;
            color: #fff !important;
            &::before {
                background-color: #3a3a3a !important;
            }
        }
    }
</style>