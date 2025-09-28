<template>
    <div>
        
        <div class="container">
            <div class="layout-form custom-width lg">
                <h1 class="main-title bold mb-4">{{ $t("Global.about_site") }}</h1>
                
                <div v-if="status == 'pending'">
                    <div v-for="i in 8" :key="i">
                        <Skeleton height=".5rem" width="80%" class="rounded-0 mb-2 mx-auto"></Skeleton>
                    </div>
                </div>

                <div v-else class="main-title normal mt-3 about_disc" v-html="aboutDisc?.data || ''">
                    
                </div>


                <ClientOnly>
                    <div class="hijri-picker-container">
                    <ejs-calendar 
                        :renderDayCell="load" 
                        :calendarMode="type" 
                        :class="cssClass"
                    />
                    </div>
                </ClientOnly>
            </div>
        </div>


    </div>
</template>

<script setup>

definePageMeta({
    name: "Global.about_site",
});


const { data: aboutDisc, status } = useApiFetch("about");


import { CalendarComponent as EjsCalendar, Islamic } from "@syncfusion/ej2-vue-calendars";
import { provide } from "vue";

const cssClass = "e-customStyle";
const type = "Islamic";

const load = (args) => {
  // Custom logic here
};

provide('calendar', [Islamic]);
</script>

<style>
@import "~/node_modules/@syncfusion/ej2-base/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "~/node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";

/* Custom CSS */
.hijri-picker-container {
  direction: rtl;
  margin: 2rem 0;
}
</style>