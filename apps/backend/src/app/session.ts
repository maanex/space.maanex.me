import { Packet } from "@maanex/spacelib-common"
import { Socket } from "socket.io"
import { UserModel } from "../database/models/user"
import { EntityManager } from "../database/entity-manager"
import { GeoUtils } from "../lib/geo-utils"
import { Realtime } from "./realtime"


export namespace Session {

  export type ActiveUser = {
    data: UserModel.Type
    socket: Socket
    sessionId: number
    liveUsers: number[]
    send(packet: Packet.Data): any
  }

  export const activeUsers: Map<string, ActiveUser> = new Map()

  // 

  let tickTimer: NodeJS.Timer = null
  let tickCounter = 0

  export function init() {
    if (tickTimer)
      clearInterval(tickTimer)

    tickTimer = setInterval(() => {
      if (++tickCounter >= 100)
        tickCounter = 0

      worldTick(tickCounter)
    }, 50)
  }

  //

  function tickZero() {
    for (const user of activeUsers.values()) {
      if (user.socket?.connected) {
        user.data.save()
        continue
      }

      activeUsers.delete(user.data.id)
      userLastEntitySyncPos.delete(user.data.id)
    }
  }

  /** last position [ x, y, strength ] of which user received entities */
  const userLastEntitySyncPos: Map<string, [ number, number, number ]> = new Map()

  async function tickUserEntityUpdate(user: ActiveUser, id: number) {
    if (id % 20 !== 0) return // TODO make it use the user's scan interval for speed and size

    if (userLastEntitySyncPos.has(user.data.id)) {
      const [ lx, ly, lr ] = userLastEntitySyncPos.get(user.data.id)
      // TODO: check if range is larger than prev, if it is continue even if not moved
      const dist = GeoUtils.distance(lx, ly, user.data.posX, user.data.posY)
      if (dist < 100) return
    }
    userLastEntitySyncPos.set(user.data.id, [ user.data.posX, user.data.posY, 0 /* TODO: user range */ ])

    const ents = await EntityManager.getEntitiesNear(user.data.posX, user.data.posY, 600)
    for (const e of ents)
      user.send(Packet.SC.UPDATE(e._id, e.type, e.pos[0], e.pos[1], e.data))

    activeUsers.forEach(other => Realtime.introIdlePlacer(other, user))
  }

  /** timer id will go up to 100 before dropping back to 0 (5 second interval) */
  function worldTick(id: number) {
    if (id === 0)
      tickZero()

    for (const user of activeUsers.values())
      tickUserEntityUpdate(user, id)
  }

}
