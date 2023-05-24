<template>
  <div>
    <p>cool</p>
    <button @click="test">test</button>
    <hr>
    <p>Pos: (x {{ ~~pos.x }}) (y {{ ~~pos.y }})</p>
    <hr>
    <button @click="decon">debug decon</button>
    <hr>
    <p>{{ props }}</p>
    <hr>
  </div>
</template>

<script setup lang="ts">
const docs = useDocuments()
const pos = usePosition()
const props = useProps()

function test() {
  docs.value.set('bananas', false)
}

function decon() {
  useSocket().debugDisconnect()
}
</script>

<style scoped lang="scss">
div {
  padding: 20pt;
}

p {
  color: #ffffff;
}
</style>
