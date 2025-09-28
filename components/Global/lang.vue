<template>
  <div class="dropdown drop-lang" :class="{ 'color-lang': colorLang }">
    <a class="dropdown-toggle hint-lang" href="#" data-bs-toggle="dropdown">
      <i class="fas fa-globe icon"></i>
      <div v-if="htmlLang === ''">
        <p>العربية</p>
      </div>
      <div v-else>
        <p>{{ htmlLang === "ar" ? "العربية" : "English" }}</p>
      </div>
    </a>

    <ul class="dropdown-menu">
      <button class="dropdown-item" @click="switchLang('ar')">العربيه</button>
      <button class="dropdown-item" @click="switchLang('en')">English</button>
    </ul>
  </div>
</template>

<script setup>

import { useCookie } from "#app";

const props = defineProps({
  colorLang: {
    type: Boolean,
    default: false,
  },
});

const htmlLang = ref("");
const changeDir = (dir) => {
  const element = document.documentElement;
  element.setAttribute("lang", dir);
  element.setAttribute("dir", dir === "ar" ? "rtl" : "ltr");
  htmlLang.value = dir;
};

const switchLang = (newLang) => {
  const lang = useCookie("lang");
  if (newLang !== lang.value) {
    lang.value = newLang;
    localStorage.setItem("locale", newLang);
    location.reload();
  }
};

onBeforeMount(() => {
  const savedLang = localStorage.getItem("locale") || useCookie("lang").value || "ar"; // الافتراضي: عربي
  changeDir(savedLang);
});

</script>
