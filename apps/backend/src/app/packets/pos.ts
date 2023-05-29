import { Realtime } from "../realtime.js"
import { Session } from "../session.js"


export function POS(sender: Session.ActiveUser, x: number, y: number, rot: number) {
  if (typeof x !== 'number' || typeof y !== 'number' || typeof rot !== 'number') return

  // TODO: cheat detection stuffies
  sender.data.posX = x
  sender.data.posY = y
  sender.liveData.rot = rot

  Realtime.broadcastUserPos(sender)
}
