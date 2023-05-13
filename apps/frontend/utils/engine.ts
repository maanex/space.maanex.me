
export const useEngine = () => {
  const BASE_SPEED = 8

  const handleDirection = useState('handle-direction', () => 0)
  const handleAccl = useState('handle-accl', () => 0)
  const handleScan = useState('handle-scan', () => 0)

  const position = usePosition()
  const accl = useAcceleration()


  async function tick() {
    const acclSpeed = (handleAccl.value ** 3) * BASE_SPEED
    const xDelta = Math.sin(handleDirection.value / 180 * Math.PI) * acclSpeed
    const yDelta = Math.cos(handleDirection.value / 180 * Math.PI) * acclSpeed

    let newAcclX = (accl.value.x + xDelta) * 0.96
    if (Math.abs(newAcclX) < 0.002) newAcclX *= 0.96
    if (Math.abs(newAcclX) < 0.00002) newAcclX = 0
    accl.value.x = newAcclX

    let newAcclY = (accl.value.y + yDelta) * 0.96
    if (Math.abs(newAcclY) < 0.002) newAcclY *= 0.96
    if (Math.abs(newAcclY) < 0.00002) newAcclY = 0
    accl.value.y = newAcclY

    position.value.x = position.value.x + newAcclX
    position.value.y = position.value.y + newAcclY
  }

  const timer = useState<any>(() => null)

  return {
    init() {
      if (timer.value)
        clearInterval(timer.value)

      timer.value = setInterval(tick, 50)
    },
    tick,
  }
}
