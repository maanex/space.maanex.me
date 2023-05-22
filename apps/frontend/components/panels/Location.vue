<template>
  <div class="container">
    <div class="mapcontainer">
      <img ref="map" class="worldmap" src="~/assets/img/worldmap.svg" alt="" draggable="false">
      <img ref="marker" class="marker" src="~/assets/img/mapmarker.svg" alt="" :style="markerCss" draggable="false">
    </div>
    <div class="textcontainer">
      <div class="left">
        <p><b>{{ toCoords(position.x, 'W', 'E') }}</b></p>
        <p><b>{{ toCoords(position.y, 'S', 'N') }}</b></p>
        <p v-text="sector" />
      </div>
      <div class="right">
        <p>RESOURCES- <b>{{ props.resources.toLocaleString(undefined, { notation: 'compact' }) }}</b> ok</p>
        <p>RADIATION- <b>02.00%</b> ok</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Const } from '@maanex/spacelib-common'

const position = usePosition()
const props = useProps()
const map = ref(null)
const markerCss = useState<any>(() => {})

const sector = computed(() => {
  const distance = Math.sqrt(position.value.x ** 2 + position.value.y ** 2)
  if (distance <= Const.mapRing1) return 'SECTOR 1'
  if (distance <= Const.mapRing2) return 'SECTOR 2'
  if (distance <= Const.mapRing3) return 'SECTOR 3'
  return 'SECTOR 4'
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
  const hPos = hCenter + position.value.x/Const.mapRadius*hRadius
  const hPosAdjusted = hPos - bounds.width*0.02/2

  const vCenter = bounds.height/2
  const vRadius = bounds.height/40*13
  const vPos = vCenter + -position.value.y/Const.mapRadius*vRadius
  const vPosAdjusted = vPos - bounds.width*0.02/2

  markerCss.value = {
    top: `${vPosAdjusted}px`,
    left: `${hPosAdjusted}px`
  }
}

onMounted(update)
watch(position.value, update)
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
    display: flex;
    gap: calc($gap * 3 * var(--vws));
    flex-grow: 1;
    justify-content: center;
    opacity: .7;

    p {
      font-size: calc(1.2vw * var(--vws));
    }

    .left {
      text-align: right;
      position: relative;
      width: fit-content;

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
  }
}
</style>
