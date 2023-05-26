<template>
  <div class="miner">
    <div class="center" />
    <div ref="slider" class="slider">
      <div
        v-for="stuff of stuffs"
        :key="~~(stuff[0] * 9999999)"
        class="stuff"
        :data-hit="stuff[2]"
        :data-x="stuffRelXtoRealX(stuff[1])"
        :style="{
          '--ypos': stuff[0],
          left: (stuffRelXtoRealX(stuff[1]) * 100) + '%'
        }"
      />
      <div
        class="handle"
        userselect
        :style="handleCss"
        :data-grabbed="moveHandle"
        :data-nograb="!moveHandle"
        :data-active="active"
        @mousedown="moveHandle = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  uuid: string
  active: boolean
  // modelValue: any
}>()
const { uuid } = props

const emit = defineEmits([ 'mine' ])

const slider = ref(null)
const { y } = useMouse()
const { pressed } = useMousePressed()

const handleY = useState(`miner-${uuid}-y`, () => 0.5)
const moveHandle = useState(`miner-${uuid}-move`, () => false)

watch(pressed, (val) => { if (!val) moveHandle.value = false })

function stuffRelXtoRealX(rel: number) {
  return (rel < 0 ? (rel + 1) : (rel)) * 1.2 - .1
}

function handleMove() {
  if (!moveHandle.value) return
  const bounds = (slider.value! as Element)?.getBoundingClientRect()

  let yVal = (y.value - bounds.top) / bounds.height
  if (yVal > 1) yVal = 1
  else if (yVal < 0) yVal = 0

  handleY.value = yVal
}
watch(y, handleMove)

/** [ y pos, x progression (- is from left, + is from right), hit or no (0 is no hit) ] */
const stuffs = useState<[ number, number, boolean ][]>(() => [])

function tickSpawnStuff() {
  if (Math.random() >= .4) return
  stuffs.value.push([
    Math.random(),
    Math.random() < .5 ? -1 : 1,
    false
  ])
}

function tickMoveStuff() {
  const vws = Number(getComputedStyle(slider.value!).getPropertyValue('--vws'))
  const bounds = (slider.value! as Element)?.getBoundingClientRect()
  const handleRad = window.innerWidth * 0.015 * vws
  const handleYpos = handleY.value * bounds.height
  const handleXpos = bounds.width / 2

  for (const stuff of stuffs.value) {
    if (stuff[1] > 0)
      stuff[1] -= 0.03
    else
      stuff[1] += 0.03

    if (stuff[2]) continue // already hit

    const dist = Math.sqrt(
      (stuffRelXtoRealX(stuff[1])*bounds.width - handleXpos)**2
      + (stuff[0]*bounds.height - handleYpos)**2
    )

    if (dist > handleRad)
      continue
    
    stuff[2] = true
    const mined = ~~(Math.random() * 4 + 2)
    emit('mine', mined)
  }

  stuffs.value = stuffs.value.filter(stuff => Math.abs(stuff[1]) >= 0.03)
}

const spawnerTimer = useState<any>(`miner-${uuid}-timer1`, () => null)
const moverTimer = useState<any>(`miner-${uuid}-timer2`, () => null)

function checkSpawnerTimer() {
  if (props.active && !spawnerTimer.value) {
    spawnerTimer.value = setInterval(tickSpawnStuff, 500)
  } else if (!props.active && spawnerTimer.value) {
    clearInterval(spawnerTimer.value)
    spawnerTimer.value = null
  }
}
watch(props, checkSpawnerTimer)
onMounted(() => {
  checkSpawnerTimer()
  moverTimer.value = setInterval(tickMoveStuff, 50)
})
onBeforeUnmount(() => {
  if (spawnerTimer.value) {
    clearInterval(spawnerTimer.value)
    spawnerTimer.value = null
  }
  if (moverTimer.value) {
    clearInterval(moverTimer.value)
    moverTimer.value = null
  }
})

const handleCss = computed(() => ({ top: `${handleY.value * 100}%` }))
</script>

<style scoped lang="scss">
.miner {
  position: relative;
  width: 100%;
  height: 100%;
  border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  box-sizing: border-box;
  padding: calc(.2vw * var(--vws));
  border-radius: 100vw;
  overflow: hidden;
}

.center {
  position: absolute;
  top: 0;
  left: calc(50% - .03vw * var(--vws));
  width: calc(.1vw * var(--vws));
  height: 100%;
  background-color: mix($color-beige, #000000, 80%);
}

.slider {
  position: absolute;
  width: 100%;
  height: calc(100% - 3vw * var(--vws));
  top: 0;
  left: 0;
  margin: calc(1.5vw * var(--vws)) 0;
  box-sizing: border-box;
}

.handle {
  position: absolute;
  left: 50%;
  width: calc(3vw * var(--vws));
  height: calc(3vw * var(--vws));
  box-sizing: border-box;
  border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  // background-color: lightblue;
  border-radius: calc(100vw * var(--vws));
  transform: translate(-50%, -50%);
  transition:
    width .15s ease-out,
    border-width .2s ease-in;

  &[data-active=false] {
    width: 0;
    border-width: 0;
    pointer-events: none;
  }

  &[data-nograb=true] {
    cursor: grab;
  }

  &[data-grabbed=true] {
    cursor: grabbing;
  }

  &[data-nograb=true]:hover, &[data-grabbed=true] {
    border-color: #000000;
  }

  &::after {
    content: '';
    width: 300%;
    height: 300%;
    top: -100%;
    left: -100%;
    display: block;
    position: absolute;
    border-radius: 100vw;
  }

  &[data-grabbed=true]::after {
    cursor: grabbing;
    z-index: 999;
    width: 300vw;
    height: 300vh;
    top: -100vw;
    left: -100vh;
  }
}

.stuff {
  position: absolute;
  width: calc(1vw * var(--vws));
  height: calc(1vw * var(--vws));
  top: calc(1.5vw * var(--vws) + var(--ypos) * (100% - 3vw * var(--vws)));
  transform: translate(-50%, -50%);
  background-color: mix($color-beige, #000000, 30%);
  border-radius: 100vw;
  transition:
    width .2s ease-in,
    height .2s ease-in;

  &[data-hit=true] {
    width: 0;
    height: calc(2vw * var(--vws));
  }
}
</style>
