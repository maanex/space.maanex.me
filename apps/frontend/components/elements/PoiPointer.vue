<template>
  <div class="poi" :style="css" :data-edge="edge" :data-visible="poi[5]">
    <div class="symbol" :data-type="poi[2]" />
  </div>
</template>

<script setup lang="ts">
import { Packet } from '@maanex/spacelib-common'

const { poi } = defineProps<{
  poi: readonly [ ...Packet.SC.Poi, number, boolean ]
}>()

const pos = usePosition()

const relpos = computed(() => {
  const relativeX = poi[0] - pos.value.x
  const relativeY = -(poi[1] - pos.value.y)
  const longerLength = Math.max(Math.abs(relativeX), Math.abs(relativeY))
  return [ relativeX / longerLength, relativeY / longerLength ]
})

const css = computed(() => {
  const [ x, y ] = relpos.value
  return { '--top': y/2 + 0.5, '--left': x/2 + 0.5, '--scale': poi[4] }
})

const edge = computed(() => {
  const [ x, y ] = relpos.value
  return (x === -1) ? 'left'
    : (x === 1) ? 'right'
    : (y === -1) ? 'top'
    : 'bottom'
})
</script>

<style scoped lang="scss">
$size: calc(3vw * var(--vws));
$br: 100vw;

.poi {
  position: absolute;
  top: calc(var(--top) * (100% - $size));
  left: calc(var(--left) * (100% - $size));
  width: $size;
  height: $size;
  background-color: #00000033;
  display: grid;
  place-items: center;
  transition: opacity .5s ease-out;

  &[data-visible=false] {
    opacity: 0;
  }

  &[data-edge="top"] {
    border-bottom-right-radius: $br;
    border-bottom-left-radius: $br;
    .symbol { margin-bottom: 20%; }
  }
  &[data-edge="bottom"] {
    border-top-right-radius: $br;
    border-top-left-radius: $br;
    .symbol { margin-top: 20%; }
  }
  &[data-edge="left"] {
    border-top-right-radius: $br;
    border-bottom-right-radius: $br;
    .symbol { margin-right: 20%; }
  }
  &[data-edge="right"] {
    border-top-left-radius: $br;
    border-bottom-left-radius: $br;
    .symbol { margin-left: 20%; }
  }
}

.symbol {
  width: 30%;
  height: 30%;
  box-sizing: border-box;

  &[data-type="1"] { // LANDMARK
    border: calc(0.2vw * var(--vws)) solid #ffffff;
    border-top-left-radius: 100vw;
    border-top-right-radius: 100vw;
  }
  &[data-type="2"] { // MERCHANT
    border-top-left-radius: 20vw;
    border-top-right-radius: 20vw;
    border-bottom-left-radius: 20vw;
    transform: rotate(45deg);
    border: calc(0.2vw * var(--vws)) solid #ffffff;
  }
  &[data-type="3"] { // USER
    background-color: #ffffff;
    border-radius: 100vw;
  }
}
</style>
