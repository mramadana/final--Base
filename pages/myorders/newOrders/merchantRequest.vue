<template>
    <div class="container merchant-page">
        <OrdersMainOrderContent ordersName="new-orders"/>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Titles.new_orders_merchant",
    });
    
</script>

<style lang="scss" scoped>

    .merchant-page {
        :deep(.background-color-card) {
            background-color: #FFE0EE !important;
            border: 1px solid #C6C6C6 !important;
        }
    }

</style>