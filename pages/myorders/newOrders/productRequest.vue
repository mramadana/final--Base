<template>
    <div class="container">
        <OrdersMainOrderContent ordersName="new-orders"/>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Titles.new_orders_product",
    });
</script>

<style lang="scss" scoped>
    :deep(.background-color-card) {
        background-color: #D3D3D3 !important;
        border: 1px solid #C6C6C6 !important;
    }
</style>