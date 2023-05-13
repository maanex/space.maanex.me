<template>
  <div ref="container" class="container">
    <div class="lines">
      <div
        v-for="line,i of vLines"
        :key="i"
        class="v"
        :style="{ left: `${line}px` }"
      />
      <div
        v-for="line,i of hLines"
        :key="i"
        class="h"
        :style="{ top: `${line}px` }"
      />
    </div>
    <div class="ship">
      <p>hi</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const GRID_SIZE = 10
const MAP_ZOOM = 10

const container = ref(null)
const position = usePosition()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))

function update() {
  const bounds = (container.value! as Element)?.getBoundingClientRect()
  const realZoom = (bounds.width / GRID_SIZE)

  const newV = []
  for (let i = (-position.value.x / MAP_ZOOM) % realZoom; i < bounds.width; i += realZoom)
    newV.push(i)
  vLines.value = newV

  const newH = []
  for (let i = (position.value.y / MAP_ZOOM) % realZoom; i < bounds.height; i += realZoom)
    newH.push(i)
  hLines.value = newH
}

onMounted(update)
onUpdated(update)
useResizeObserver(container, update)
watch(position.value, update)
</script>

<style scoped lang="scss">
.container {
  background-color: #444444;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  position: relative;

  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
  }
}

.lines {
  .v {
    position: absolute;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: #ffffff11;
  }

  .h {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ffffff11;
  }
}

.ship {
  p {
    position: absolute;
    top: 50%;
    left: 50%;
  }
}
</style>
