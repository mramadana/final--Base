<template>
    <div class="pages_layout">

        <LayoutHeader @toggle-active="toggleActive"/>
        

        <div :class="[dynamicClass, {'active': isActive }]">

          <div class="main-content">
            
            <slot />

          </div>

        </div>

        <LayoutSidebar :is-active="isActive" @toggle-active="toggleActive"  />

    </div>
</template>

<script setup>

const myLange = ref("")

import { useI18n } from "vue-i18n";
import { useRoute } from "#vue-router";
const { t, locale } = useI18n();

const isActive = ref(false);

const route = useRoute();
    watchEffect(() => {
      useHead({
        title: `${t(route.name)}`,
      });
    });

    const dynamicClass = computed(() => {
      return !route.path.includes("Auth") ? "auth-padding with-pt" : "";
    });

  const nuxtApp = useNuxtApp();
  const loading = ref(true);
  nuxtApp.hook("page:start", () => {
    loading.value = true;
  });
  nuxtApp.hook("page:finish", () => {
    loading.value = false;
  });

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google);
        } else {
            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.google));
                existingScript.addEventListener('error', () => reject(new Error('Error loading Google Maps API')));
                if (window.google && window.google.maps) {
                    resolve(window.google);
                }
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLoYGrbnQI_GMqHt6m0PSN9yA7Zvq7gA&language=${myLange.value}&libraries=places&callback=initMap&loading=async`;
                script.async = true;
                script.defer = true;
                window.initMap = () => resolve(window.google);
                script.onerror = () => reject(new Error('Error loading Google Maps API'));
                document.head.appendChild(script);
            }
        }
    });
};

const toggleActive = () => {
  isActive.value = !isActive.value;
};

onMounted(() => {
  loadGoogleMaps().then((google) => {
        console.log('Google Maps API loaded:', google);
    }).catch((error) => {
        console.error('Error loading Google Maps API:', error);
    });
    myLange.value = localStorage.getItem("locale");
});

</script>



<style>

.fixed_class {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5000;
  transition: all 0.5s;
  transform: translate3d(0, 0, 0);
  height: 100vh;
  background-color: #000;
}
</style>



