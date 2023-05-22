import { Realtime } from "../realtime"
import { Session } from "../session"


export function POS(sender: Session.ActiveUser, x: number, y: number, rot: number) {
  // TODO: cheat detection stuffies
  sender.data.posX = x
  sender.data.posY = y

  Realtime.broadcastUserPos(sender)
}
