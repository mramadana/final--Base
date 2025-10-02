<template>
  <section>
    <div class="inner-layout">
      <div class="container_auth">
        <div class="auth-layout">
          <div class="inner-Auth">
            <div class="header-Auth">
              <button v-if="showBackLink" @click="handleCustomBack" class="back-link back-button">
                <i class="fa-solid fa-chevron-right fz-15 ml-1"></i>
                {{ $t('Auth.back') }}
              </button>
              <div class="AuthLang">
                <GlobalLang />
              </div>
            </div>
            <div class="auth-content-layout">
              <slot />
            </div>
          </div>
          <CommonWaveShape />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

import { useI18n } from "vue-i18n";
import { useRoute } from "#vue-router";

const { t } = useI18n();

// Get page meta data
const route = useRoute();

// Get back link configuration from page meta
const showBackLink = computed(() => route.meta.showBackLink || false);
const hasCustomHandler = computed(() => route.meta.customBackHandler || false);

// Get reference to the page component
const pageRef = ref(null);

// Handle custom back button click
const handleCustomBack = () => {
  // Check if page has custom handler
  if (hasCustomHandler.value) {
    // Emit a global event that the page can listen to
    if (process.client) {
      window.dispatchEvent(new CustomEvent('customBackClick'));
    }
  } else {
    // For regular pages, just go back normally
    if (process.client) {
      window.history.back();
    }
  }
};

watchEffect(() => {
  useHead({
    title: `${t(route.name)}`,
  });
});
</script>

<style lang="scss">
.auth-content-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 15px;
}
.back-link {
  color: #fff !important;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
}
.header-Auth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: auto;
  padding: 25px 15px;
  width: 100%;
}

.inner-Auth {
  background-color: #181818;

  h1,
  h3,
  .main-title,
  .disc,
  span {
    color: #fff !important;
  }

  .label {
    color: #9f9f9f !important;
  }

  .main_input,
  .with_cun_select,
  .dropdown_card,
  .dropdown_card .p-dropdown {
    background-color: #262626 !important;
  }

  .main_input,
  .custum-input-icon {
    color: #fff !important;

    &::placeholder {
      color: #6c6c6c !important;
    }
  }

  .custom-btn {
    background-color: #f8f8f8 !important;
    color: #000 !important;
    border-color: #f8f8f8 !important;

    &:hover {
      background-color: #f8f8f8 !important;
      color: #000 !important;
      border-color: #f8f8f8 !important;
    }
  }

}
</style>
