import { Packet } from "@maanex/spacelib-common"
import { EntityManager } from "../entity-manager.js"
import { Session } from "../session.js"


export function MINE(sender: Session.ActiveUser, entity: number, amount: number) {
  if (typeof entity !== 'number' || typeof amount !== 'number') return

  if (amount > 5) return

  const oldVal = EntityManager.naturalsRichness.get(String(entity))
  if (!oldVal) return

  const newVal = Math.max(0, oldVal - amount)
  EntityManager.naturalsRichness.put(String(entity), newVal)
  sender.data.resources += amount
  sender.send(Packet.SC.PROPS({ resources: sender.data.resources }))
}
