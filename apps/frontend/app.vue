<template>
  <div v-if="authorized === true && !acc?.tos" class="tosscreen">
    <img src="~/assets/img/moon.svg" alt="">
    <span>TO ENJOY SPACE.MAANEX.ME PLEASE AGREE TO THE FOLLOWING TERMS OF SERVICE:</span>
    <span>YOU AGREE THAT YOU WILL BE EXPOSED TO USER CREATED CONTENT. WHILE WE REMOVE ALL INAPPROPRIATE CONTENT AS SOON AS POSSIBLE, NO FILTER IS PERFECT AND YOU MIGHT BE TEMPORARILY EXPOSED TO OFFENSIVE OR OTHERWISE INAPPROPRIATE CONTENT. THE OPERATORS OF THIS WEBSITE CANNOT BE HELD RESPONSIBLE FOR ANY USER GENERATED CONTENT SHOWN OR ANY HARM INDUCED BY VIEWING SAID USER GENERATED CONTENT. IF YOU FIND CONTENT THAT DOES NOT OBEY THESE TERMS YOU ARE OBLIGATED TO REPORT IT IMMEDIATELY.</span>
    <span>YOU AGREE THAT ANY CONTENT YOU CREATE AND SUBMIT IS LEGAL UNDER EUROPEAN AND LOCAL LAW, DOES NOT INCLUDE ANY HATE SPEECH, DOES NOT INCLUDE PERSONAL INFORMATION OF ANY KIND, AND IS NOT OTHERWISE UNSAFE OR INAPPROPRIATE.</span>
    <span>YOU AGREE THAT WHILE YOUR IDENTITY IS ANNONYMOUS TO OTHER USERS ON THIS WEBSITE, THE ADMINISTRATORS ARE ABLE TO TRACE BACK ANY VIOLATIONS AND WILL TAKE ACTION AGAINST ANY INDIVIDUAL VIOLATING THESE TERMS AND CONDITIONS.</span>
    <span>YOU AGREE THAT WE STORE COOKIES AND OTHER SESSION DATA ON YOUR DEVICE TO DELIVER YOU THIS EXPERIENCE. WE ALSO STORE INFORMATION ABOUT YOU ON OUR SERVERS TO PROVIDE THIS SERVICE, INCLUDING YOUR LOGIN INFORMATION, IP ADDRESS, AND ACTIONS TAKEN THROUGH YOUR ACCOUNT. THIS DATA IS ONLY STORED FOR AS LONG AS NEEDED TO PROVIDE THE SERVICE AND ENFORCE THESE TERMS AND CONDITIONS. NO USER DATA IS EVER SOLD OR SHARED WITH THIRD PARTIES OR USED FOR ADVERTISEMENT OR PROFILING. IF YOU WOULD LIKE TO GET YOUR DATA REMOVED CONTACT THE ADMINISTRATORS AT space@maanex.me</span>
    <span>BY PRESSING CONFIRM YOU AGREE TO BE BOUND BY ALL THE TERMS LISTED ABOVE AND YOU CONFIRM ARE OVER THE AGE OF 18.</span>
    <button @click="acceptTos()">CONFIRM AND CONTINUE</button>
  </div>
  <div
    v-else-if="authorized === true"
    class="cockpit"
    :style="{
      gridTemplateColumns: `1fr 1fr 1fr ${sidebarWidth * 100}vw`,
      '--vws': (1 - sidebarWidth)
    }"
  >
    <div class="radar" ref="radarEl">
      <PanelsRadar />
    </div>
    <div class="info" ref="infoEl" :data-resizing="sidebarDragged">
      <PanelsInfo />
    </div>
    <div class="tool">
      <PanelsUniversal :state="0" />
    </div>
    <div class="tool">
      <PanelsUniversal :state="1" />
    </div>
    <div class="tool">
      <PanelsUniversal :state="2" />
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
  <div class="desktoponly">
    <img src="~/assets/img/moon.svg" alt="">
    <span>SORRY BUT THIS IS A DESKTOP ONLY EXPERIENCE<br><br>PLEASE OPEN THIS PAGE ON A LARGER DEVICE LIKE A LAPTOP OR TABLET</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const api = useApi()
const audioManager = useAudioManager()
const acc = useAccount()

