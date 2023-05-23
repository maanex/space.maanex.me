<template>
  <div class="container">
    <div class="mapcontainer">
      <img ref="map" class="worldmap" src="~/assets/img/worldmap.svg" alt="" draggable="false">
      <img ref="marker" class="marker" src="~/assets/img/mapmarker.svg" alt="" :style="markerCss" draggable="false">
    </div>
    <div class="textcontainer">
      <div />
      <div class="left">
        <p><b>{{ toCoords(adjustedPos.x, 'W', 'E') }}</b></p>
        <p><b>{{ toCoords(adjustedPos.y, 'S', 'N') }}</b></p>
        <p v-text="sector" />
      </div>
      <div class="right">
        <p>RESOURCES- <b>{{ props.resources.toLocaleString(undefined, { notation: 'compact' }) }}</b> ok</p>
        <p>RADIATION- <b>{{ Math.min(99.99, rad * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, minimumIntegerDigits: 2 }) }}%</b> <span :data-status="radstatus" v-text="radstatus" /></p>
      </div>
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Const } from '@maanex/spacelib-common'

const position = usePosition()
const rad = useRadiation()
const props = useProps()
const map = ref(null)
const markerCss = useState<any>(() => {})

const adjustedPos = computed(() => {
  if (!rad.value) return position.value

  return {
    x: position.value.x + rad.value * (Math.random() * Math.random() * 2 - 1 + Math.sin((position.value.y - position.value.x) / 1600)) * Const.mapRing1 * 2,
    y: position.value.y + rad.value * (Math.random() * Math.random() * 2 - 1 + Math.cos((position.value.x + position.value.y) / 1600)) * Const.mapRing1 * 2,
  }
})

const sector = computed(() => {
  const distance = Math.sqrt(adjustedPos.value.x ** 2 + adjustedPos.value.y ** 2)
  if (distance <= Const.mapRing1) return 'SECTOR 1'
  if (distance <= Const.mapRing2) return 'SECTOR 2'
  if (distance <= Const.mapRing3) return 'SECTOR 3'
  return 'SECTOR 4'
})

const radstatus = computed(() => {
  if (rad.value === 0) return 'ok'
  if (rad.value < .10) return 'warn'
  return 'alert'
})

function toCoords(v: number, neg: string, pos: string) {
  if (v < 0) return `${toTime(-v)}${neg}`
  return `${toTime(v)}${pos}`
}

function toTime(v: number) {
  const hours = ~~(v / 10000)
  const hourParts = v % 10000
  const minutes = ~~(hourParts / 10000 * 60)
  const minuteParts = hourParts % (10000 / 60)
  const seconds = ~~(minuteParts / 10000 * 60 * 60)
  return `${hours}'${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}`
}

function update() {
  const bounds = (map.value! as Element)?.getBoundingClientRect()

  const hCenter = bounds.width/2
  const hRadius = bounds.width/100*40
  const hPos = hCenter + adjustedPos.value.x/Const.mapRadius*hRadius
  const hPosAdjusted = hPos - bounds.width*0.02/2

  const vCenter = bounds.height/2
  const vRadius = bounds.height/40*13
  const vPos = vCenter + -adjustedPos.value.y/Const.mapRadius*vRadius
  const vPosAdjusted = vPos - bounds.width*0.02/2

  markerCss.value = {
    top: `${vPosAdjusted}px`,
    left: `${hPosAdjusted}px`
  }
}

onMounted(update)
watch(position.value, update)
watch(rad, update)
useResizeObserver(map, update)
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  height: 100%;
  box-sizing: border-box;
  padding: calc($gap * var(--vws));
  display: flex;
  flex-direction: column;
  position: relative;

  .mapcontainer {
    position: relative;
    opacity: .7;
    overflow: hidden;
  }

  .worldmap {
    width: 100%;
    aspect-ratio: 100/40;
  }

  .marker {
    width: 2%;
    position: absolute;
  }

  .textcontainer {
    display: grid;
    gap: calc($gap * 2 * var(--vws));
    grid-template-columns: 1fr 4fr 8fr 1fr;
    flex-grow: 1;
    justify-content: center;
    opacity: .7;

    p {
      font-size: calc(1vw * var(--vws));
    }

    .left {
      text-align: right;
      position: relative;

      &::after {
        content: '';
        width: 100%;
        height: calc(0.5vw * var(--vws));
        background-color: black;
        position: absolute;
        bottom: calc(-1 * $gap * var(--vws));
      }
    }

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: calc($gap * var(--vws));
    }

    span[data-status="alert"] {
      display: inline-block;
      background-color: black;
      color: $color-beige;
      padding: 0 calc(.3vw * var(--vws));
      margin: 0 calc(-.3vw * var(--vws));
      font-family: $font-major;
      animation: textblink .7s steps(1) infinite;
    }
  }
}

@keyframes textblink {
  0% { color: black; }
  50% { color: $color-beige; }
  100% { color: black; }
}
</style>
