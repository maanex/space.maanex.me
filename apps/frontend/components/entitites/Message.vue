<template>
  <div class="message">
    <div class="inner" :style="`--c1:var(--col-${color});--c0:var(--col-${color}0)`" />
    <div class="data">
      <span v-text="'0×' + sig" />
      <pre v-text="mes" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps<{
  data: string
}>()

const sig = computed(() => data.slice(0, 4))
const color = computed(() => data.charAt(4))
const mes = computed(() => data.slice(5))
</script>

<style scoped lang="scss">
.message {
  .inner {
    width: 1vw;
    height: 1vw;
    background-color: #169b64;
    border: .2vw solid #ffffff;
    transform: rotate(45deg);
    border-radius: .3vw;
    z-index: 20;
    position: relative;
    animation: entin .7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .data { display: none; }

  &:hover .data {
    position: absolute;
    top: -1vw;
    left: -1vw;
    min-height: calc(100% + 2vw);
    padding: 1vw 1vw 1vw calc(100% + 2vw);
    display: flex;
    flex-direction: column;
    background-color: #00000044;
    border-radius: 0.5vw;
    color: #ffffff;
    width: max-content;
    max-width: 30vw;
    font-family: $font-regular;
    font-size: 1vw;
    line-height: 1.2vw;
    backdrop-filter: blur(0.7vw);
    box-sizing: border-box;
    gap: .5vw;

    span {
      font-size: .8em;
      text-transform: uppercase;
      font-family: $font-header;
      background-color: #ffffff;
      width: fit-content;
      color: #000000dd;
      padding: .1vw .3vw;
      line-height: 1em;
    }

    pre {
      line-height: 1em;
      margin: 0;
      padding: 0;
      white-space: pre-wrap;
      width: 100%;
    }
  }
}

@keyframes entin {
  0% { transform: rotate(0deg); height: 0; border-width: 1px; background-color: var(--c0); border-radius: 0; opacity: 0.4; }
  50% { transform: rotate(0deg); height: 1vw; border-width: 1px; background-color: var(--c0); border-radius: 0; opacity: 1; }
  100% { transform: rotate(45deg); height: 1vw; border-width: .2vw; background-color: var(--c1); border-radius: .3vw; opacity: 1; }
}
</style>
