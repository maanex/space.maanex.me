import { Packet } from "@maanex/spacelib-common"
import { Socket } from "socket.io"
import { UserModel } from "../database/models/user"


export namespace Session {

  export type ActiveUser = {
    data: UserModel.Type
    socket: Socket
    send(packet: Packet.Data): any
  }
  
  export const activeUsers: ActiveUser[] = []

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

  /** timer id will go up to 100 before dropping back to 0 (5 second interval) */
  function worldTick(id: number) {

  }

}
