<template>
  <div class="container">
    <p>Select color</p>
    <div class="buttons">
      <button
        v-for="color of available"
        :key="color"
        v-text="names[color]"
        @click="emit('picked', color)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@maanex/spacelib-common'

const { available } = defineProps<{
  available: Color[]
}>()

const emit = defineEmits([ 'picked' ])

const names: Record<Color, string> = {
  [ Color.RED ]: 'Red',
  [ Color.GREEN ]: 'Green',
  [ Color.BLUE ]: 'Blue',
  [ Color.YELLOW ]: 'Yellow',
  [ Color.BLACK ]: 'Black',
  [ Color.WHITE ]: 'White',
  [ Color.BROWN ]: 'Brown',
  [ Color.PINK ]: 'Pink',
  [ Color.ORANGE ]: 'Orange',
  [ Color.MINT ]: 'Mint',
}
</script>

<style scoped lang="scss">
.container {
  padding: calc(1.5vw * var(--vws));
  display: flex;
  flex-direction: column;
  gap: calc(1.5vw * var(--vws));
  
  p {
    font-family: $font-major;
    font-size: calc(1vw * var(--vws));
    color: mix($color-beige, #000000, 30%);
  }
}

.buttons {
  display: flex;
  gap: calc(1.5vw * var(--vws));
  flex-wrap: wrap;

  button {
    outline: none;
    color: mix($color-beige, #000000, 30%);
    border: calc(.2vw * var(--vws)) solid currentColor;
    padding: calc(0.7vw * var(--vws)) calc(1.5vw * var(--vws)) calc(0.7vw * var(--vws)) calc(1vw * var(--vws));
    background-color: #00000011;
    border-radius: calc(1.5vw * var(--vws));
    border-top-right-radius: calc(5vw * var(--vws));
    border-bottom-right-radius: calc(5vw * var(--vws));
    font-family: $font-major;
    font-size: calc(0.9vw * var(--vws));
    text-transform: uppercase;
    line-height: 1em;
    cursor: pointer;

    &:hover {
      color: #000000;
    }
  }
}
</style>
