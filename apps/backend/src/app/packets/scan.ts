import { Packet } from "@maanex/spacelib-common"
import { EntityManager } from "../../database/entity-manager.js"
import { Session } from "../session.js"


export async function SCAN(sender: Session.ActiveUser, power: number) {
  // TODO: cheat detection stuffies

  const range = Math.min(2000, ~~(power * 2500) + 160)
  const ents = await EntityManager.getEntitiesNear(sender.data.posX, sender.data.posY, range)
  for (const e of ents)
    sender.send(Packet.SC.UPDATE(e._id, e.type, e.pos[0], e.pos[1], e.creator.slice(-4) + String(e.data)))
}
