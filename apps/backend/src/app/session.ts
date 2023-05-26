import { Const, Formulas, Packet } from "@maanex/spacelib-common"
import { Socket } from "socket.io"
import { UserModel } from "../database/models/user"
import { GeoUtils } from "../lib/geo-utils"
import { Realtime } from "./realtime"


export namespace Session {

  export type ActiveUser = {
    data: UserModel.Type
    /** data that's only on live environment and does not get saved */
    liveData: {
      rot: number
    }
    /** user's socket connection */
    socket: Socket
    /** a all time unique id for this session only */
    sessionId: number
    /** all other users this user is currently getting real time info about */
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
    if (id % 20 !== 0) return

    activeUsers.forEach(other => Realtime.introIdlePlacer(other, user))

    // if (userLastEntitySyncPos.has(user.data.id)) {
    //   const [ lx, ly, lr ] = userLastEntitySyncPos.get(user.data.id)
    //   // TODO: check if range is larger than prev, if it is continue even if not moved
    //   const dist = GeoUtils.distance(lx, ly, user.data.posX, user.data.posY)
    //   if (dist < 100) return
    // }
    // userLastEntitySyncPos.set(user.data.id, [ user.data.posX, user.data.posY, 0 /* TODO: user range */ ])
  }

  function tickCenterTeleport(user: ActiveUser) {
    if (user.data.posX > Const.mapRing1) return
    if (user.data.posX < -Const.mapRing1) return
    if (user.data.posY > Const.mapRing1) return
    if (user.data.posY < -Const.mapRing1) return

    const rad = Formulas.radiationLevel(GeoUtils.distance(user.data.posX, user.data.posY, 0, 0))
    if (rad < 0.7) return

    const angle = Math.atan2(user.data.posY, user.data. posX)
    const mutate = ~~(Math.random() * 270 + 45)
    const outangle = angle + mutate / 180 * Math.PI
    const dist = Const.mapRing2 + Math.random() * (Const.mapRing3 - Const.mapRing2)
    const newX = Math.cos(outangle) * dist
    const newY = Math.sin(outangle) * dist
    
    user.send(Packet.SC.PROPS({ extraRadiation: 1 }))
    setTimeout(() => {
      user.send(Packet.SC.POS(newX, newY, null))
      user.data.posX = newX
      user.data.posY = newY
    }, 500)
  }

  /** timer id will go up to 100 before dropping back to 0 (5 second interval) */
  function worldTick(id: number) {
    if (id === 0)
      tickZero()

    for (const user of activeUsers.values())
      tickUserEntityUpdate(user, id)

    if (id === 0) {
      for (const user of activeUsers.values())
        tickCenterTeleport(user)
    }
  }

}
