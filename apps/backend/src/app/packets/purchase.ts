import { Packet, shopItems, userMeetsRequirements, WorldsEntities } from "@maanex/spacelib-common"
import { Session } from "../session.js"


export function PURCHASE(sender: Session.ActiveUser, shop: WorldsEntities, itemName: string) {
  console.log(1)
  if (typeof shop !== 'number' || typeof itemName !== 'string') return
  console.log(2)
  if (!shopItems[shop]) return
  console.log(3)
  
  const item = shopItems[shop].find(i => (i.name === itemName))
  console.log(item)
  if (!item) return
  console.log(5)
  if (sender.data.resources < item.price(sender.data.resources, sender.data.unlocks)) return
  console.log(6)
  if (!userMeetsRequirements(item.requires, sender.data.unlocks)) return
  console.log(7)

  sender.data.resources -= item.price(sender.data.resources, sender.data.unlocks)
  item.unlocks.forEach(feat => sender.data.unlocks.includes(feat) ? null : sender.data.unlocks.push(feat))
  sender.send(Packet.SC.PROPS({ resources: sender.data.resources, unlocks: sender.data.unlocks }))
}
