<template>
  <div class="panelswitcher" @click="emit('click')">
    <div class="icon" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits([ 'click' ])
</script>

<style scoped lang="scss">
.panelswitcher {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2vw;
  height: 2vw;
  border-top-right-radius: 1.2vw;
  border-top: .2vw solid mix($color-beige, #000000, 30%);
  border-right: .2vw solid mix($color-beige, #000000, 30%);
  z-index: 99;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    background-color: #00000022;
  }

  .icon {
    width: .2vw;
    height: .6vw;
    rotate: -45deg;
    border-top-left-radius: 99pt;
    border-bottom-left-radius: 99pt;
    margin-right: .1vw;
    margin-top: .1vw;
    border: .2vw solid mix($color-beige, #000000, 30%)
  }
}
</style>
