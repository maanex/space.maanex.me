<template>
  <div>
    <p>cool</p>
    <button @click="test">test</button>
    <hr>
    <p>Pos: (x {{ pos.x }}) (y {{ pos.y }})</p>
  </div>
</template>

<script setup lang="ts">
const docs = useDocuments()
const pos = usePosition()

function test() {
  docs.value.set('bananas', false)
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
