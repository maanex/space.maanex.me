<template>
  <div
    ref="container"
    class="container"
    :style="{ '--zoom': zoomFactor, '--scale': scaleFactor * 2, '--ambiance': ambianceColor }"
  >
    <div class="grid" :style="{ opacity: 1 - rad }">
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
      <component
        v-for="e of entities"
        :is="renderEntities[e.type]"
        :key="e.id"
        :style="{ top: `${~~e.y}px`, left: `${~~e.x}px` }"
        :data="e.data"
        :id="e.id"
      />
    </div>
    <div class="ship">
      <div
        v-for="[id,strength] of scaneff"
        :key="id"
        class="a"
        :style="{ '--s': strength, '--sa': (strength * 2.8) + .2 }"
      />
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
      <ElementsPoiPointer v-for="poi of poisToPointAt" :key="poi[3]" :poi="poi" />
    </div>
    <div v-if="rad" class="extranoise" :style="{ opacity: .3 * rad }" />
  </div>
</template>

<script setup lang="ts">
import { EntityType } from '@maanex/spacelib-common'
import { Entity } from '../../composables/world'
import EntititesPerson from '~/components/entitites/Person.vue'
import EntititesMessage from '~/components/entitites/Message.vue'
import EntitiesResource from '~/components/entitites/Resource.vue'

const renderEntities: Record<EntityType, any> = {
  [ EntityType.UNKNOWN ]: undefined,
  [ EntityType.PERSON ]: EntititesPerson,
  [ EntityType.MESSAGE ]: EntititesMessage,
  [ EntityType.RESOURCE ]: EntitiesResource,
}

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
const worldPois = useWorldPois()
const rad = useRadiation()
const crosshairs = useCrosshairs()
const scaneff = useScanEffects()

const vLines = useState<number[]>(() => ([]))
const hLines = useState<number[]>(() => ([]))
/** entities but their x and y pos are screen coords and not world coords */
const entities = useState<Entity[]>(() => ([]))
const ambianceColor = useState<string>(() => '#00000000')
const pixelsPerTileGlob = useState<number>(() => 1)

const poisToPointAt = computed(() => [...worldPois.value.values()].map(p => {
  const dist = Math.sqrt((position.value.x - p[0])**2 + (position.value.y - p[1])**2)
  const lower = BASE_TILE_COUNT * 18
  const upper = 100000
  return [
    ...p,
    (dist - lower) / (upper - lower),
    dist > lower && dist < upper
  ] as const
}))

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
  const opacity = ~~(51 + 51 * rad.value)
  const lightness = .8 + rad.value * .2
  ambianceColor.value = `#${HSLToRGB(ambianceHue*360, ambianceSat, lightness).toString(16).padStart(6, '0')}${opacity.toString(16).padStart(2, '0')}`
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

  .a {
    position: absolute;
    top: calc(50% - 4.4vw);
    left: calc(50% - 4.4vw);
    width: 8vw;
    height: 8vw;
    background-color: #00ff0033;
    border-radius: 100vw;
    border: .4vw solid #00ff0033;
    transform:
      // translate(-50%, -50%)
      scale(var(--scale));
    animation: scanner 2s linear forwards;
  }

}

.extranoise {
  background-image: url('~/assets/img/noise.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
}

.entities > div {
  position: absolute;
  transform: translate(-50%, -50%) scale(var(--scale));

  &:hover { z-index: 30; }
}

@keyframes scanner {
  0% { scale: 0; opacity: 1; }
  100% { scale: calc(var(--sa) * 40); opacity: 0; border-color: #00ff0000; }
}
</style>
