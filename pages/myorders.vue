<template>
    <div class="container">

        <h1 class="main-title bold lg mt-5 mb-5 text-center">{{ $t("Sidebar.orders") }}</h1>

        <div class="section-btns layout-form custom-width md with_edit mr-auto mb-5">

            <nuxt-link class="custom-btn order-btn sm" to="/myorders/newOrders">{{ $t("order.new") }}</nuxt-link>

            <nuxt-link class="custom-btn order-btn sm" to="/myorders/current">{{ $t("order.current") }}</nuxt-link>

            <nuxt-link class="custom-btn order-btn sm" to="/myorders/executed">{{ $t("order.executed") }}</nuxt-link>

            <nuxt-link class="custom-btn order-btn sm" to="/myorders/canceled">{{ $t("order.canceled") }}</nuxt-link>

        </div>
        
        <div>
            <NuxtPage />
        </div>
    </div>
  </template>

    <script setup>

        definePageMeta({
            middleware: 'auth',
        });

        import { useI18n } from 'vue-i18n';
        const { t } = useI18n({ useScope: 'global' });
        const globalStore = useGlobalStore();

        const pageTilte = ref(t("Sidebar.orders"));
        onMounted(() => {
            globalStore.title = pageTilte.value;
        })
    </script>

  <style lang="scss" scoped>
    .section-btns {
        margin: 15px auto;
    }
  </style>
  

  
