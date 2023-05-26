import { Packet } from "@maanex/spacelib-common"
import { EntityManager } from "../../database/entity-manager"
import { Session } from "../session"


export function MINE(sender: Session.ActiveUser, entity: number, amount: number) {
  if (amount > 5) return

  const oldVal = EntityManager.naturalsRichness.get(String(entity))
  if (!oldVal) return

  const newVal = Math.max(0, oldVal - amount)
  EntityManager.naturalsRichness.put(String(entity), newVal)
  sender.data.resources += amount
  sender.send(Packet.SC.PROPS({ resources: sender.data.resources }))
}