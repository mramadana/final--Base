<template>
  <section>
    <div class="inner-layout">
      <div class="container_auth">
        <div class="auth-layout">
          <div class="inner-Auth">
              <div class="AuthLang">
                <GlobalLang />
              </div>
              <slot />
          </div>
          <CommonWaveShape />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.inner-Auth {
  background-color: #181818;
  h1, h3, .main-title, .disc {
    color: #fff !important;
  }

  .label {
    color: #9f9f9f !important;
  }

  .main_input, .with_cun_select, .dropdown_card, .dropdown_card .p-dropdown {
    background-color: #262626 !important;
  }

  .main_input, .custum-input-icon {
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

