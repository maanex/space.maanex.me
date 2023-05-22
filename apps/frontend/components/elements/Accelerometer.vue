<template>
  <svg class="accelerometer" viewBox="0 0 10 20" version="1.1" xml:space="preserve" :style="css">
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
const MAX_SPEED = 600

const accl = useAcceleration()
const flex = computed(() => Math.sqrt(accl.value.x ** 2 + accl.value.y ** 2) / MAX_SPEED)
const path = computed(() => `M5,1 C7,1 9,3 9,5 C9,7 7,9 5,${9 + flex.value * 10} C3,9 1,7 1,5 C1,3 3,1 5,1 Z`)
const dir = computed(() => {
  const rad = Math.atan2(accl.value.y, accl.value.x)
  const radDeg = ((rad / Math.PI * 180) + 270) % 360
  return Math.floor((180 - radDeg) * 10) / 10
})
const css = computed(() => ({
  transform: `translate(calc(-1vw * var(--vws)), calc(-1vw * var(--vws))) rotate(${dir.value}deg)`
}))
</script>

<style scoped lang="scss">
svg {
  width: calc(2vw * var(--vws));
  height: calc(4vw * var(--vws));
  opacity: .7;
  fill-rule: evenodd;
  clip-rule: evenodd;
  stroke-linejoin: round;
  stroke-miterlimit: 2;
  transform: translate(calc(-1vw * var(--vws)), calc(-1vw * var(--vws)));
  transform-origin: calc(1vw * var(--vws)) calc(1vw * var(--vws));

  path {
    fill: none;
    stroke: #000000;
    stroke-width: calc(.06vw * var(--vws));
  }
}
</style>
