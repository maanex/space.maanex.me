<template>
  <div class="textinput">
    <textbox
      class="inner"
      userselect
      contenteditable="true"
      spellcheck="false"
      @input="$emit('update:modelValue', ($event.target as any)!.innerText)"
      v-bind="$attrs"
      v-text="modelValue"
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
  border: .35vw solid mix($color-beige, #000000, 30%);
  box-sizing: border-box;
  padding: .2vw;
  border-radius: .5vw;
  display: flex;
  flex-direction: column;
  gap: .2vw;

  &:hover, &:focus-within {
    border-color: #000000;
  }
}

.inner {
  flex-grow: 1;
  border: .15vw solid mix($color-beige, #000000, 30%);
  box-sizing: border-box;
  background-color: #00000011;
  cursor: text;
  outline: none;
  display: block;
  user-select: all;
  padding: 0.8vw 1vw;
  font-size: 1.3vw;
  line-height: 1.2em;
  font-family: $font-major;
  color: mix($color-beige, #000000, 30%);
  overflow-y: scroll;

  &:hover, &:focus {
    border-color: #000000;
  }
}
</style>
