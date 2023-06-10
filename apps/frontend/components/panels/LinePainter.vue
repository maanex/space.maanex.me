<template>
  <ElementsColorPicker v-if="!color" :available="availableColors" @picked="c => color = c" />
  <div v-else class="container">
    <div class="pos1">
      <ElementsDiamondPicker uuid="linepainter-pos1" />
      <button class="colors" v-text="color" @click="color = null" />
    </div>
    <div class="pos2">
      <ElementsDiamondPicker uuid="linepainter-pos2" />
      <button v-if="canPaintTick" class="thick" v-text="thick ? '#' : '|'" @click="thick = !thick" />
    </div>

    <button @click="reset()" v-text="(x1 || y1 || x2 || y2) ? 'Reset' : '-'" />
    <button @click="paint()" v-text="painting ? (tooExpensive ? 'EXPEN' : 'PAINT') : '-'" />

    <p class="cost" v-text="painting ? cost : ''" />
  </div>
</template>

<script setup lang="ts">
import { Color, EntityType, Formulas, UserUnlocks } from '@maanex/spacelib-common'
import { Entity } from '~/composables/world';

const x1 = useState(`diamondpicker-linepainter-pos1-x`, () => 0)
const y1 = useState(`diamondpicker-linepainter-pos1-y`, () => 0)
const x2 = useState(`diamondpicker-linepainter-pos2-x`, () => 0)
const y2 = useState(`diamondpicker-linepainter-pos2-y`, () => 0)
const color = useState<Color | null>(`diamondpicker-linepainter-color`, () => Color.WHITE)
const thick = useState<boolean>(`diamondpicker-linepainter-thick`, () => false)

const entities = useWorldEntities()
const pos = usePosition()
const props = useProps()
const crosshairs = useCrosshairs()
const sock = useSocket()
const account = useAccount()

const length = computed(() => Math.sqrt((x1.value - x2.value)**2 + (y1.value - y2.value)**2) * 64)
const cost = computed(() => Formulas.linePainterCost(length.value, thick.value))
const painting = computed(() => (x1.value || y1.value) && (x2.value || y2.value))
const tooExpensive = computed(() => (painting.value && cost.value > props.value.resources))
const canPaintTick = computed(() => props.value.unlocks.includes(UserUnlocks.LINEPAINT_THICK_STROKES))

const availableColors = computed(() => {
  const out: Color[] = [ Color.WHITE ]
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_BLUE)) out.push(Color.BLUE)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_BROWN)) out.push(Color.BROWN)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_YELLOW)) out.push(Color.YELLOW)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_RED)) out.push(Color.RED)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_BLACK)) out.push(Color.BLACK)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_GREEN)) out.push(Color.GREEN)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_PINK)) out.push(Color.PINK)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_ORANGE)) out.push(Color.ORANGE)
  if (props.value.unlocks.includes(UserUnlocks.LINEPAINT_COLOR_MINT)) out.push(Color.MINT)
  return out
})

function reset() {
  x1.value = 0
  x2.value = 0
  y1.value = 0
  y2.value = 0
  delete crosshairs.value.linepainter1
  delete crosshairs.value.linepainter2
}

function paint() {
  if (!painting.value) return
  if (tooExpensive.value) return

  const ex1 = ~~(pos.value.x + x1.value * 64)
  const ey1 = ~~(pos.value.y - y1.value * 64)
  const ex2 = ~~(pos.value.x + x2.value * 64)
  const ey2 = ~~(pos.value.y - y2.value * 64)

  const data = color.value + (thick.value ? '1' : '0') + ex2 + ',' + ey2
  const [ tempid, actual ] = sock.sendEntityPacket(EntityType.LINE, ex1, ey1, data)
  const entity: Entity = {
    id: tempid,
    x: ex1,
    y: ey1,
    type: EntityType.LINE,
    data: (account.value?.sig ?? '0000') + data
  }
  entities.value.set(tempid, entity)
  props.value.resources -= cost.value

  actual.then((val) => {
    entities.value.delete(tempid)
    if (typeof val === 'number') entities.value.set(val, entity)
  })

  reset()
}

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
  grid-template-columns: 45% 45%;
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

  &.colors, &.thick {
    position: absolute;
    top: 4%;
    margin: 0;
    padding: 0;
    width: calc(2vw * var(--vws));
    height: calc(3vw * var(--vws));
    text-transform: uppercase;
  }

  &.colors { left: 43%; }
  &.thick { right: 43%; }
}

.cost {
  position: absolute;
  top: 60%;
  left: 30%;
  width: 40%;
  text-align: center;
}
</style>
