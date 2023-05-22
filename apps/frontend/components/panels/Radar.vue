<template>
  <div
    ref="container"
    class="container"
    :style="{ '--zoom': zoomFactor, '--scale': scaleFactor * 2, '--ambiance': ambianceColor }"
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
      <div
        v-for="[ id, pos ] of Object.entries(crosshairs)"
        :key="id"
        class="c"
        :style="{
          top: `calc(50% + ${pos.y * pixelsPerTileGlob}px)`,
          left: `calc(50% + ${pos.x * pixelsPerTileGlob}px)`
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Entity } from '../../composables/world'

/** after how many tiles there is a grid cell drawn */
const GRID_SIZE = 128
/** how many tiles together make one chunk. with zoom level 1 exactly two chunks are shown horizontal */
const BASE_TILE_COUNT = 128

const zoomHandle = useZoomHandle()
const directionHandle = useDirectionHandle()
const zoomFactor = computed(() => (1 + zoomHandle.value * 3) ** 2)
const scaleFactor = computed(() => 1 / zoomFactor.value)

const container = ref(null)
const position = usePosition()
const worldEntities = useWorldEntities()
const crosshairs = useCrosshairs()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))
/** entities but their x and y pos are screen coords and not world coords */
const entities = useState<Entity[]>(() => ([]))
const ambianceColor = useState<string>(() => '#00000000')
const pixelsPerTileGlob = useState<number>(() => 1)

function update() {
  const bounds = (container.value! as Element)?.getBoundingClientRect()
  const tileCount = 2 * BASE_TILE_COUNT * zoomFactor.value
  const pixelsPerTile = (bounds.width / tileCount)
  pixelsPerTileGlob.value = pixelsPerTile
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
  const padding = Math.max(bounds.width, bounds.height) * 0.01
  for (const e of worldEntities.value.values()) {
    const x = bounds.width / 2 + (e.x - position.value.x) * pixelsPerTile
    const y = bounds.height / 2 + (-e.y + position.value.y) * pixelsPerTile

    if (x >= -padding && y >= -padding && x <= bounds.width + padding && y <= bounds.height + padding)
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
watch(worldEntities.value, update)
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
      scale(var(--scale))
      rotate(calc(var(--rot) - 45deg));
  }

  .c {
    position: absolute;
    width: calc(.2vw + 1px);
    height: calc(.2vw + 1px);
    border-radius: 3vw;
    background-color: #eeeeee;
    transform: translate(-50%, -50%);
    z-index: 18;

    &::before {
      content: '';
      position: absolute;
      top: -100vh;
      left: .1vw;
      width: 1px;
      height: 200vh;
      background-color: #bbbbbb;
    }

    &::after {
      content: '';
      position: absolute;
      left: -100vw;
      top: .1vw;
      height: 1px;
      width: 200vw;
      background-color: #bbbbbb;
    }
  }
}

.entities {
  & > div {
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--scale));

    &:hover { z-index: 30; }

    .inner { display: block; }
    .data { display: none; }

    &[data-type="1"] {
      // user
      .inner {
        width: 6vw;
        height: 6vw;
        background-color: yellow;
        border-radius: 100vw;
        z-index: 20;
        position: relative;
      }
    }

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
        animation: ent2in .7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
        backdrop-filter: blur(0.7vw);
      }
    }
  }
}

@keyframes ent2in {
  0% { transform: rotate(0deg); height: 0; border-width: 1px; background-color: #169b6400; border-radius: 0; opacity: 0.4; }
  50% { transform: rotate(0deg); height: 1vw; border-width: 1px; background-color: #169b6400; border-radius: 0; opacity: 1; }
  100% { transform: rotate(45deg); height: 1vw; border-width: .2vw; background-color: #169b64; border-radius: .3vw; opacity: 1; }
}
</style>
