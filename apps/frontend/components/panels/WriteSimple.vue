<template>
  <div class="container">
    <div class="placer">
      <ElementsDiamondPicker uuid="writesimple-pos" />
    </div>
    <div class="text">
      <ElementsTextInput v-model="text">
        <span>Cost: {{ text.length ? cost : '-' }}</span>
      </ElementsTextInput>
    </div>
    <button @click="write()">
      Write
    </button>
  </div>
</template>

<script setup lang="ts">
const x = useState(`diamondpicker-writesimple-pos-x`, () => 0)
const y = useState(`diamondpicker-writesimple-pos-y`, () => 0)
const text = useState(`diamondpicker-writesimple-text`, () => '')

const entities = useWorldEntities()
const pos = usePosition()

const cost = computed(() => Math.ceil(text.value.length ** 1.5) + 20)

function write() {
  entities.value.push({
    id: ~~(Math.random() * 100000),
    x: ~~(pos.value.x + x.value * 100),
    y: ~~(pos.value.y + y.value * 100),
    type: 2,
    data: text.value
  })
  text.value = ''
  x.value = 0
  y.value = 0
}
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
