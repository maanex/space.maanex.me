<template>
  <div ref="outer" class="diamond">
    <div class="cross" />
    <div class="border" />
    <div
      class="handle"
      userselect
      :style="handleCss"
      :data-grabbed="moveHandle"
      :data-nograb="!moveHandle"
      @mousedown="moveHandle = true"
    />
  </div>
</template>

<script setup lang="ts">
const { uuid } = defineProps<{
  uuid: string
}>()

const outer = ref(null)
const { x, y } = useMouse()
const { pressed } = useMousePressed()

const handleX = useState(`diamondpicker-${uuid}-x`, () => 0)
const handleY = useState(`diamondpicker-${uuid}-y`, () => 0)
const moveHandle = useState(`diamondpicker-${uuid}-move`, () => false)

watch(pressed, (val) => { if (!val) moveHandle.value = false })

function handleMove() {
  if (!moveHandle.value) return
  const bounds = (outer.value! as Element)?.getBoundingClientRect()

  let xVal = (x.value - bounds.left) / bounds.width * 2 - 1
  let yVal = (y.value - bounds.top) / bounds.height * 2 - 1

  const len = Math.abs(xVal) + Math.abs(yVal)
  if (len > 1) {
    xVal /= len
    yVal /= len
  }

  handleX.value = xVal
  handleY.value = yVal
}
watch(x, handleMove)
watch(y, handleMove)

const handleCss = computed(() => ({ top: `${(handleY.value + 1) * 50}%`, left: `${(handleX.value + 1) * 50}%` }))
</script>

<style scoped lang="scss">
.diamond {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  .border {
    width: 70.71%;
    height: 70.71%;
    box-sizing: border-box;
    border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
    transform: rotate(45deg);
    border-radius: calc(.2vw * var(--vws));
  }

  .cross {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;

    &::before {
      content: '';
      position: absolute;
      top: calc(.3vw * var(--vws));
      left: calc(50% - .03vw * var(--vws));
      width: calc(.1vw * var(--vws));
      height: calc(100% - .6vw * var(--vws));
      background-color: mix($color-beige, #000000, 80%);
    }

    &::after {
      content: '';
      position: absolute;
      left: calc(.3vw * var(--vws));
      top: calc(50% - .03vw * var(--vws));
      height: calc(.1vw * var(--vws));
      width: calc(100% - .6vw * var(--vws));
      background-color: mix($color-beige, #000000, 80%);
    }
  }

  .handle {
    position: absolute;
    width: calc(1vw * var(--vws));
    height: calc(1vw * var(--vws));
    border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
    background-color: $color-beige;
    // background-color: lightblue;
    border-radius: calc(100vw * var(--vws));
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
