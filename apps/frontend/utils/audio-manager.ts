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

type SoundSources = 'whiteNoise' | 'engineWum1' | 'engineWum2' | 'engineFarts' | 'test'

let initialized = false

const sounds: Record<SoundSources, SoundMachine | null> = {
  whiteNoise: null,
  engineWum1: null,
  engineWum2: null,
  engineFarts: null,
  test: null,
}

export const useAudioManager = () => {
  const timer = useState<any>('audioTickTimer', () => null)
  const globalVolume = useState<number>('globalVolume', () => 0.3)

  function init() {
    if (!('AudioContext' in window)) return
    if (initialized) return
    initialized = true

    sounds.whiteNoise = createWhiteNoise()
    sounds.engineWum1 = createGenericOsci('sine')
    sounds.engineWum2 = createGenericOsci('triangle', { detune: -1200 })
    sounds.engineFarts = createGenericOsci('sawtooth', { detune: -2300 })
    sounds.test = createGenericOsci('triangle', { detune: -1200 })
    
    for (const sound of Object.values(sounds))
      sound?.playNoise()

    if (timer.value)
      clearInterval(timer.value)

    timer.value = setInterval(tick, 50)
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
  
  function tick() {
    const acclHandle = useAcclHandle().value
    const veloVal = useAcceleration().value
    const velo = Math.sqrt(veloVal.x ** 2 + veloVal.y ** 2)
    const maxVelo = Const.baseSpeed / (1 - Const.baseFriction)
    const veloPercent = velo / maxVelo
    const extraAccl = (acclHandle > veloPercent) ? (acclHandle - veloPercent) : 0

    const maxVol = globalVolume.value
    if (!sounds.whiteNoise || !sounds.engineWum1 || !sounds.engineWum2 || !sounds.engineFarts) return

    // sounds.whiteNoise.setGain(0.03 * maxVol, 0)

    // TODO: maybe add zoom as well? closer = more engine sounds, further = more ambiance

    sounds.engineWum1.setGain(veloPercent * maxVol, 50)
    sounds.engineWum1.setDetune(-2500 + veloPercent * 700, 50)
    sounds.engineWum2.setGain(veloPercent * maxVol * 1.5, 50)
    sounds.engineWum2.setFrequency(70 + ~~(Math.random() * 20), 50)

    // sounds.engineFarts.setGain(Math.min(extraAccl * 20, 0.6) * maxVol, 0)
    // sounds.engineFarts.setFrequency(~~(extraAccl**2 * 520 * (Math.random() * .4 + .6)) + 1, 50)

    // sounds.test!.setFrequency(70 + ~~(Math.random() * 20), 50)
  }

  // 

  return {
    init,
    destruct,
    tick
  }
}
