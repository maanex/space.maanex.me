
export const useEngine = () => {
  const BASE_SPEED = 8

  const handleDirection = useDirectionHandle()
  const handleAccl = useAcclHandle()
  const handleScan = useScanHandle()

  const position = usePosition()
  const accl = useAcceleration()
  const { shift, w, a, s, d } = useMagicKeys()


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

    //

    // if (a.value) handleDirection.value = (handleDirection.value - (shift.value ? 2 : 6) + 360) % 360
    // if (d.value) handleDirection.value = (handleDirection.value + (shift.value ? 2 : 6)) % 360

    // if (w.value) handleAccl.value = Math.min(handleAccl.value + (shift.value ? 0.01 : 0.05), 1)
    // if (s.value) handleAccl.value = Math.max(handleAccl.value - (shift.value ? 0.01 : 0.05), 0)
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
