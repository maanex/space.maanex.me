<template>
  <div
    ref="container"
    class="container"
    :style="{ '--zoom': .1 + (1-zoomHandle)**2, '--ambiance': ambianceColor }"
  >
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
    <div class="entities">
      <div
        v-for="e of entities"
        :key="e.id"
        :style="{ top: `${~~e.y}px`, left: `${~~e.x}px` }"
        :data-type="e.type"
      >
        <div class="inner" />
        <div class="data" v-text="e.data" />
      </div>
    </div>
    <div class="ship">
      <div class="s" :style="{ '--rot': `${directionHandle}deg` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Entity } from '../../composables/world'

const GRID_SIZE = 128
const zoomHandle = useState('handle-zoom', () => 0)
const directionHandle = useState('handle-direction', () => 0)

const container = ref(null)
const position = usePosition()
const worldEntities = useWorldEntities()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))
/** entities but their x and y pos are screen coords and not world coords */
const entities = useState<Entity[]>(() => ([]))
const ambianceColor = useState<string>(() => '#00000000')

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

  const ambianceHue = (Math.sin(position.value.x / 149210) * Math.cos(position.value.y / 44910)) * 0.5 + 0.5
  const ambianceSat = (Math.sin(position.value.x / 4100 + position.value.y / 24110) * Math.cos(position.value.x / 99990)) * 0.3 + 0.6
  ambianceColor.value = `#${HSLToRGB(ambianceHue*360, ambianceSat, .8).toString(16).padStart(6, '0')}33`
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

.ambiance {
}

.grid {
  background-color: var(--ambiance);

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
  pointer-events: none;

  .s {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5vw;
    height: 1.5vw;
    border-radius: 3vw;
    border-top-right-radius: 0.8vw;
    background-color: #000000;
    border: .2vw solid #ffffff;
    transform:
      translate(-50%, -50%)
      scale(calc(var(--zoom) * 0.8 + 0.2))
      rotate(calc(var(--rot) - 45deg));
  }
}

.entities {
  & > div {
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--zoom));

    .inner { display: block; }
    .data { display: none; }

    &[data-type="2"] {
      // message
      .inner {
        width: 1vw;
        height: 1vw;
        background-color: #169b64;
        border: .2vw solid #ffffff;
        transform: rotate(45deg);
        border-radius: .3vw;
        z-index: 20;
        position: relative;
      }
      &:hover .data {
        display: grid;
        place-items: center;
        position: absolute;
        top: -1vw;
        left: -1vw;
        height: calc(100% + 2vw);
        padding-left: calc(100% + 2vw);
        padding-right: 1vw;
        background-color: #00000044;
        border-radius: 0.5vw;
        color: #ffffff;
        width: max-content;
        max-width: 30vw;
        font-family: $font-regular;
        font-size: 1vw;
        line-height: 1.2vw;
      }
    }
  }
}
</style>
