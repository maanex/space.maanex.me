import { Color, Const, EntityType, Formulas, Packet } from "@maanex/spacelib-common"
import { Session } from "../session.js"
import { EntityManager } from "../entity-manager.js"
import { sendDiscordWebhook } from "../../lib/discord.js"


export async function SPAWN(sender: Session.ActiveUser, transaction: number, type: EntityType, x: number, y: number, data: any) {
  if (typeof transaction !== 'number' || typeof type !== 'number' || typeof x !== 'number' || typeof y !== 'number') return

  const distanceToAuthor = Math.sqrt((sender.data.posX - x)**2 + (sender.data.posY - y)**2)
  if (distanceToAuthor > 100) // yes. this is "cheat detecition". very professional.
    return declineInteraction(sender, transaction)

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
      if (data.split('').some(c => !Const.charsetAllowedInMessages.includes(c))) return null
      // We aren't even checking here if the user actually owns the upgrade to paint in that color but hey. whatever.
      if (![ Color.BLACK, Color.BLUE, Color.BROWN, Color.GREEN, Color.MINT, Color.ORANGE, Color.PINK, Color.RED, Color.WHITE, Color.YELLOW ].includes(data[0] as any)) return null
      return Formulas.simpleWriteCost(data.length-1)
    case EntityType.LINE:
      if (typeof data !== 'string') return null
      if (![ Color.BLACK, Color.BLUE, Color.BROWN, Color.GREEN, Color.MINT, Color.ORANGE, Color.PINK, Color.RED, Color.WHITE, Color.YELLOW ].includes(data[0] as any)) return null
      if (data[1] !== '0' && data[1] !== '1') return null
      const [ bx, by ] = data.slice(2).split(',').map(Number)
      if (!bx || isNaN(bx) || !by || isNaN(by)) return null
      const length = Math.sqrt((bx-x)**2 + (by-y)**2)
      if (length > 200) return null
      return Formulas.linePainterCost(length, data[1] === '1')
    default:
      return null
  }
}

/** @returns the created entity id */
async function putEntity(sender: Session.ActiveUser, type: EntityType, x: number, y: number, data: any): Promise<number> {
  // console.log(`${sender.data.id} (${sender.data.authn.username}) placed a ${type} at ${x} ${y} with data ${data}`)
  sendDiscordWebhook('ENTITY SPAWN', `${sender.data.uuid} (${sender.data.authn.username}) spawned a ${type} at (${x},${y}) with data \`${data}\``)
  const ent = await EntityManager.createEntity({
    creator: sender.data.id,
    type,
    pos: [ x, y ],
    data
  })
  return ent._id
}
