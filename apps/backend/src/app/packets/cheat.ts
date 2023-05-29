import { Packet } from "@maanex/spacelib-common"
import { Session } from "../session.js"


export function CHEAT(sender: Session.ActiveUser, code: string) {
  if (!code) return
  if (typeof code !== 'string') return

  if (code.startsWith('gimmemoneys ')) {
    sender.data.resources += parseInt(code.slice('gimmemoneys '.length)) || 0
    sender.send(Packet.SC.PROPS({ resources: sender.data.resources }))
    return
  }

  if (code === 'resetunlocks') {
    sender.data.unlocks = []
    sender.send(Packet.SC.PROPS({ unlocks: [] }))
    return
  }

  sender.send(Packet.SC.ALERT('Invalid cheat code'))
}
