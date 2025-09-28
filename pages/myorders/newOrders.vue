<template>
    <div>

        <div class="section-btns order-btns mb-4">

            <nuxt-link class="custom-btn sm" to="/myorders/newOrders/merchantRequest">{{ $t("order.merchant_request") }}</nuxt-link>
            
            <nuxt-link class="custom-btn sm" to="/myorders/newOrders/productRequest">{{ $t("order.product_request") }}</nuxt-link>

        </div>

        <!-- Nested Pages -->
        <NuxtPage />
    </div>
</template>

<style lang="scss">

    .order-btns {
        gap: 35px;
    }

    .order-btn {
        font-size: 14px;
        color: #000;
        transition: all 0.3s ease-in-out;
        &:hover, &.router-link-active {
            color: var(--main);
        }
    }

    .layout-form.with_edit {
        border-radius: 15px;
        padding: 15px 0 0;
    }

</style>

<style lang="scss" scoped>
    .custom-width.md {
        width: 650px;
    }
</style>