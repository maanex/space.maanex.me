<template>
  <div class="other">
    <div v-if="id === WorldsEntities.MERCHANT_WESTSIDE_OUTPOST" class="westside" />
    <div v-else-if="id === WorldsEntities.MERCHANT_EASTSIDE_OUTPOST" class="eastside" />
    <div v-else-if="id === WorldsEntities.MERCHANT_BELOR_TOOLS" class="belortools" />
  </div>
</template>

<script setup lang="ts">
import { WorldsEntities } from '@maanex/spacelib-common'

const { id, data } = defineProps<{
  id: number,
  data: string
}>()
</script>

<style scoped lang="scss">
.other {
  opacity: 0;
  animation: entin 4s ease forwards;
}

@keyframes entin {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

//

.westside, .eastside {
  background-image: url('~/assets/img/outpost.svg');
  width: calc(200vw * var(--vws));
  height: calc(200vw * var(--vws));
  animation: rotate 300s linear infinite;
}

.belortools {
  background-image: url('~/assets/img/belortools.svg');
  width: calc(40vw * var(--vws));
  height: calc(40vw * var(--vws));
  transform: rotate(145deg);
}
</style>