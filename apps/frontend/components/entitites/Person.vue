<template>
  <div class="user" :style="{ '--rot': `${rotation}deg` }">
    <div class="inner" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: string
}>()
const rotation = computed(() => parseInt(props.data.split(' ').find(s => s[0] === 'r')?.substring(1) ?? '0'))
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
    transform:
      translate(-50%, -50%)
      rotate(calc(var(--rot) - 45deg));
    animation: entin .3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
}

@keyframes entin {
  0% { scale: .5; opacity: 0; }
  100% { scale: 1; opacity: 1; }
}
</style>
