<template>
  <div class="line" :style="visuals.outerCss">
    <div class="inner" :style="visuals.innerCss" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number
  data: string
  ex: number
  ey: number
}>()

const stroke = 0.4

const visuals = computed(() => {
  const x2 = Number(props.data.substring(6).split(',')[0])
  const y2 = Number(props.data.substring(6).split(',')[1])

  const w = x2 - props.ex
  const h = y2 - props.ey
  const len = Math.sqrt(w**2 + h**2)
  const angle = Math.atan2(-h, w)
  const color = props.data.charAt(4)

  return {
    outerCss: {
      '--height': (props.data[5] === '1' ? stroke*3 : stroke) + 'vh',
    },
    innerCss: {
      width: `calc(${len}px * var(--pxdensity))`,
      transform: `rotate(${angle}rad)`,
      '--color': `var(--col-${color})`
    }
  }
})
</script>

<style scoped lang="scss">
.line {
  position: relative;
  width: var(--height);
  height: var(--height);
  animation: entin .7s ease-in-out forwards;

  .inner {
    height: 100%;
    border-radius: 100vw;
    background-color: var(--color);
    transform-origin: calc(var(--height) * 0.5) 50%;
  }
}

@keyframes entin {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
