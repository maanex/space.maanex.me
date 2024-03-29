<template>
  <div class="container">
    <div class="pilotcontainer">
      <img ref="pilot" class="pilot" src="~/assets/img/pilot.svg" alt="" draggable="false">
      <div
        class="handle direction"
        userselect
        :style="handleDirectionCss"
        :data-grabbed="moveHandle === 'direction'"
        :data-nograb="!moveHandle"
        @mousedown="moveHandle = 'direction'"
      />
      <div
        class="handle accl"
        userselect
        :style="handleAcclCss"
        :data-grabbed="moveHandle === 'accl'"
        :data-nograb="!moveHandle"
        @mousedown="moveHandle = 'accl'"
      />
      <div
        class="handle scan"
        userselect
        :style="handleScanCss"
        :data-grabbed="moveHandle === 'scan'"
        :data-nograb="!moveHandle"
        @mousedown="moveHandle = 'scan'"
      />
      <ElementsAccelerometer />
    </div>
    <div ref="zoom" class="zoom">
      <div
        class="handle zoom"
        userselect
        :style="handleZoomCss"
        :data-grabbed="moveHandle === 'zoom'"
        :data-nograb="!moveHandle"
        @mousedown="moveHandle = 'zoom'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const pilot = ref(null)
const zoom = ref(null)
const { x, y } = useMouse()
const { pressed } = useMousePressed()
const { space } = useMagicKeys()

const moveHandle = useState<null | 'direction' | 'accl' | 'scan' | 'zoom'>(() => null)
watch(pressed, (val) => { if (!val) moveHandle.value = null })

const handleDirection = useDirectionHandle()
const handleDirectionCss = useState<any>(() => {})
function handleMoveDirection() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height / 2
  const midX = bounds.left + radius
  const midY = bounds.top + radius

  const deltaX = x.value - midX
  const deltaY = y.value - midY
  const rad = Math.atan2(deltaY, deltaX)
  const radDeg = ((rad / Math.PI * 180) + 450) % 360
  handleDirection.value = radDeg
}

const handleAccl = useAcclHandle()
const handleAcclCss = useState<any>(() => {})
function handleMoveAccl() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height * 0.4
  const midX = bounds.right - radius
  const midY = bounds.top + radius

  const deltaX = x.value - midX
  const deltaY = y.value - midY
  const rad = Math.atan2(deltaY, deltaX)
  const outVal = (rad < 0)
    ? (1 - (-rad / Math.PI))
    : (rad < Math.PI/2 ? 1 : 0)
  handleAccl.value = outVal

  keybindTriggered.value = false
}

const handleScan = useScanHandle()
const handleScanCss = useState<any>(() => {})
function handleMoveScan() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height * 0.4
  const midX = bounds.right - radius
  const midY = bounds.bottom - radius

  const deltaX = x.value - midX
  const deltaY = y.value - midY
  const rad = Math.atan2(deltaY, deltaX)
  const outVal = (rad > 0)
    ? (1 - (rad / Math.PI))
    : (rad < -Math.PI/2 ? 0 : 1)

  handleScan.value = outVal
}

const handleZoom = useZoomHandle()
const handleZoomCss = useState<any>(() => {})
function handleMoveZoom() {
  const bounds = (zoom.value! as Element)?.getBoundingClientRect()

  const raw = (x.value - bounds.left) / bounds.width
  const outVal = Math.min(Math.max(raw, 0), 1)

  handleZoom.value = outVal
}

function handleMove() {
  switch (moveHandle.value) {
    case null: return
    case 'direction': return handleMoveDirection()
    case 'accl': return handleMoveAccl()
    case 'scan': return handleMoveScan()
    case 'zoom': return handleMoveZoom()
  }
}
watch(x, handleMove)
watch(y, handleMove)

const keybindTimer = useState<any>(() => null)
const keybindTriggered = useState<boolean>(() => false)
function tickKeybind() {
  if (space.value && moveHandle.value === 'direction') {
    handleAccl.value += (1 - handleAccl.value) * 0.01
    if (!keybindTriggered.value) keybindTriggered.value = true
  } else if (!space.value && keybindTriggered.value) {
    handleAccl.value *= 0.98
    if (handleAccl.value < 0.01) {
      handleAccl.value = 0
      keybindTriggered.value = false
    }
  }
}

onMounted(() => {
  if (keybindTimer.value)
    clearInterval(keybindTimer.value)

  keybindTimer.value = setInterval(tickKeybind, 20)
})

onBeforeUnmount(() => {
  if (keybindTimer.value)
    clearInterval(keybindTimer.value)

  handleAccl.value = 0
})

function updateDirection() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height / 2

  const dirX = Math.cos((handleDirection.value - 90) / 180 * Math.PI) * radius * 0.96 + radius
  const dirY = Math.sin((handleDirection.value - 90) / 180 * Math.PI) * radius * 0.96 + radius

  handleDirectionCss.value = { top: `${dirY}px`, left: `${dirX}px` }
}

function updateAccl() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height * 0.4
  const midX = bounds.width - radius
  const midY = radius
  const dirX = Math.cos((handleAccl.value - 1) * Math.PI) * radius * 0.96 + midX
  const dirY = Math.sin((handleAccl.value - 1) * Math.PI) * radius * 0.96 + midY

  handleAcclCss.value = { top: `${dirY}px`, left: `${dirX}px` }
}

function updateScan() {
  const bounds = (pilot.value! as Element)?.getBoundingClientRect()
  const radius = bounds.height * 0.4
  const midX = bounds.width - radius
  const midY = bounds.height - radius
  const dirX = Math.cos((handleScan.value - 1) * Math.PI) * radius * 0.96 + midX
  const dirY = midY - Math.sin((handleScan.value - 1) * Math.PI) * radius * 0.96

  handleScanCss.value = { top: `${dirY}px`, left: `${dirX}px` }
}

function updateZoom() {
  const bounds = (zoom.value! as Element)?.getBoundingClientRect()
  const xval = handleZoom.value * bounds.width

  handleZoomCss.value = { top: '50%', left: `${xval}px` }
}

function updateAll() {
  updateDirection()
  updateAccl()
  updateScan()
  updateZoom()
}

onMounted(updateAll)
useResizeObserver(pilot, updateAll)
watch(handleDirection, updateDirection)
watch(handleAccl, updateAccl)
watch(handleScan, updateScan)
watch(handleZoom, updateZoom)
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  height: 100%;
  box-sizing: border-box;
  padding: calc($gap * 2 * var(--vws));
  display: flex;
  flex-direction: column;
  position: relative;

  .pilotcontainer {
    position: relative;
  }

  .pilot {
    width: 100%;
    aspect-ratio: 100/50;
    opacity: .7;
  }

  .accelerometer {
    position: absolute;
    top: 50%;
    left: 25%;
  }

  .zoom {
    position: absolute;
    right: calc(($gap * 2 + .5vw) * var(--vws));
    bottom: calc(($gap * 2 + .5vw) * var(--vws));
    width: 80%;
    height: calc(.35vw * var(--vws));
    background-color: mix($color-beige, #000000, 30%);
    border-radius: 100vw;
  }

  .handle {
    position: absolute;
    width: calc(1vw * var(--vws));
    height: calc(1vw * var(--vws));
    border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
    background-color: $color-beige;
    // background-color: lightblue;
    border-radius: 100vw;
    transform: translate(-50%, -50%);

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
}
</style>
