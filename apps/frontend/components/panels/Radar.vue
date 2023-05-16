<template>
  <div ref="container" class="container">
    <div class="grid">
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
    <div class="entities" :style="{ '--zoom': .1 + (1-zoomHandle)**2 }">
      <div
        v-for="e of entities"
        :key="e.id"
        :style="{ top: `${e.y}px`, left: `${e.x}px` }"
        :data-type="e.type"
      >
        <div class="inner" />
      </div>
    </div>
    <div class="ship">
      <p>&bullet;</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Entity } from '../../composables/world'

const GRID_SIZE = 128
const zoomHandle = useState('handle-zoom', () => 0)

const container = ref(null)
const position = usePosition()
const worldEntities = useWorldEntities()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))
/** entities but their x and y pos are screen coords and not world coords */
const entities = useState<Entity[]>(() => ([]))

function update() {
  const zoom = (zoomHandle.value + 0.1) * GRID_SIZE * 30
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

  const newEntities = []
  for (const e of worldEntities.value) {
    const x = bounds.width / 2 + (e.x - position.value.x) * pixelsPerTile
    const y = bounds.height / 2 + (e.y + position.value.y) * pixelsPerTile
    newEntities.push({ ...e, x, y })
  }
  entities.value = newEntities
}

onMounted(update)
useResizeObserver(container, update)
watch(position.value, update)
watch(zoomHandle, update)
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

.grid {
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

.entities {
  & > div {
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--zoom));

    &:hover::before {
      content: '';
      display: block;
      top: -2vw;
      left: -2vw;
    }

    .inner {
      display: block;
    }

    &[data-type="2"] .inner {
      // message
      width: 1vw;
      height: 1vw;
      background-color: #169b64;
      border: .2vw solid #ffffff;
      transform: rotate(45deg);
      border-radius: .3vw;
    }
  }
}
</style>
