import { EntityType, Packet } from "@maanex/spacelib-common"
import { Session } from "./session"


export namespace Realtime {

  const maxViewDistance = (2 * 16 * 128) * 1.25

  function areInRange(user1: Session.ActiveUser, user2: Session.ActiveUser) {
    return Math.abs(user1.data.posX - user2.data.posX) < maxViewDistance
      && Math.abs(user1.data.posY - user2.data.posY) < maxViewDistance
  }

  export function broadcastUserPos(user: Session.ActiveUser) {
    for (const other of Session.activeUsers.values()) {
      if (other.sessionId === user.sessionId) continue

      if (areInRange(other, user)) {
        sendUpdate(other, user)
      } else {
        if (other.liveUsers.length && other.liveUsers.includes(user.sessionId)) {
          other.send(Packet.SC.REMOVE(user.sessionId))
          other.liveUsers.splice(other.liveUsers.indexOf(user.sessionId))
        }
        if (user.liveUsers.length && user.liveUsers.includes(other.sessionId)) {
          user.send(Packet.SC.REMOVE(other.sessionId))
          user.liveUsers.splice(user.liveUsers.indexOf(other.sessionId))
        }
      }
    }
  }

  function sendUpdate(to: Session.ActiveUser, about: Session.ActiveUser) {
    to.send(Packet.SC.UPDATE(about.sessionId, EntityType.PERSON, about.data.posX, about.data.posY, null))

    if (!to.liveUsers.includes(about.sessionId))
      to.liveUsers.push(about.sessionId)
  }

  export function introIdlePlacer(idle: Session.ActiveUser, to: Session.ActiveUser) {
    if (idle.sessionId === to.sessionId) return
    if (to.liveUsers.length && to.liveUsers.includes(idle.sessionId)) return
    if (!areInRange(idle, to)) return

    sendUpdate(to, idle)
  }

}
