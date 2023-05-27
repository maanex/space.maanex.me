<template>
  <div class="container">
    <div class="mapcontainer">
      <img ref="map" class="worldmap" src="~/assets/img/worldmap.svg" alt="" draggable="false">
      <div class="markercontainer">
        <div v-for="poi of renderPois" :key="poi.name" class="poi" :style="poi.css" :data-type="poi.type" @mouseenter="hoveredPoi = poi.name" />
        <img ref="marker" class="marker" src="~/assets/img/mapmarker.svg" alt="" :style="markerCss" draggable="false">
      </div>
    </div>
    <div class="textcontainer">
      <div />
      <div class="left">
        <p><b>{{ toCoords(adjustedPos.x, 'W', 'E') }}</b></p>
        <p><b>{{ toCoords(adjustedPos.y, 'S', 'N') }}</b></p>
        <p v-text="sector" />
      </div>
      <div class="right">
        <p>POI- <b v-text="hoveredPoi || 'none'" /></p>
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
const pois = useWorldPois()
const map = ref(null)
const hoveredPoi = useState<string>(() => '')

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

const renderPois = computed(() => {
  return [ ...pois.value.values() ]
    .map(p => ({
      name: p[3],
      type: p[2],
      css: {
        left: ((0.5 + Number(p[0]) / Const.mapRadius / 2) * 100) + '%',
        top: ((0.5 - Number(p[1]) / Const.mapRadius / 2) * 100) + '%'
      }
    }))
})

const markerCss = computed(() => ({
  left: ((0.5 + adjustedPos.value.x / Const.mapRadius / 2) * 100) + '%',
  top: ((0.5 - adjustedPos.value.y / Const.mapRadius / 2) * 100) + '%'
}))

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
    transform: translate(-50%, -3%);
    position: absolute;
  }

  .markercontainer {
    position: absolute;
    display: block;
    width: 80%;
    left: 10%;
    height: 65%;
    top: 16%;
  }

  .poi {
    --rot: 0deg;
    --xoff: -50%;
    position: absolute;
    width: calc(0.6vw * var(--vws));
    height: calc(0.6vw * var(--vws));
    box-sizing: border-box;
    box-shadow: 0 0 0 calc(0.1vw * var(--vws)) $color-beige;
    transform: translate(-50%, -50%);
    animation: poiin .4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

    &[data-type="1"] { // LANDMARK
      border: calc(0.15vw * var(--vws)) solid black;
      width: calc(0.5vw * var(--vws));
      height: calc(0.5vw * var(--vws));
      border-top-left-radius: 100vw;
      border-top-right-radius: 100vw;
    }
    &[data-type="2"] { // MERCHANT
      --rot: 45deg;
      --xoff: -100%;
      background-color: $color-beige;
      border-top-left-radius: 20vw;
      border-top-right-radius: 20vw;
      border-bottom-left-radius: 20vw;
      border: calc(0.2vw * var(--vws)) solid black;
    }
    &[data-type="3"] { // USER
      background-color: black;
      border-radius: 100vw;
      width: calc(0.3vw * var(--vws));
      height: calc(0.3vw * var(--vws));
    }
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

@keyframes poiin {
  0% { transform: translate(-50%, var(--xoff)) rotate(var(--rot)) scale(0); opacity: 0; }
  100% { transform: translate(-50%, var(--xoff)) rotate(var(--rot)) scale(1); opacity: 1; }
}
</style>
