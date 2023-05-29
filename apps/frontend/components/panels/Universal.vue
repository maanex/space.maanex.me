<template>
  <ElementsPanelswitcher
    v-if="showing !== 'none'"
    @click="dismount()"
  />

  <component
    v-if="renderPanel[showing]"
    :is="renderPanel[showing]"
  />

  <div v-else class="select">
    <div class="buttons">
      <button
        v-for="p in visiblePanels"
        :key="p"
        @click="showing = p"
        :disabled="alreadyUsed.includes(p)"
      >
        <span v-text="panelDisplayName[p]" />
      </button>
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
import PanelsLocation from './Location.vue'
import PanelsNavigation from './Navigation.vue'
import PanelsTest from './Test.vue'
import PanelsWriteSimple from './WriteSimple.vue'
import PanelsMineSimple from './MineSimple.vue'
import PanelsComs from './Coms.vue'
import LinePainter from './LinePainter.vue'
import { UserUnlocks } from '@maanex/spacelib-common'

const { state } = defineProps<{
  state: 0 | 1 | 2
}>()

const props = useProps()

const availablePanels = [
  [ 'location', 'test1' ],
  [ 'navigation' ],
  [ 'write-simple', 'mine-simple', 'coms', 'line-painter' ]
] as const
type availablePanelsType = typeof availablePanels[number][number]

const renderPanel: Record<availablePanelsType | 'none', any> = {
  'none': null,
  'location': PanelsLocation,
  'navigation': PanelsNavigation,
  'test1': PanelsTest,
  'write-simple': PanelsWriteSimple,
  'mine-simple': PanelsMineSimple,
  'coms': PanelsComs,
  'line-painter': LinePainter
}

const defaultPages = [ 'location', 'navigation', 'write-simple' ] as const

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

const visiblePanels = computed(() => {
  return (availablePanels[browsingPage.value] as readonly string[])
    .filter((p) => !(p in panelVisibilityRequirements) || props.value.unlocks.includes((panelVisibilityRequirements as any)[p])) as availablePanelsType[]
})

function dismount() {
  browsingPage.value = getPageFor(showing.value)
  showing.value = 'none'
}

const panelDisplayName: Record<availablePanelsType, string> = {
  'location': 'location',
  'navigation': 'navigation',
  'test1': 'debug',
  'write-simple': 'primitive engraver',
  'mine-simple': 'primitive harvester',
  'coms': 'comms terminal',
  'line-painter': 'line painter'
}

const panelVisibilityRequirements: Partial<Record<availablePanelsType, UserUnlocks>> = {
  'line-painter': UserUnlocks.LINE_PAINTER
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

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: calc(2vw * var(--vws));
    padding: calc(2vw * var(--vws));

    button {
      color: #ffffff;
      background-color: transparent;
      border: calc(.2vw * var(--vws)) solid currentColor;
      border-radius: calc(.2vw * var(--vws));
      border-top-right-radius: calc(1vw * var(--vws));
      border-bottom-left-radius: calc(1vw * var(--vws));
      display: flex;
      padding: calc(0.4vw * var(--vws));
      cursor: pointer;
      transition: color .1s ease-out;

      span {
        font-family: $font-major;
        font-size: calc(0.9vw * var(--vws));
        background-color: #ffffff;
        color: #000000ee;
        transition: background-color .1s ease-out;
        display: block;
        width: 100%;
        padding: calc(0.3vw * var(--vws)) calc(0.7vw * var(--vws));
        box-sizing: border-box;
        border-radius: calc(0.5vw * var(--vws));
        border-top-left-radius: 0;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;

        span {
          background-color: transparent;
          color: currentColor;
        }
      }

      &:not(:disabled):hover {
        color: lightblue;

        span { background-color: lightblue }
      }
    }
  }

  .pages {
    display: flex;
    justify-content: center;
    padding: calc(.6vw * var(--vws));
    gap: calc(.6vw * var(--vws));

    button {
      color: #ffffff;
      border: calc(.2vw * var(--vws)) solid currentColor;
      background: none;
      width: calc(2vw * var(--vws));
      height: calc(1vw * var(--vws));
      padding: 0;
      margin: 0;
      display: block;
      outline: none;
      border-radius: 100vw;
      cursor: pointer;
      transition: color .1s ease-out;

      &[data-active=true] {
        background-color: currentColor;
        box-shadow: inset 0 0 0 calc(.2vw * var(--vws)) #444444;
      }

      &:hover {
        color: lightblue;
      }
    }
  }
}
</style>

