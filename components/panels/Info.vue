<template>
  <div class="container">
    <h2>Lexicon</h2>
    <div
      v-for="doc,i of documents"
      :key="i"
      :data-open="i === open"
      @click="(i === open) ? (open = -1) : (open = i)"
    >
      <span v-text="doc.title" />
      <p v-text="doc.text" />
    </div>
  </div>
</template>

<script setup lang="ts">
const open = useState(() => -1)

type Category = {
  title: string
  text: string
}

const documents: Category[] = [
  {
    title: 'How to game',
    text: 'Start gaming.'
  },
  {
    title: 'How to un-game',
    text: 'Do not ungame.\nSerious warning.'
  },
  {
    title: 'What are bananas',
    text: 'Bananas are long curved yellow objects commonly used to feed monkeys and monkey-like creatures such as bongumas. Bananas are not to be messed with as bananas have quite the tactical advantage with areal attacks ranging up to 15km in their prime age.'
  }
]
</script>

<style scoped lang="scss">
.container {
  background-color: #444444;
  color: #dddddd;
  padding: 1vw 0;

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
    border-left: 0px solid #777777;
    transition: border-width .1s ease;
    cursor: pointer;

    &:hover {
      border-left-width: .5vw !important;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #777777;
    }

    span {
      font-family: $font-major;
      font-size: 12pt;
      margin: 0;
    }

    p {
      font-size: 11pt;
    }

    &[data-open=true] {
      border-left-width: .2vw;
      animation: flash 1s ease-out forwards;
    }

    &:not([data-open=true]) p {
      display: none;
    }

    @keyframes flash {
      0% { background-color: #444444; }
      1% { background-color: #555555; }
      100% { background-color: #444444; }
    }
  }
}
</style>
