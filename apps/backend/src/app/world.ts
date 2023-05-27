import { Packet, PoiType } from "@maanex/spacelib-common"
import { Session } from "./session.js"


export namespace World {

  const baseX = -175000
  const baseY = -355000
  const rad = 128 * 4

  export function newInitSpawnPos(): [ number, number ] {
    return [
      baseX + (Math.random() * rad * 2) - rad,
      baseY + (Math.random() * rad * 2) - rad
    ]
  }

  //

  const pointsOfInterest: Packet.SC.Poi[] = [
    [ baseX, baseY, PoiType.LANDMARK, 'spawn' ],
    [ -baseX, -baseY, PoiType.MERCHANT, 'test' ],
    [ baseX, -baseY, PoiType.LANDMARK, 'test2' ],
    [ -baseX, baseY, PoiType.USER, 'test3' ],
  ]

  function activeUsersAsPois(excludeSessionId: number): Packet.SC.Poi[] {
    const out = []
    for (const u of Session.activeUsers.values()) {
      if (u.sessionId === excludeSessionId) continue
      out.push([ u.data.posX, u.data.posY, PoiType.USER, u.data.id.slice(-4) ])
    }
    return out
  }

  export function getPoiNearby(x: number, y: number, scannerPower: number, whoAsked: Session.ActiveUser): Packet.SC.Poi[] {
    const range = (scannerPower * 35) ** 4
    const out = []
    const candidates: Packet.SC.Poi[] = [ ...pointsOfInterest, ...activeUsersAsPois(whoAsked.sessionId) ]
    for (const poi of candidates) {
      const minDist = Math.min(Math.abs(poi[0] - x), Math.abs(poi[1] - y))
      if (minDist > range) continue
      out.push(poi)
    }
    return out
  }

}
