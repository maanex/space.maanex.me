import { Session } from "../session"


export function POS(sender: Session.ActiveUser, x: number, y: number, rot: number) {
  // TODO: cheat detection stuffies
  console.log(sender.data.uuid, x, y, rot)
  sender.data.posX = x
  sender.data.posY = x
}
