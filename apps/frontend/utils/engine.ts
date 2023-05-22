import { Const, EntityType, Formulas } from "@maanex/spacelib-common"


export const useEngine = () => {
  const socket = useSocket()
  
  const handleDirection = useDirectionHandle()
  const handleAccl = useAcclHandle()
  const handleScan = useScanHandle()
  
  const position = usePosition()
  const accl = useAcceleration()
  const ents = useWorldEntities()

  let lastDirHandleVal = 0

  //

  function peopleNearby() {
    for (const e of ents.value.values())
      if (e.type === EntityType.PERSON) return true
    return false
  }

  function tickMovement(id: number) {
    lastDirHandleVal = handleDirection.value

    const acclSpeed = (handleAccl.value ** 3) * Const.baseSpeed
    const xDelta = Math.sin(handleDirection.value / 180 * Math.PI) * acclSpeed
    const yDelta = Math.cos(handleDirection.value / 180 * Math.PI) * acclSpeed

    let newAcclX = (accl.value.x + xDelta) * Const.baseFriction
    if (Math.abs(newAcclX) < 0.002) newAcclX *= Const.baseFriction
    if (Math.abs(newAcclX) < 0.00002) newAcclX = 0
    accl.value.x = newAcclX
  
    let newAcclY = (accl.value.y + yDelta) * Const.baseFriction
    if (Math.abs(newAcclY) < 0.002) newAcclY *= Const.baseFriction
    if (Math.abs(newAcclY) < 0.00002) newAcclY = 0
    accl.value.y = newAcclY

    position.value.x = position.value.x + newAcclX
    position.value.y = position.value.y + newAcclY

    if (id % 20 === 0 || peopleNearby())
      socket.sendMovePacket(~~position.value.x, ~~position.value.y, ~~handleDirection.value)
  }

  function tickEntityDecay() {
    const maxDist = 2 * 16 * 128
    for (const ent of ents.value.values()) {
      if (Math.abs(ent.x - position.value.x) > maxDist || Math.abs(ent.y - position.value.y) > maxDist)
        ents.value.delete(ent.id)
    }
  }

  function tickRadiation() {
    if (Math.abs(position.value.x) > Const.mapRing1 * 1.1) return
    if (Math.abs(position.value.y) > Const.mapRing1 * 1.1) return
    const distToCenter = Math.sqrt(position.value.x**2 + position.value.y**2)
    if (distToCenter > Const.mapRing1 * 1.1) return
    const baseRadiation = Formulas.radiationLevel(distToCenter)
    console.log(baseRadiation)
  }

  let tickId = 0
  async function tick() {
    if (++tickId >= 60)
      tickId = 0

    if (handleAccl.value || accl.value.x || accl.value.y || handleDirection.value !== lastDirHandleVal)
      tickMovement(tickId)

    if (tickId === 0)
      tickEntityDecay()

    tickRadiation()
  
    //
  
    // if (a.value) handleDirection.value = (handleDirection.value - (shift.value ? 2 : 6) + 360) % 360
    // if (d.value) handleDirection.value = (handleDirection.value + (shift.value ? 2 : 6)) % 360
  
    // if (w.value) handleAccl.value = Math.min(handleAccl.value + (shift.value ? 0.01 : 0.05), 1)
    // if (s.value) handleAccl.value = Math.max(handleAccl.value - (shift.value ? 0.01 : 0.05), 0)
  }
  
  //
  
  const timer = useState<any>('engineTickTimer', () => null)
  
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
