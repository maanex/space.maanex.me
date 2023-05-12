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
        <p>SECTOR 3</p>
      </div>
      <div class="right">
        <p>RESOURCES- <b>24,525</b> ok</p>
        <p>RADIATION- <b>02.00%</b> ok</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const position = usePosition()
const map = ref(null)
const markerCss = useState<any>(() => {})
const mapRadius = 1_000_000
// const ring1 =   200_000
// const ring2 =   600_000
// const ring3 = 1_000_000

function toCoords(v: number, neg: string, pos: string) {
  if (v < 0) return `${toTime(-v)}${neg}`
  return `${toTime(v)}${pos}`
}

function toTime(v: number) {
  const hours = ~~(v / 10000)
  const hourParts = v % 10000
  const minutes = ~~(hourParts / 10000 * 60)
  const minuteParts = v % 100
  const seconds = ~~(minuteParts / 100 * 60)
  return `${hours}'${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}`
}

function update() {
  const bounds = (map.value! as Element)?.getBoundingClientRect()

  const hCenter = bounds.width/2
  const hRadius = bounds.width/100*40
  const hPos = hCenter + position.value.x/mapRadius*hRadius
  const hPosAdjusted = hPos - bounds.width*0.02/2

  const vCenter = bounds.height/2
  const vRadius = bounds.height/40*13
  const vPos = vCenter + -position.value.y/mapRadius*vRadius
  const vPosAdjusted = vPos - bounds.width*0.02/2

  markerCss.value = {
    top: `${vPosAdjusted}px`,
    left: `${hPosAdjusted}px`
  }
}

onMounted(update)
onUpdated(update)
watch(position, update)
useResizeObserver(map, update)
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  padding: $gap;
  display: flex;
  flex-direction: column;

  & > div {
    opacity: .7;
  }

  .mapcontainer {
    position: relative;
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
    gap: calc($gap * 3);
    flex-grow: 1;
    justify-content: center;

    .left {
      text-align: right;
      position: relative;
      width: fit-content;

      &::after {
        content: '';
        width: 100%;
        height: 0.5vw;
        background-color: black;
        position: absolute;
        bottom: calc(-1 * $gap);
      }
    }

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: $gap;
    }
  }
}
</style>
