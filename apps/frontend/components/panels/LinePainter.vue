<template>
  <ElementsColorPicker v-if="!color" :available="availableColors" @picked="c => color = c" />
  <div v-else class="container">
    <div class="pos1">
      <ElementsDiamondPicker uuid="linepainter-pos1" />
    </div>
    <div class="pos2">
      <ElementsDiamondPicker uuid="linepainter-pos2" />
    </div>

    <button @click="">AAA</button>
  </div>
</template>

<script setup lang="ts">
import { Color, Const, EntityType, Formulas, UserUnlocks } from '@maanex/spacelib-common'
import { Entity } from '~/composables/world';

const x1 = useState(`diamondpicker-writesimple-pos1-x`, () => 0)
const y1 = useState(`diamondpicker-writesimple-pos1-y`, () => 0)
const x2 = useState(`diamondpicker-writesimple-pos2-x`, () => 0)
const y2 = useState(`diamondpicker-writesimple-pos2-y`, () => 0)
const text = useState(`diamondpicker-writesimple-text`, () => '')
const color = useState<Color | null>(`diamondpicker-writesimple-color`, () => Color.GREEN)

const entities = useWorldEntities()
const pos = usePosition()
const props = useProps()
const crosshairs = useCrosshairs()
const sock = useSocket()
const account = useAccount()
const docs = useDocuments()

const cost = computed(() => Formulas.simpleWriteCost(text.value.length))
const tooExpensive = computed(() => (text.value.length && cost.value > props.value.resources))

const availableColors = computed(() => {
  const out: Color[] = [ Color.GREEN ]
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_BLUE)) out.push(Color.BLUE)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_BROWN)) out.push(Color.BROWN)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_YELLOW)) out.push(Color.YELLOW)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_RED)) out.push(Color.RED)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_BLACK)) out.push(Color.BLACK)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_WHITE)) out.push(Color.WHITE)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_PINK)) out.push(Color.PINK)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_ORANGE)) out.push(Color.ORANGE)
  if (props.value.unlocks.includes(UserUnlocks.SIMPLEWRITE_COLOR_MINT)) out.push(Color.MINT)
  return out
})

function updateCrosshair1() {
  if (!x1.value && !y1.value)
    return
  if (!crosshairs.value.linepainter1)
    crosshairs.value.linepainter1 = { x: 0, y: 0 }
  crosshairs.value.linepainter1.x = x1.value * 64
  crosshairs.value.linepainter1.y = y1.value * 64
}

function updateCrosshair2() {
  if (!x2.value && !y2.value)
    return
  if (!crosshairs.value.linepainter2)
    crosshairs.value.linepainter2 = { x: 0, y: 0 }
  crosshairs.value.linepainter2.x = x2.value * 64
  crosshairs.value.linepainter2.y = y2.value * 64
}

watch(x1, updateCrosshair1)
watch(y1, updateCrosshair1)
watch(x2, updateCrosshair2)
watch(y2, updateCrosshair2)
onBeforeUnmount(() => {
  delete crosshairs.value.linepainter1
  delete crosshairs.value.linepainter2
})
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  width: 100%;
  height: 100%;
  padding: calc(1vw * var(--vws));
  display: grid;
  grid-template-columns: 40% 50%;
  column-gap: 10%;
  box-sizing: border-box;
}

.pos1, .pos2 {
  aspect-ratio: 1;
}

button {
  width: 60%;
  border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  border-radius: calc(100vw * var(--vws));
  margin-left: 20%;
  height: fit-content;
  font-size: calc(.9vw * var(--vws));
  font-family: $font-major;
  text-transform: uppercase;
  text-align: center;
  color: mix($color-beige, #000000, 30%);
  padding: calc(.3vw * var(--vws));
  box-sizing: border-box;
  outline: none;
  background-color: #00000011;
  cursor: pointer;

  &:hover {
    border-color: #000000;
  }

  &.colors {
    position: absolute;
    top: 4%;
    left: 40%;
    margin: 0;
    padding: 0;
    width: calc(2vw * var(--vws));
    height: calc(3vw * var(--vws));
    text-transform: uppercase;
  }
}
</style>
