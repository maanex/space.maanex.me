/* eslint-disable no-undef */
import { Packet } from '@maanex/spacelib-common'
import * as http from 'http'
import { Server, Socket } from 'socket.io'
import { Session } from '../app/session'
import { UserModel } from '../database/models/user'
import { UserManager } from '../database/user-manager'
import { UserAuth } from '../lib/user-auth'
import { POS } from '../app/packets/pos'


export default class SocketServer {

  private static packetHandlers: Record<string, (sender: Session.ActiveUser, ...args: any) => void> = {
    POS
  }

  private static server: Server

  public static init(server: http.Server) {
    SocketServer.server = new Server(server, {
      cors: {
        origin: '*', // TODO
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

    const user = await UserManager.getUser(userPayload.id)
    if (!user)
      return SocketServer.closeConnection(socket, 'socket_hiccup')

    const activeUser: Session.ActiveUser = {
      data: user,
      socket,
      send: (packet) => SocketServer.sendPacket(socket, packet)
    }
    Session.activeUsers.set(user.id, activeUser)

    // Register basic socket handlers
    for (const key in SocketServer.packetHandlers)
      socket.on(key, (...data) => SocketServer.packetHandlers[key](activeUser, ...data))

    // Lifecycle
    socket.on('disconnect', () => SocketServer.onDisconnect(user, socket))
    SocketServer.onConnect(user, socket)
  }

  private static async onConnect(user: UserModel.Type, socket: Socket) {
  }

  private static async onDisconnect(user: UserModel.Type, socket: Socket) {
  }

  // 

  public static sendPacket(socket: Socket, packet: Packet.Data) {
    socket.emit(...packet)
  }

  public static closeConnection(socket: Socket, ...args: Parameters<typeof Packet.SC.DISCONNECT>) {
    SocketServer.sendPacket(socket, Packet.SC.DISCONNECT(...args))
    socket.disconnect()
    socket.removeAllListeners()
  }

}
