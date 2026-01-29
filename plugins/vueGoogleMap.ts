import { defineNuxtPlugin } from "#app";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGoogleMaps, {
        load: {
            key: "AIzaSyCzm44ddObbpLsI2VrSTz2zgJqgN6Zk9wA",

            libraries: "places", // This is required if you use the Autocomplete plugin
        },
    });
});
