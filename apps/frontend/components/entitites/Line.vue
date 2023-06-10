<template>
  <div class="line">
    <svg :viewBox="visuals.viewBox" :style="visuals.css">
      <path :d="visuals.path" :stroke-width="visuals.swidth" stroke="#bc9a6e" />
      <!-- YEAH NO -->
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number
  data: string
  ex: number
  ey: number
}>()

const visuals = computed(() => {
  const x2 = Number(props.data.substring(6).split(',')[0])
  const y2 = Number(props.data.substring(6).split(',')[1])

  const w = x2 - props.ex
  const h = y2 - props.ey
  const aw = Math.abs(w)
  const ah = Math.abs(h)

  const stroke = Math.min(aw, ah) / 10

  return {
    css: {
      width: `calc(${aw}px * var(--pxpertile))`,
      height: `calc(${ah}px * var(--pxpertile))`,
      transform: `translate(${w < 0 ? w : 0}, ${h < 0 ? h : 0})`
    },
    viewBox: `0 0 ${aw} ${ah}`,
    path: (w<0) === (h<0) ? `M0,${ah} L${aw},0` : `M0,0 L${aw},${ah}`,
    swidth: (props.data[5] === '1' ? stroke*3 : stroke) + 'px'
  }
})
</script>

<style scoped lang="scss">
.line {
  svg {
  }
}

@keyframes entin {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
