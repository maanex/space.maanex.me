<template>
  <div class="container">
    <div class="placer">
      <ElementsDiamondPicker uuid="writesimple-pos" />
    </div>
    <div class="text">
      <ElementsTextInput v-model="text">
        <span :data-tooexp="tooExpensive">Cost: {{ text.length ? cost : '-' }}</span>
      </ElementsTextInput>
    </div>
    <button @click="write()">
      {{
        text.length
          ? tooExpensive
            ? 'Expen'
            : 'Write'
          : (x || y)
            ? 'Reset'
            : '-'
      }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { EntityType, Formulas } from '@maanex/spacelib-common'
import { Entity } from '~/composables/world';

const x = useState(`diamondpicker-writesimple-pos-x`, () => 0)
const y = useState(`diamondpicker-writesimple-pos-y`, () => 0)
const text = useState(`diamondpicker-writesimple-text`, () => '')

const entities = useWorldEntities()
const pos = usePosition()
const props = useProps()
const crosshairs = useCrosshairs()
const sock = useSocket()

const cost = computed(() => Formulas.simpleWriteCost(text.value.length))
const tooExpensive = computed(() => (cost.value > props.value.resources))

function write() {
  if (tooExpensive.value) return

  if (text.value.length) {
    const ex = ~~(pos.value.x + x.value * 64)
    const ey = ~~(-pos.value.y + y.value * 64)
    const [ tempid, actual ] = sock.sendEntityPacket(EntityType.MESSAGE, ex, ey, text.value)
    const entity: Entity = {
      id: tempid,
      x: ex,
      y: ey,
      type: 2,
      data: text.value
    }
    entities.value.set(tempid, entity)
    props.value.resources -= cost.value
    text.value = ''

    actual.then((val) => {
      entities.value.delete(tempid)
      if (typeof val === 'number') entities.value.set(val, entity)
    })
  }

  x.value = 0
  y.value = 0
  delete crosshairs.value.writesimple
}

function updateCrosshair() {
  if (!x.value && !y.value)
    return
  if (!crosshairs.value.writesimple)
    crosshairs.value.writesimple = { x: 0, y: 0 }
  crosshairs.value.writesimple.x = x.value * 64
  crosshairs.value.writesimple.y = y.value * 64
}

watch(x, updateCrosshair)
watch(y, updateCrosshair)
onBeforeUnmount(() => { delete crosshairs.value.writesimple })
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  width: 100%;
  height: 100%;
  padding: 1vw;
  display: grid;
  grid-template-columns: 40% 50%;
  column-gap: 10%;
  box-sizing: border-box;
}

.placer {
  aspect-ratio: 1;
}

.text {
  height: 15.6vw;
  grid-column: 2;
  grid-row: 1 / span 2;

  span {
    font-size: .9vw;
    font-family: $font-major;
    color: mix($color-beige, #000000, 30%);

    &[data-tooexp=true]::after {
      content: '!';
      font-size: .7vw;
      font-family: $font-regular;
      background-color: mix($color-beige, #000000, 30%);
      color: $color-beige;
      border-radius: 100vw;
      margin-left: .5vw;
      padding: 0 .3vw;
      animation: blink 1s steps(1) infinite;

      @keyframes blink {
        0% { background-color: mix($color-beige, #000000, 30%); color: $color-beige; }
        50% { background-color: transparent; color: mix($color-beige, #000000, 30%); }
        100% { background-color: mix($color-beige, #000000, 30%); color: $color-beige; }
      }
    }
  }
}

button {
  width: 60%;
  border: .35vw solid mix($color-beige, #000000, 30%);
  border-radius: 100vw;
  margin-left: 20%;
  height: fit-content;
  font-size: .9vw;
  font-family: $font-major;
  text-transform: uppercase;
  text-align: center;
  color: mix($color-beige, #000000, 30%);
  padding: .3vw;
  box-sizing: border-box;
  outline: none;
  background-color: #00000011;
  cursor: pointer;

  &:hover {
    border-color: #000000;
  }
}
</style>
