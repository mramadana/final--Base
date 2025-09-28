<template>
    <div class="container executed-page">
        <OrdersMainOrderContent :isNew="true" ordersName="new-orders"/>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "order.executed",
    });
</script>

<style lang="scss" scoped>
.executed-page {
    :deep(.background-color-card) {
        background-color: #fff !important;
        border: 1px solid #C6C6C6 !important;
    }
}
</style>