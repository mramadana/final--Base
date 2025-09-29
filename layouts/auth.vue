<template>
  <section>
    <div class="inner-layout">
      <div class="container">
        <div class="auth-layout">
          <div class="position-relative">
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

