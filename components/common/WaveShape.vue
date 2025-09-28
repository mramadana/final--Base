<template>
  <div class="wave-container">
    <img src="@/assets/images/Subtract.svg" alt="">
  </div>
</template>

<style lang="scss">
.wave-container {
  position: relative;
  width: 100%;
  height: 100%;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgb(200 77 134), rgb(49, 52, 130));
    mix-blend-mode: overlay;
  }
  img {
    width: 100%;
    height: calc(100% - 40px);
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
