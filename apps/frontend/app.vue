<template>
  <div v-if="authorized === true" class="cockpit">
    <div class="radar">
      <PanelsRadar />
    </div>
    <div class="info">
      <PanelsInfo />
    </div>
    <div class="location">
      <PanelsLocation />
    </div>
    <div class="navigation">
      <PanelsNavigation />
    </div>
    <div class="tool">
      <!-- <PanelsTool /> -->
      <PanelsTest />
    </div>
  </div>
  <div v-else-if="authorized === false" class="auth">
    <img src="~/assets/img/moon.svg" alt="">
    <span>TO PREVENT ABUSE<br>PLEASE LOG IN</span>
    <UtilsLogin />
  </div>
  <div v-else class="loading">
    <img src="~/assets/img/moon.svg" alt="">
    <span>LOADING</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const api = useApi()

/** null = pending, true = authorized, false = unauthorized */
const authorized = useState<null | boolean>(() => null)

async function handleAuthCallback() {
  const provider = route.path.replace(/\/?callback\//i, '')
  const code = String(route.query.code)
  router.replace('/')
  const { status } = await api.makeAuthCallback(provider, code)
  authorized.value = (status >= 200 && status <= 300)
}

async function testAuth() {
  const { status } = await api.makeAuthProbe()
  authorized.value = (status >= 200 && status <= 300)
}

onMounted(() => {
  if (/^\/?callback\/\w+/i.test(route.path)) 
    handleAuthCallback()
  else
    testAuth()

  useEngine().init()
})

</script>

<style scoped lang="scss">
.cockpit, .auth, .loading {
  margin: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-color: $backpage;
  animation: fadein 1s ease forwards;
}

.cockpit {
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 2fr;
  grid-template-rows: 1fr auto;
  padding: $gap;
  gap: $gap;

  .radar {
    grid-column: 1 / span 3;
  }

  .info {
    grid-column: 4;
    grid-row: 1 / span 2;
  }

  .location, .navigation, .tool {
    aspect-ratio: 3/2;
  }

  & > * {
    border-radius: 2vw;
    overflow: hidden;
    background-color: #1f1b16;

    & > * {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}

.loading, .auth {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: calc($gap * 5);
  font-family: $font-major;
  color: $color-beige;
  text-align: center;
  
  img {
    width: 40pt;
  }
}

@keyframes fadein {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  background-color: $backpage;
}

p {
  font-family: $font-regular;
  font-size: 1vw;
  margin: 0;

  b {
    font-family: $font-major;
  }
}

:not([userselect]) {
  user-select: none;
}
</style>
