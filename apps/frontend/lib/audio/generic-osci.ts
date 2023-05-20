import { SoundMachine } from "../../utils/audio-manager"


export function createGenericOsci(type: OscillatorType, opts?: { gain?: number, freq?: number, detune?: number }): SoundMachine {

  const audioContext = new AudioContext()
  let osciNode: OscillatorNode | undefined = undefined
  let gainNode: GainNode | undefined = undefined

  function stopNoise() {
    if (!osciNode) return
    osciNode.stop()
  }

  function setGain(volume: number, fadeMs: number) {
    if (fadeMs === 0)
      gainNode!.gain.value = volume
    else
      gainNode!.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeMs / 1000)
  }

  function setFrequency(freq: number, fadeMs: number) {
    if (fadeMs === 0)
      osciNode!.frequency.value = freq
    else
      osciNode!.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + fadeMs / 1000)
  }

  function setDetune(detune: number, fadeMs: number) {
    if (fadeMs === 0)
      osciNode!.detune.value = detune
    else
      osciNode!.detune.linearRampToValueAtTime(detune, audioContext.currentTime + fadeMs / 1000)
  }

  function playNoise() {
    osciNode = audioContext.createOscillator()
    gainNode = audioContext.createGain()
    osciNode.connect(gainNode)
    gainNode.connect(audioContext.destination)

    osciNode.type = type

    setGain(opts?.gain ?? 0, 0)
    if (opts?.freq) setFrequency(opts.freq, 0)
    if (opts?.detune) setDetune(opts.detune, 0)

    osciNode.start()
  }

  return {
    playNoise,
    stopNoise,
    setGain,
    setFrequency,
    setDetune
  }

}