const sidebarWidth = useState(() => 0.18)
const sidebarDragged = useState(() => false)
const { x } = useMouse()

const radarEl = ref(null)
const infoEl = ref(null)

const { pressed } = useMousePressed()
let firstClickDone = false
watch(pressed, (val) => {
  if (val && !firstClickDone)
    onFirstClick()

  if (val) {
    const radarBounds = (radarEl.value! as Element)?.getBoundingClientRect()
    const infoBounds = (infoEl.value! as Element)?.getBoundingClientRect()
    if (x.value >= radarBounds.right && x.value <= infoBounds.left)
      sidebarDragged.value = true
  } else if (sidebarDragged.value) {
    sidebarDragged.value = false
  }
})
watch(x, (val) => {
  const gap = 0.006 * window.innerWidth
  if (sidebarDragged.value)
    sidebarWidth.value = Math.min(0.5, Math.max(0.1, 1 - ((val + gap) / (window.innerWidth - 1*gap))))
})

/** null = pending, true = authorized, false = unauthorized */
const authorized = useState<null | boolean>(() => null)

async function handleAuthCallback() {
  const provider = route.path.replace(/\/?callback\//i, '')
  const code = String(route.query.code)
  router.replace('/')
  const { status } = await api.makeAuthCallback(provider, code)
  authorized.value = (status >= 200 && status <= 300)
  onAuthCompleted(authorized.value)
}

async function testAuth() {
  const { status } = await api.makeAuthProbe()
  authorized.value = (status >= 200 && status <= 300)
  onAuthCompleted(authorized.value)
}

function onAuthCompleted(success: boolean) {
  if (!success) return
  useSocket().connect()
  if (firstClickDone)
    audioManager.init()
}

function onFirstClick() {
  firstClickDone = true
  if (authorized.value)
    audioManager.init()
}

function acceptTos() {
  api.acceptTos()
}

onMounted(() => {
  if (/^\/?callback\/\w+/i.test(route.path)) 
    handleAuthCallback()
  else
    testAuth()

  useEngine().init()
})

onBeforeUnmount(() => {
  useSocket().disconnect()
  audioManager.destruct()
})

</script>

<style scoped lang="scss">
.cockpit, .auth, .loading, .tosscreen {
  margin: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-color: $backpage;
  animation: fadein 1s ease forwards;
}

.cockpit {
  display: grid;
  // grid-template-columns: 3fr 3fr 3fr 2fr;
  grid-template-rows: 1fr auto;
  padding: $gap;
  gap: $gap;

  .radar {
    grid-column: 1 / span 3;
  }

  .info {
    grid-column: 4;
    grid-row: 1 / span 2;
    position: relative;
    overflow: visible;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -$gap;
      height: 100%;
      width: $gap;
      z-index: 99;
      cursor: ew-resize;
    }

    &::after {
      content: '';
      position: absolute;
      top: calc(50% - 4vh);
      left: calc($gap/-2 - .08vw);
      height: 8vh;
      width: .16vw;
      background-color: #ffffff88;
      border-radius: 100vw;
    }

    &[data-resizing=true]::after { background-color: #ffffff; }
  }

  .tool {
    aspect-ratio: 3/2;
    position: relative;
  }

  & > * {
    border-radius: 1.2vw;
    overflow: hidden;
    background-color: #1f1b16;

    & > * {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}

.loading, .auth, .desktoponly, .tosscreen {
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

.tosscreen {
  gap: $gap;
  // overflow-y: scroll;
  height: auto;
  min-height: 100vh;
  padding: 100pt 0;

  img {
    margin-bottom: calc($gap * 4);
  }

  span {
    width: 80%;
    max-width: 350pt;
    font-size: 10pt;
  }

  button {
    background-color: $color-beige;
    color: #000000dd;
    padding: 10pt 16pt;
    gap: 16pt;
    margin-top: calc($gap * 4);
    border-radius: 4pt;
    font-size: 11pt;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: opacity .1s ease;
    border: none;
    outline: none;
    font-family: $font-regular;

    &:hover {
      opacity: .8;
    }
  }
}

.desktoponly {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $backpage;
  z-index: 999;
  pointer-events: all;

  span {
    width: 80%;
    max-width: 350pt;
  }

  @media screen and (min-width: 100vh) {
    display: none;
    width: 0;
    height: 0;
    pointer-events: none;
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
