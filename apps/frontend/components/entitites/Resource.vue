<template>
  <div class="resource">
    <div class="inner" :style="{ backgroundColor, '--scale': scale }" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number
  data: string
}>()

const backgroundColor = computed(() => {
  const blend = (Math.sin(props.id) + 1) / 2
  const int = ((0x40 + ~~((0x5e - 0x40) * blend)) << 16)
    | ((0x50 + ~~((0x89 - 0x50) * blend)) << 8)
    | ((0x88 + ~~((0xa5 - 0x88) * blend)))
  return '#' + int.toString(16).padStart(6, '0')
})

const scale = computed(() => {
  // const rand = (Math.cos(props.id) + 1) / 2
  // return (rand**3 + .5) * 2
  return Math.log2(Number(props.data)) / 3
})
</script>

<style scoped lang="scss">
.resource {
  .inner {
    width: 3vw;
    height: 3vw;
    border-radius: 3vw;
    background-color: #5e5d92;
    filter: blur(.6vw);
    z-index: 20;
    position: relative;
    transform:
      translate(-50%, -50%)
      scale(var(--scale));
    animation: entin 1s ease-out forwards;
  }
}

@keyframes entin {
  0% { scale: .5; opacity: 0; }
  100% { scale: 1; opacity: 1; }
}
</style>
