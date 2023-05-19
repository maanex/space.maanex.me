import { Const } from "@maanex/spacelib-common"


export const useEngine = () => {
  const socket = useSocket()
  
  const handleDirection = useDirectionHandle()
  const handleAccl = useAcclHandle()
  const handleScan = useScanHandle()
  
  const position = usePosition()
  const accl = useAcceleration()
  
  //
  
  function tickMovement(id: number) {
    const acclSpeed = (handleAccl.value ** 3) * Const.baseSpeed
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
  
    // socket.send(Packet.CS.POS(position.value.x, position.value.y, handleDirection.value))
    if (id % 5 === 0)
      socket.sendMovePacket(~~position.value.x, ~~position.value.y, ~~handleDirection.value)
  }

  let tickId = 0
  
  async function tick() {
    if (++tickId >= 60)
      tickId = 0

    if (handleAccl.value || accl.value.x || accl.value.y)
      tickMovement(tickId)
  
    //
  
    // if (a.value) handleDirection.value = (handleDirection.value - (shift.value ? 2 : 6) + 360) % 360
    // if (d.value) handleDirection.value = (handleDirection.value + (shift.value ? 2 : 6)) % 360
  
    // if (w.value) handleAccl.value = Math.min(handleAccl.value + (shift.value ? 0.01 : 0.05), 1)
    // if (s.value) handleAccl.value = Math.max(handleAccl.value - (shift.value ? 0.01 : 0.05), 0)
  }
  
  //
  
  const timer = useState<any>(() => null)
  
  function init() {
    if (timer.value)
      clearInterval(timer.value)
  
    timer.value = setInterval(tick, 50)
  }

  //

  return {
    tick,
    init
  }
}
