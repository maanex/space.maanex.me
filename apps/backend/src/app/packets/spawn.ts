import { Const, EntityType, Formulas, Packet } from "@maanex/spacelib-common"
import { Session } from "../session"
import { EntityManager } from "../../database/entity-manager"


export async function SPAWN(sender: Session.ActiveUser, transaction: number, type: EntityType, x: number, y: number, data: any) {
  // TODO: check if distance is justified (e.g. not place with 1k tiles distance to own position)

  if (Math.abs(x) >= Const.maxDistance || Math.abs(y) >= Const.maxDistance)
    return declineInteraction(sender, transaction)

  const cost = verifyAndGetCost(sender, type, x, y, data)
  if (cost === null)
    return declineInteraction(sender, transaction)
  if (sender.data.resources < cost)
    return declineInteraction(sender, transaction)

  sender.data.resources -= cost
  const id = await putEntity(sender, type, x, y, data)
  sender.send(Packet.SC.EACK(transaction, id))
}

function declineInteraction(sender: Session.ActiveUser, transaction: number) {
  sender.send(Packet.SC.EACK(transaction, null))
  sender.send(Packet.SC.PROPS({ resources: sender.data.resources }))
}

function verifyAndGetCost(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any) {
  switch (type) {
    case EntityType.MESSAGE:
      if (typeof data !== 'string') return null
      return Formulas.simpleWriteCost(data.length)
    default:
      return null
  }
}

/** @returns the created entity id */
async function putEntity(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any): Promise<number> {
  console.log(`${sender.data.id} placed a ${type} at ${x} ${y} with data ${data}`)
  const ent = await EntityManager.createEntity({
    creator: sender.data.id,
    type,
    pos: [ x, y ],
    data
  })
  return ent._id
}
