<template>
  <div class="container">
    <textarea cols="46" rows="9" :value="displayText" tabindex="-1" />
    <div />
    <button @click="clicked('up')">&UpArrow;</button>
    <button @click="clicked('down')">&DownArrow;</button>
    <button @click="clicked('left')">&LeftArrow;</button>
    <button @click="clicked('right')">&RightArrow;</button>
  </div>
</template>

<script setup lang="ts">
import { EntityType, WorldsEntities } from '@maanex/spacelib-common'
import { Entity } from '../../composables/world'
import { commsWestside } from '../../lib/comms/westside'
import { commsEastside } from '../../lib/comms/eastside'
import { commsBelortools } from '../../lib/comms/belortools'

const ents = useWorldEntities()
const pos = usePosition()

const connected = useState<Entity | null>(() => null)
const inRange = useState<boolean>(() => false)

const commState = useState<any>(() => null)
const commText = useState<string>(() => '')

/** (current state, pressed button) => [ output text, new state ] */
type CommsHandler<T> = (state: T, pressed: 'up' | 'down' | 'left' | 'right' | null) => [string, T]
const available: Partial<Record<WorldsEntities, CommsHandler<any>>> = {
  // // ...a is for hot reload, can be simplified
  [WorldsEntities.MERCHANT_WESTSIDE_OUTPOST]: (...a) => commsWestside(...a),
  [WorldsEntities.MERCHANT_EASTSIDE_OUTPOST]: (...a) => commsEastside(...a),
  [WorldsEntities.MERCHANT_BELOR_TOOLS]: (...a) => commsBelortools(...a)
}

const displayText = computed(() => (connected.value && inRange.value) ? commText.value : 'No communication partner nearby. Please get closer.')

function clicked(direction: 'up' | 'down' | 'left' | 'right') {
  if (!connected.value || !inRange.value) return
  const handler = available[connected.value!.id as WorldsEntities]!
  const [ text, state ] = handler(commState.value, direction)
  commText.value = text
  commState.value = state
}

//

function newCommEntity() {
  const handler = available[connected.value!.id as WorldsEntities]!
  const [ text, state ] = handler(null, null)
  commText.value = text
  commState.value = state
}

function findCommableEntity(): Entity | null {
  for (const ent of ents.value.values()) {
    if (ent.type !== EntityType.SPECIAL) continue
    if (!available[ent.id as WorldsEntities]) continue
    return ent
  }
  return null
}

function update() {
  const ent = findCommableEntity()
  if (ent !== connected.value) {
    connected.value = ent
    newCommEntity()
  }

  if (!ent)
    return

  const dist = Math.sqrt((ent.x - pos.value.x)**2 + (ent.y - pos.value.y)**2)
  inRange.value = dist < 128 * 6
}

watch(ents.value, update)
watch(pos.value, update)
onMounted(update)
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: calc(1vw * var(--vws));
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  column-gap: calc(0.5vw * var(--vws));
}

textarea {
  font-family: $font-major;
  font-size: calc(1vw * var(--vws));
  grid-column: 1 / span 5;
  height: fit-content;
  resize: none;
  pointer-events: none;
  cursor: default;
  outline: none;
  color: mix($color-beige, #000000, 30%);
  border: calc(.2vw * var(--vws)) solid currentColor;
  border-radius: calc(0.6vw * var(--vws));
  padding: calc(0.5vw * var(--vws));
  background-color: transparent;
}

button {
  font-family: $font-major;
  font-size: calc(1.3vw * var(--vws));
  margin: 0;
  padding: 0;
  line-height: 1em;
  color: mix($color-beige, #000000, 30%);
  border: calc(.35vw * var(--vws)) solid currentColor;
  background-color: transparent;
  border-radius: 100vw;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;

  &:hover {
    background-color: #00000011;
    border-color: #000000;
  }
}
</style>
