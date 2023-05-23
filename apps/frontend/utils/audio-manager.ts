import { Const } from "@maanex/spacelib-common"
import { createGenericOsci } from "../lib/audio/generic-osci"
import { createWhiteNoise } from "../lib/audio/white-noise"


export type SoundMachine = {
  playNoise: () => any
  stopNoise: () => any
  setGain: (volume: number, fadeMs: number) => any
  setFrequency: (freq: number, fadeMs: number) => any
  setDetune: (detune: number, fadeMs: number) => any
}

type SoundSources = 'whiteNoise' | 'engineWum1' | 'engineWum2' | 'engineFarts' | 'radiation' | 'test'

let initialized = false

const sounds: Record<SoundSources, SoundMachine | null> = {
  whiteNoise: null,
  engineWum1: null,
  engineWum2: null,
  engineFarts: null,
  radiation: null,
  test: null,
}

export const useAudioManager = () => {
  const timer = useState<any>('audioTickTimer', () => null)
  const globalVolume = useState<number>('globalVolume', () => 1)

  function init() {
    if (!('AudioContext' in window)) return
    if (initialized) return
    initialized = true

    sounds.whiteNoise = createWhiteNoise()
    sounds.engineWum1 = createGenericOsci('sine')
    sounds.engineWum2 = createGenericOsci('triangle', { detune: -1200 })
    sounds.engineFarts = createGenericOsci('sawtooth', { detune: -2300 })
    sounds.radiation = createGenericOsci('sawtooth', { detune: -800 })
    sounds.test = createGenericOsci('sawtooth', { detune: -1200 })
    
    for (const sound of Object.values(sounds))
      sound?.playNoise()

    if (timer.value)
      clearInterval(timer.value)

    let numb = 0
    timer.value = setInterval(() => {
      if (++numb > 100)
        numb = 0
      tick(numb)
    }, 50)
  }

  function destruct() {
    if (!('AudioContext' in window)) return
    if (!initialized) return
    initialized = false

    if (timer.value)
      clearInterval(timer.value)

    for (const key of Object.keys(sounds) as SoundSources[]) {
      sounds[key]?.stopNoise()
      sounds[key] = null
    }
  }
  
  function tick(id: number) {
    const acclHandle = useAcclHandle().value
    const veloVal = useAcceleration().value
    const zoom = useZoomHandle().value
    const radiation = useRadiation().value
    const velo = Math.sqrt(veloVal.x ** 2 + veloVal.y ** 2)
    const maxVelo = Const.baseSpeed / (1 - Const.baseFriction)
    const veloPercent = velo / maxVelo
    const extraAccl = (acclHandle > veloPercent) ? (acclHandle - veloPercent) : 0
    
    const maxVol = globalVolume.value
    if (!sounds.whiteNoise || !sounds.engineWum1 || !sounds.engineWum2 || !sounds.engineFarts || !sounds.radiation) return

    sounds.whiteNoise.setGain(0.02 * maxVol * (veloPercent * .8 + .2) * zoom * (Math.sin(id/25*Math.PI) + 4)/6, 0)

    sounds.engineWum1.setGain(veloPercent * maxVol * 0.7 * (1 - zoom), 50)
    sounds.engineWum1.setDetune(-2500 + veloPercent * 700, 50)
    sounds.engineWum2.setGain(veloPercent * maxVol * (1 - zoom), 50)
    sounds.engineWum2.setFrequency(70 + ~~(Math.random() * 20), 50)

    // sounds.engineFarts.setGain((Math.min(extraAccl * 20, 0.5) * maxVol + 0.2) * (1 - zoom), 0)
    // sounds.engineFarts.setFrequency(~~(extraAccl**2 * 150 * (Math.random() * .4 + .6)) + 1 + (Math.random() * 10), 50)

    sounds.radiation.setGain(maxVol * (1 - zoom/3*2), 0)
    sounds.radiation.setFrequency(radiation * 200 * (Math.random() * 0.6 + 0.6), 50)

    // sounds.test!.setGain(maxVol, 0)
    // sounds.test!.setDetune(1200, 0)
    // sounds.test!.setFrequency(Math.random() * 50 * useScanHandle().value, 50)
  }

  // 

  return {
    init,
    destruct,
    tick
  }
}
