<template>
  <div class="container">
    <ElementsMiner uuid="minesimple" :active="!!sel" @mine="mine" />
    <div class="selection">
      <ElementsDiamondPicker uuid="minesimple-pos" />
    </div>
    <div class="text">
      <p>[{{ props.resources }}]</p>
    </div>
    <button @click="reset()">
      {{ (x === 0 && y === 0) ? '-' : 'Reset' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Entity } from '~/composables/world'
import { Vector } from '~/composables/position'

const x = useState(`diamondpicker-minesimple-pos-x`, () => 0)
const y = useState(`diamondpicker-minesimple-pos-y`, () => 0)
const sel = useState<Entity | null>(`diamondpicker-minesimple-sel`, () => null)

const entities = useWorldEntities()
const pos = usePosition()
const props = useProps()
const crosshairs = useCrosshairs()
const sock = useSocket()

function reset() {
  x.value = 0
  y.value = 0
  delete crosshairs.value.minesimple
  sel.value = null
}

function mine(amount: number) {
  if (!sel.value) return

  const newVal = Number(sel.value.data) - amount
  sel.value.data = String(newVal)

  sock.sendMinePacket(sel.value.id, amount)

  if (newVal <= 0) {
    entities.value.delete(sel.value.id)
    sel.value = null
  }
}

function updateFocusEntity(userPos: Vector) {
  const xVal = x.value * 86
  const yVal = y.value * 86
  let selEnt = null
  let selDist = 999999
  for (const ent of entities.value.values()) {
    const dist = Math.sqrt((ent.x - (userPos.x + xVal))**2 + (ent.y - (userPos.y - yVal))**2)
    if (dist > 36) continue
    if (dist > selDist) continue
    selDist = dist
    selEnt = ent
  }
  if (selEnt)
    sel.value = selEnt
  else
    sel.value = null
}

function updateCrosshair() {
  if (!x.value && !y.value)
    return
  if (!crosshairs.value.minesimple)
    crosshairs.value.minesimple = { x: 0, y: 0 }
  crosshairs.value.minesimple.x = x.value * 86
  crosshairs.value.minesimple.y = y.value * 86
  updateFocusEntity(pos.value)
}

watch(x, updateCrosshair)
watch(y, updateCrosshair)
watch(pos.value, updateFocusEntity)
onBeforeUnmount(() => { delete crosshairs.value.minesimple })
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
  row-gap: 4%;
  box-sizing: border-box;
}

.selection {
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
}

.text p {
  text-align: center;
}
</style>
