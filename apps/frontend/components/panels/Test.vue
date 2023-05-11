<template>
  <div>
    <p>cool</p>
    <button @click="test">test</button>
  </div>
</template>

<script setup lang="ts">
const docs = useDocuments()

function test() {
  docs.value.set('bananas', false)
}
</script>
