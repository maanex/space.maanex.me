import { EntityType, Formulas, Packet } from "@maanex/spacelib-common"
import { Session } from "../session"
import { Mongo } from "../../database/mongo"
import { EntityModel } from "../../database/models/entity"


export function SPAWN(sender: Session.ActiveUser, transaction: number, type: EntityType, x: number, y: number, data: any) {
  const cost = verifyAndGetCost(sender, type, x, y, data)
  if (cost === null)
    return declineInteraction(sender, transaction)
  if (sender.data.resources < cost)
    return declineInteraction(sender, transaction)

  sender.data.resources -= cost
  const id = putEntity(sender, type, x, y, data)
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
function putEntity(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any): number {
  console.log(`${sender.data.id} placed a ${type} at ${x} ${y} with data ${data}`)
  const ent: EntityModel.Type = new Mongo.Entity({
    creator: sender.data.id,
    type,
    posX: x,
    posY: y,
    data
  }) as any
  ent.save()
  return ent._id
}
