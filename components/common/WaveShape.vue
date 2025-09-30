<template>
  <div class="wave-container">
    <div class="w-100 h-100 d-flex align-items-center justify-content-center">
      <img src="@/assets/images/Subtract.svg" alt="">
    </div>
  </div>
</template>

<style lang="scss">
  .wave-container {
    position: relative;
    width: 100%;
    height: 100vh;
    img {
      width: 100%;
      height: calc(100% - 40px);
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
</style>
