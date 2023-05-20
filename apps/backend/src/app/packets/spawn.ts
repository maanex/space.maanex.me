import { EntityType, Formulas } from "@maanex/spacelib-common"
import { Session } from "../session"


export function SPAWN(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any) {
  const cost = verifyAndGetCost(sender, type, x, y, data)
  if (cost === null) return
  if (sender.data.resources < cost) return

  sender.data.resources -= cost
  putEntity(sender, type, x, y, data)
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

function putEntity(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any) {
  console.log(`${sender.data.id} placed a ${type} at ${x} ${y} with data ${data}`)
}
