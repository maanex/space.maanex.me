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
  width: calc(2vw * var(--vws));
  height: calc(2vw * var(--vws));
  border-top-right-radius: calc(1.2vw * var(--vws));
  border-top: calc(.2vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  border-right: calc(.2vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  z-index: 99;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    background-color: #00000022;
  }

  .icon {
    width: calc(.2vw * var(--vws));
    height: calc(.6vw * var(--vws));
    rotate: -45deg;
    border-top-left-radius: 99pt;
    border-bottom-left-radius: 99pt;
    margin-right: calc(.1vw * var(--vws));
    margin-top: calc(.1vw * var(--vws));
    border: calc(.2vw * var(--vws)) solid mix($color-beige, #000000, 30%)
  }
}
</style>
