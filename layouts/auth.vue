<template>
  <section>
    <div class="inner-layout">
      <div class="container_auth">
        <div class="auth-layout">
          <div class="inner-Auth">
            <div class="header-Auth">
              <NuxtLink v-if="showBackLink" :to="backLinkUrl" class="back-link">
                <i class="fa-solid fa-chevron-right fz-15 ml-1"></i>
                {{ $t('Auth.back') }}
              </NuxtLink>
              <div class="AuthLang">
                <GlobalLang />
              </div>
            </div>
            <slot />
          </div>
          <CommonWaveShape />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Get page meta data
const route = useRoute();

// Get back link configuration from page meta
const showBackLink = computed(() => route.meta.showBackLink || false);
const backLinkUrl = computed(() => route.meta.backLinkUrl || '/Auth/login');
</script>

<style lang="scss">
.back-link {
  color: #fff !important;
}
.header-Auth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: auto;
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
