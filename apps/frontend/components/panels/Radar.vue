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
      <p>&bullet;</p>
    </div>
    {{ TEMPDIR }}
  </div>
</template>

<script setup lang="ts">
const GRID_SIZE = 16
const TEMPDIR = useState('handle-direction', () => 0)

const container = ref(null)
const position = usePosition()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))

function update() {
  const zoom = TEMPDIR.value
  const bounds = (container.value! as Element)?.getBoundingClientRect()
  const smallerEdge = Math.min(bounds.width, bounds.height)
  const pixelsPerTile = (smallerEdge / zoom)
  const pixelsPerGridLine = pixelsPerTile * GRID_SIZE

  const edgeOffsetX = (bounds.width / 2) % pixelsPerGridLine
  const edgeOffsetY = (bounds.height / 2) % pixelsPerGridLine

  const startX = (edgeOffsetX - position.value.x * pixelsPerTile) % pixelsPerGridLine
  const startY = (edgeOffsetY + position.value.y * pixelsPerTile) % pixelsPerGridLine

  const newV = []
  for (let i = startX; i < bounds.width; i += pixelsPerGridLine)
    if (i > 0) newV.push(i)
  vLines.value = newV

  const newH = []
  for (let i = startY; i < bounds.height; i += pixelsPerGridLine)
    if (i > 0) newH.push(i)
  hLines.value = newH
}

onMounted(update)
onUpdated(update)
useResizeObserver(container, update)
watch(position.value, update)
watch(TEMPDIR, update)
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
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 2vw;
  }
}
</style>
