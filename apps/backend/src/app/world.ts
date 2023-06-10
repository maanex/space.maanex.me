import { EntityType, Packet, PoiType, WorldsEntities } from "@maanex/spacelib-common"
import { EntityModel } from "../database/models/entity.js"
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

  export const worldsEntities: (EntityModel.DataType & { _poit: PoiType })[] = [
    // {
    //   // boujin is an exotic trader selling rare goods. he is far out in the unknown regions
    //   _id: WorldsEntities.MERCHANT_BOUJIN,
    //   _poit: PoiType.MERCHANT,
    //   creator: '',
    //   type: EntityType.SPECIAL,
    //   pos: [ 900000, 900000 ],
    //   data: 'Boujin (WIP)'
    // },
    {
      // the outpost is a larger merchant selling various goods
      _id: WorldsEntities.MERCHANT_WESTSIDE_OUTPOST,
      _poit: PoiType.MERCHANT,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ -489000, -322000 ],
      data: 'Westside Outpost'
    },
    {
      // Belor Rift is dark Smudge
      _id: WorldsEntities.LANDMARK_BELOR_RIFT,
      _poit: PoiType.LANDMARK,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ 541000, -601000 ],
      data: 'Belor Rift'
    },
    {
      // Vanor Rift is dark Smudge
      _id: WorldsEntities.LANDMARK_VANOR_RIFT,
      _poit: PoiType.LANDMARK,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ 498000, -662000 ],
      data: 'Vanor Rift'
    },
    {
      // Smaar Rift is dark Smudge
      _id: WorldsEntities.LANDMARK_SMAAR_RIFT,
      _poit: PoiType.LANDMARK,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ 144000, 484000 ],
      data: 'Smaar Rift'
    },
    // {
    //   // Central Market has the biggest sortiment of items
    //   _id: WorldsEntities.MERCHANT_CENTRAL_MARKET,
    //   _poit: PoiType.MERCHANT,
    //   creator: '',
    //   type: EntityType.SPECIAL,
    //   pos: [ -84000, 313000 ],
    //   data: 'Central Market (WIP)'
    // },
    {
      // Belor Tools is a small indie shop
      _id: WorldsEntities.MERCHANT_BELOR_TOOLS,
      _poit: PoiType.MERCHANT,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ 465000, -541000 ],
      data: 'Belor Tools'
    },
    {
      // The outpost is a larger merchant
      _id: WorldsEntities.MERCHANT_EASTSIDE_OUTPOST,
      _poit: PoiType.MERCHANT,
      creator: '',
      type: EntityType.SPECIAL,
      pos: [ 489000, 322000 ],
      data: 'Eastside Outpost'
    },
    // {
    //   // Third sector goods is a small indie shop
    //   _id: WorldsEntities.MERCHANT_THIRD_SECTOR,
    //   _poit: PoiType.MERCHANT,
    //   creator: '',
    //   type: EntityType.SPECIAL,
    //   pos: [ -424000, 791000 ],
    //   data: '3rd Sector Goods (WIP)'
    // },
  ]

  export const pointsOfInterest: Packet.SC.Poi[] = [
    [ baseX, baseY, PoiType.LANDMARK, 'The Spawn' ],
    ...worldsEntities.map(e => ([ e.pos[0], e.pos[1], e._poit, e.data as String ] as Packet.SC.Poi))
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
    const range = (scannerPower * 5) ** 8
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
