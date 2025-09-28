import { defineNuxtPlugin } from "#app";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyAFX1zOQk62nGLZJyFt1wvLxQk-A_ncwkE",
      
      libraries: "places", // This is required if you use the Autocomplete plugin
    },

    
  });
});