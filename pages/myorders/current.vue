<template>
    <div class="container">
        <OrdersMainOrderContent :isNew="true" ordersName="current-orders"/>
    </div>
</template>

<script setup>
    definePageMeta({
        name: "Titles.current",
    });
</script>

<style lang="scss" scoped>
:deep(.background-color-card) {
    background-color: #fff !important;
    border: 1px solid #C6C6C6 !important;
}
</style>