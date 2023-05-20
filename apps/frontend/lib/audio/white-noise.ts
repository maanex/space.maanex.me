import { SoundMachine } from "../../utils/audio-manager"


export function createWhiteNoise(): SoundMachine {

  const audioContext = new AudioContext()
  let audioSource: AudioBufferSourceNode | undefined = undefined
  let gainNode: GainNode | undefined = undefined

  function createNoise() {
    const bufferSize = 2 * audioContext.sampleRate
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++)
      output[i] = Math.random() * 2 - 1
  
    audioSource!.buffer = noiseBuffer
  }

  function stopNoise() {
    if (!audioSource) return
    audioSource.stop()
  }

  function setGain(volume: number, fadeMs: number) {
    if (fadeMs === 0)
      gainNode!.gain.value = volume
    else
      gainNode!.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeMs / 1000)
  }

  function playNoise() {
    audioSource = audioContext.createBufferSource()
    gainNode = audioContext.createGain()
    audioSource.connect(gainNode)
    gainNode.connect(audioContext.destination)
    createNoise()
    setGain(0, 0)
    audioSource!.loop = true
    audioSource!.start()
  }

  return {
    playNoise,
    stopNoise,
    setGain,
    setFrequency() {},
    setDetune() {},
  }

}
