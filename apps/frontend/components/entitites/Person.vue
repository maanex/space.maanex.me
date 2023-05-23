<template>
  <div class="user" :style="{ '--rot': `${rotation}deg` }">
    <div class="inner" />
    <div class="data">
      <span v-text="'0×' + sig" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: string
}>()
const rotation = computed(() => parseInt(props.data.split(' ').find(s => s[0] === 'r')?.substring(1) ?? '0'))
const sig = computed(() => props.data.split(' ').find(s => s[0] === 's')?.substring(1) ?? '0000')
</script>

<style scoped lang="scss">
.user {
  .inner {
    width: 1.5vw;
    height: 1.5vw;
    border-radius: 3vw;
    border-top-right-radius: 0.8vw;
    background-color: #fad70f;
    border: .2vw solid #ffffff;
    z-index: 20;
    position: relative;
    transform:
      translate(-50%, -50%)
      rotate(calc(var(--rot) - 45deg));
    animation: entin .3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .data { display: none; }

  &:hover .data {
    position: absolute;
    top: -1.5vw;
    left: -1.5vw;
    min-height: calc(100% + 1.5vw);
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

    :first-child {
      font-size: .8em;
      text-transform: uppercase;
      font-family: $font-header;
      background-color: #ffffff;
      width: fit-content;
      color: #000000dd;
      padding: .1vw .3vw;
      line-height: 1em;
    }
  }
}

@keyframes entin {
  0% { scale: .5; opacity: 0; }
  100% { scale: 1; opacity: 1; }
}
</style>
