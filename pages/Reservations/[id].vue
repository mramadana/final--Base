<template>
    <div>
        <h1>
            Reservation {{ id }}
        </h1>
    </div>
</template>

<script setup>
definePageMeta({
    name: "Reservation.id",
    layout: "default",
});

import { useI18n } from 'vue-i18n';
const { id } = useRoute().params;

const { t } = useI18n();
</script>