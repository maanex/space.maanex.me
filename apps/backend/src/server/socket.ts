/* eslint-disable no-undef */
import { Packet } from '@maanex/spacelib-common'
import * as http from 'http'
import { Server, Socket } from 'socket.io'
import { Session } from '../app/session.js'
import { UserManager } from '../app/user-manager.js'
import { UserAuth } from '../lib/user-auth.js'
import { CHEAT } from '../app/packets/cheat.js'
import { MINE } from '../app/packets/mine.js'
import { POS } from '../app/packets/pos.js'
import { PURCHASE } from '../app/packets/purchase.js'
import { SCAN } from '../app/packets/scan.js'
import { SPAWN } from '../app/packets/spawn.js'
import { EntityManager } from '../app/entity-manager.js'
import { Realtime } from '../app/realtime.js'
import { config } from '../config.js'


export default class SocketServer {

  private static packetHandlers: Record<string, (sender: Session.ActiveUser, ...args: any) => void> = {
    CHEAT,
    MINE,
    POS,
    PURCHASE,
    SCAN,
    SPAWN
  }

  private static server: Server

  public static init(server: http.Server) {
    SocketServer.server = new Server(server, {
      cors: {
        origin: config.frontend.url ?? '*',
        methods: [ 'POST' ]
      }
    })

    SocketServer.server.on('connection', SocketServer.newConnection)
  }

  private static async newConnection(socket: Socket) {
    const handshake = socket.handshake.query
    const auth = String(handshake.auth || '')

    // validate handshake
    if (!auth)
      return SocketServer.closeConnection(socket, 'invalid_handshake')

    // validate user auth
    const userPayload = await UserAuth.parseUser(auth)
    if (!userPayload)
      return SocketServer.closeConnection(socket, 'invalid_auth')

    const existingSession = Session.activeUsers.get(userPayload.id)
    SocketServer.closeConnection(existingSession?.socket, 'new_connection')

    const user = existingSession?.data
      ?? await UserManager.getUser(userPayload.id)
    if (!user)
      return SocketServer.closeConnection(socket, 'socket_hiccup')

    const activeUser: Session.ActiveUser = {
      data: user,
      liveData: {
        rot: 0
      },
      socket,
      sessionId: EntityManager.createNewId(),
      liveUsers: [],
      send: (packet) => SocketServer.sendPacket(socket, packet)
    }
    Session.activeUsers.set(user.id, activeUser)

    // Register basic socket handlers
    for (const key in SocketServer.packetHandlers)
      socket.on(key, (...data) => SocketServer.packetHandlers[key](activeUser, ...data))

    // Lifecycle
    socket.on('disconnect', () => SocketServer.onDisconnect(activeUser, socket))
    SocketServer.onConnect(activeUser, socket)
  }

  private static async onConnect(user: Session.ActiveUser, socket: Socket) {
    Session.activeUsers.forEach(u => {
      Realtime.introIdlePlacer(user, u)
    })
  }

  private static async onDisconnect(user: Session.ActiveUser, socket: Socket) {
    Session.activeUsers.forEach(u => {
      if (!u.liveUsers.includes(user.sessionId)) return
      u.send(Packet.SC.REMOVE(user.sessionId))
      u.liveUsers.splice(u.liveUsers.indexOf(user.sessionId))
    })
  }

  // 

  public static sendPacket(socket: Socket, packet: Packet.Data) {
    if (!socket?.connected) return
    socket.emit(...packet)
  }

  public static closeConnection(socket: Socket, ...args: Parameters<typeof Packet.SC.DISCONNECT>) {
    if (!socket?.connected) return
    SocketServer.sendPacket(socket, Packet.SC.DISCONNECT(...args))
    socket.disconnect()
    socket.removeAllListeners()
  }

}
