<template>
    <div class="container">
        <OrdersMainOrderContent ordersName="finished-orders" :additionalClasses="['background-color-card']"/>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "order.canceled",
    });
</script>

<style lang="scss" scoped>
:deep(.background-color-card) {
    background-color: #fff !important;
    border: 1px solid #C6C6C6 !important;
}
</style>