<template>
  <ElementsColorPicker v-if="!color" :available="availableColors" @picked="c => color = c" />
  <div v-else class="container">
    <div class="placer">
      <ElementsDiamondPicker uuid="writesimple-pos" />
      <button class="colors" v-text="color" @click="color = null" />
    </div>
    <div class="text">
      <ElementsTextInput v-model="text">
        <span :data-tooexp="tooExpensive">Cost: {{ text.length ? `${cost}/${props.resources}` : '-' }}</span>
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
import { Color, Const, EntityType, Formulas, UserUnlocks } from '@maanex/spacelib-common'
import { Entity } from '~/composables/world';

const x = useState(`diamondpicker-writesimple-pos-x`, () => 0)
const y = useState(`diamondpicker-writesimple-pos-y`, () => 0)
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

function write() {
  if (tooExpensive.value) return

  if (text.value.length) {
    const ex = ~~(pos.value.x + x.value * 64)
    const ey = ~~(pos.value.y - y.value * 64)

    const [ tempid, actual ] = sock.sendEntityPacket(EntityType.MESSAGE, ex, ey, color.value + text.value)
    const entity: Entity = {
      id: tempid,
      x: ex,
      y: ey,
      type: EntityType.MESSAGE,
      data: (account.value?.sig ?? '0000') + color.value + text.value
    }
    entities.value.set(tempid, entity)
    props.value.resources -= cost.value
    text.value = ''

    actual.then((val) => {
      entities.value.delete(tempid)
      if (typeof val === 'number') entities.value.set(val, entity)
    })

    if (!docs.value.has('mining'))
      docs.value.set('mining', false)
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

watch(text, (val) => {
  let sanitized = ''
  for (const char of val) {
    if (Const.charsetAllowedInMessages.includes(char))
      sanitized += char
  }
  if (sanitized === val)
    return
  text.value = sanitized
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

.placer {
  aspect-ratio: 1;
}

.text {
  height: calc(15.6vw * var(--vws));
  grid-column: 2;
  grid-row: 1 / span 2;

  span {
    font-size: calc(.9vw * var(--vws));
    font-family: $font-major;
    color: mix($color-beige, #000000, 30%);

    &[data-tooexp=true]::after {
      content: '!';
      font-size: calc(.7vw * var(--vws));
      font-family: $font-regular;
      background-color: mix($color-beige, #000000, 30%);
      color: $color-beige;
      border-radius: calc(100vw * var(--vws));
      margin-left: calc(.5vw * var(--vws));
      padding: 0 calc(.3vw * var(--vws));
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
