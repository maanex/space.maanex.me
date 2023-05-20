<template>
  <div class="container">
    <!-- <h2>Lexicon</h2> -->
    <h2>Journal</h2>
    <div
      v-for="doc,i of visibleDocs"
      :key="i"
      :data-open="i === open"
      @click="clicked(i)"
    >
      <span :data-read="doc.read" v-text="doc.title" />
      <p v-text="doc.text" />
    </div>
    <div
      :data-open="-2 === open"
      :key="-2"
      @click="clicked(-2)"
    >
      <span :data-read="true">My Account</span>
      <p>Logged in as <b v-text="account?.name" /></p>
      <p class="logout" @click="logout()">Click here to log out</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const open = useState(() => -1)
const account = useAccount()

const docs = useDocuments()
const docData = useDocumentData()
const storage = useStorage<any>('documents', [ ['intro', false] ])

watch(docs, (val) => (storage.value = [...val.entries()]), { deep: true })
onMounted(() => docs.value = new Map(storage.value))

function clicked(index: number) {
  if (index === open.value) open.value = -1
  else open.value = index

  if (index < 0) return
  const key = visibleDocs.value[index].key
  if (!docs.value.get(key))
    docs.value.set(key, true)
}

const visibleDocs = computed(() => docData.value
  .filter(d => docs.value.has(d.key))
  .map(d => ({ ...d, read: !!docs.value.get(d.key) }))
)

function logout() {
  localStorage.removeItem('token')
  window.location.reload()
}
</script>

<style scoped lang="scss">
.container {
  background-color: $color-beige;
  background-image: url('~/assets/img/noise-10p.png');
  animation: bg-jitter 1s steps(1) forwards infinite;
  // background-color: #444444;
  color: #000000;
  padding: 1vw 0;

  & > * {
    opacity: .7;
  }

  h2 {
    font-family: $font-major;
    font-size: 1.2vw;
    margin: 0;
    width: 100%;
    text-align: center;
    margin-bottom: 1vw;
  }
  
  & > div {
    padding: .5vw 1vw;
    padding-right: 1vw;
    border-left: 0px solid #000000;
    box-sizing: border-box;
    cursor: pointer;
    transition:
      border-width .1s ease,
      padding-right .1s ease;

    &:hover {
      border-left-width: .5vw !important;
      padding-right: .5vw;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #000000;
    }

    span {
      font-family: $font-major;
      font-size: 12pt;
      margin: 0;

      &::before {
        content: 'NEW';
        display: inline-block;
        background-color: #000000;
        color: $color-beige;
        padding: 0 5pt;
        border-radius: 3pt;
        font-size: 10pt;
        margin-right: 10pt;
        transition: all .2s ease;
      }

      &[data-read=true]::before {
        width: 0px;
        margin-right: 0px;
        padding: 0px;
        opacity: 0;
        color: #000000;
        border-radius: 0;
      }
    }

    p {
      font-size: 11pt;
    }

    &[data-open=true] {
      border-left-width: .2vw;
      animation: flash 1s ease-out forwards;
    }

    &:not([data-open=true]) *:not(span) {
      display: none;
    }

    .logout {
      text-decoration: underline;
      width: fit-content;

      &:hover {
        background-color: #00000033;
      }
    }

    @keyframes flash {
      0% { background-color: #00000000; }
      1% { background-color: #00000033; }
      100% { background-color: #00000000; }
    }
  }
}
</style>
