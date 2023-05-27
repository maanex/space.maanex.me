import { Const, EntityType, Formulas, Packet } from "@maanex/spacelib-common"


const TPS = 1000 / 20

export const useEngine = () => {
  const socket = useSocket()
  
  const handleDirection = useDirectionHandle()
  const handleAccl = useAcclHandle()
  const handleScan = useScanHandle()
  
  const position = usePosition()
  const accl = useAcceleration()
  const ents = useWorldEntities()
  const rad = useRadiation()

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

  function clearRadiation() {
    if (rad.value)
      rad.value = 0
  }

  function tickRadiation() {
    const extra = useProps().value.extraRadiation
    if (!extra && Math.abs(position.value.x) > Const.mapRing1 * 1.1) return clearRadiation()
    if (!extra && Math.abs(position.value.y) > Const.mapRing1 * 1.1) return clearRadiation()

    const distToCenter = Math.sqrt(position.value.x**2 + position.value.y**2)
    if (!extra && distToCenter > Const.mapRing1 * 1.1) return clearRadiation()

    const baseRadiation = Math.max(extra, Formulas.radiationLevel(distToCenter))
    rad.value = baseRadiation * (Math.random() * .3 + .8)

    if (extra)
      useProps().value.extraRadiation = extra - 0.1 / TPS
    if (extra <= 0)
      useProps().value.extraRadiation = 0
  }

  function tickJournalUnlocks() {
    const pos = usePosition().value
    const accl = useAcceleration().value
    const docs = useDocuments().value

    const distToCenter = Math.sqrt(pos.x**2 + pos.y**2)
    if (distToCenter <= Const.mapRing1 && !docs.has('ring1'))
      docs.set('ring1', false)
    if (distToCenter >= Const.mapRing2 && !docs.has('ring3'))
      docs.set('ring3', false)
    if (distToCenter >= Const.mapRing3 && !docs.has('outerring'))
      docs.set('outerring', false)

    if (accl.x !== 0 && accl.y !== 0 && !docs.has('readwrite'))
      docs.set('readwrite', false)
  }

  let scannerCharge = 0

  function tickScanner() {
    scannerCharge++
    const reqCharge = ~~(handleScan.value * 160) + 40
    if (scannerCharge <= reqCharge) return
    scannerCharge = 0

    const scaneff = useScanEffects().value
    scaneff.push([ ~~(Math.random() * 99999999), handleScan.value ])
    setTimeout(() => scaneff.splice(0, 1), 2000)

    socket.sendScanPacket(handleScan.value)

    const docs = useDocuments()
    if (handleScan.value >= 0.86 && !docs.value.has('poi'))
      docs.value.set('poi', false)
  }

  let tickId = 0
  async function tick() {
    if (document?.visibilityState === 'hidden') return

    if (++tickId >= 100)
      tickId = 0

    if (handleAccl.value || accl.value.x || accl.value.y || handleDirection.value !== lastDirHandleVal)
      tickMovement(tickId)

    if (tickId === 0)
      tickEntityDecay()

    if (tickId % 20 === 0)
      tickJournalUnlocks()

    tickRadiation()
    tickScanner()

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

    timer.value = setInterval(tick, TPS)
  }

  //

  return {
    tick,
    init
  }
}
