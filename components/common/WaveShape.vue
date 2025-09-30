<template>
  <div class="wave-container">
    <div class="w-100 h-100 d-flex align-items-center justify-content-center">
      <img src="@/assets/images/frame-Auth.svg" alt="">
    </div>
  </div>
</template>

<style lang="scss">
  .wave-container {
    align-items: center;
    align-self: flex-start;
    display: flex;
    height: 100vh;
    justify-content: center;
    position: sticky;
    top: 0;
    flex-basis: 50%;
    img {
      width: 100%;
      height: calc(100% - 40px);
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
</style>
