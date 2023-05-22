<template>
  <div class="textinput">
    <textarea 
      class="inner"
      userselect
      spellcheck="false"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as any)!.value)"
      v-bind="$attrs"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
const { modelValue } = defineProps<{
  modelValue: any
}>()
</script>

<style scoped lang="scss">
.textinput {
  position: relative;
  width: 100%;
  height: 100%;
  border: calc(.35vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  box-sizing: border-box;
  padding: calc(.2vw * var(--vws));
  border-radius: calc(.5vw * var(--vws));
  display: flex;
  flex-direction: column;
  gap: calc(.2vw * var(--vws));

  &:hover, &:focus-within {
    border-color: #000000;
  }
}

.inner {
  flex-grow: 1;
  border: calc(.15vw * var(--vws)) solid mix($color-beige, #000000, 30%);
  box-sizing: border-box;
  background-color: #00000011;
  cursor: text;
  outline: none;
  display: block;
  user-select: all;
  padding: calc(.8vw * var(--vws)) calc(1vw * var(--vws));
  font-size: calc(1.3vw * var(--vws));
  line-height: 1.2em;
  font-family: $font-major;
  color: mix($color-beige, #000000, 30%);
  overflow-y: scroll;

  &:hover, &:focus {
    border-color: #000000;
  }
}
</style>
