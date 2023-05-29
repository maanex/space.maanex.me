import { Packet } from "@maanex/spacelib-common"
import { EntityManager } from "../entity-manager.js"
import { Session } from "../session.js"
import { World } from "../world.js"


export async function SCAN(sender: Session.ActiveUser, power: number) {
  if (typeof power !== 'number') return

  // TODO: cheat detection stuffies

  const range = Math.min(2000, ~~(power * 2500) + 160)
  const ents = await EntityManager.getEntitiesNear(sender.data.posX, sender.data.posY, range)
  for (const e of ents)
    sender.send(Packet.SC.UPDATE(e._id, e.type, e.pos[0], e.pos[1], e.creator.slice(-4) + String(e.data)))

  const pois = World.getPoiNearby(sender.data.posX, sender.data.posY, power, sender)
  for (const poi of pois)
    sender.send(Packet.SC.POI(poi))
}
