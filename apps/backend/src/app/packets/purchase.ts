import { Packet, shopItems, userMeetsRequirements, WorldsEntities } from "@maanex/spacelib-common"
import { Session } from "../session.js"


export function PURCHASE(sender: Session.ActiveUser, shop: WorldsEntities, itemName: string) {
  if (typeof shop !== 'number' || typeof itemName !== 'string') return
  if (!shopItems[shop]) return
  
  const item = shopItems[shop].find(i => (i.name === itemName))
  if (!item) return
  if (sender.data.resources < item.price(sender.data.resources, sender.data.unlocks)) return
  if (!userMeetsRequirements(item.requires, sender.data.unlocks)) return

  sender.data.resources -= item.price(sender.data.resources, sender.data.unlocks)
  item.unlocks.forEach(feat => sender.data.unlocks.includes(feat) ? null : sender.data.unlocks.push(feat))
  sender.send(Packet.SC.PROPS({ resources: sender.data.resources, unlocks: sender.data.unlocks }))
}
