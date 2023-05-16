<template>
  <ElementsPanelswitcher
    v-if="showing !== 'none'"
    @click="dismount()"
  />

  <PanelsLocation v-if="showing === 'location'" />
  <PanelsNavigation v-else-if="showing === 'navigation'" />
  <PanelsTest v-else-if="showing === 'test1'" />
  <PanelsTool v-else-if="showing === 'test2'" />

  <div v-else class="select">
    <div class="buttons">
      <button
        v-for="p in availablePanels[browsingPage]"
        :key="p"
        @click="showing = p"
        :disabled="alreadyUsed.includes(p)"
        v-text="p"
      />
    </div>
    <div class="pages">
      <button
        v-for="page of availablePanels.length"
        :key="page"
        :data-active="browsingPage === page-1"
        @click="browsingPage = page-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { state } = defineProps<{
  state: 0 | 1 | 2
}>()

const availablePanels = [
  [ 'location' ],
  [ 'navigation' ],
  [ 'test1', 'test2' ]
] as const
type availablePanelsType = typeof availablePanels[number][number]

const defaultPages = [ 'location', 'navigation', 'test1' ] as const

const showing = useState<availablePanelsType | 'none'>(`universal-panel-${state}`, () => defaultPages[state])
const alreadyUsed = computed(() => {
  return [
    useState<availablePanelsType | 'none'>(`universal-panel-0`).value,
    useState<availablePanelsType | 'none'>(`universal-panel-1`).value,
    useState<availablePanelsType | 'none'>(`universal-panel-2`).value
  ].filter(val => val !== 'none')
})

function getPageFor(panel: availablePanelsType | 'none'): number {
  return availablePanels.findIndex((p: readonly string[]) => p.includes(panel))
}

const browsingPage = useState<number>(`universal-panel-browse-${state}`, () => state)

function dismount() {
  browsingPage.value = getPageFor(showing.value)
  showing.value = 'none'
}
</script>

<style scoped lang="scss">
.select {
  background-color: #444444;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;

  .pages {
    display: flex;
    justify-content: center;
    padding: .6vw;
    gap: .6vw;

    button {
      color: #ffffff;
      border: .2vw solid currentColor;
      background: none;
      width: 2vw;
      height: 1vw;
      padding: 0;
      margin: 0;
      display: block;
      outline: none;
      border-radius: 100vw;
      cursor: pointer;
      transition: color .1s ease-out;

      &[data-active=true] {
        background-color: currentColor;
        box-shadow: inset 0 0 0 .2vw #444444;
      }

      &:hover {
        color: lightblue;
      }
    }
  }
}
</style>

