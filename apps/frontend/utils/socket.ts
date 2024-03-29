import { EntityType, Packet, WorldsEntities } from '@maanex/spacelib-common'
import * as SocketIO from 'socket.io-client'
import { ALERT } from '~/lib/packets/alert'
import { EACK } from '~/lib/packets/eack'
import { JOURNAL } from '~/lib/packets/journal'
import { POI } from '~/lib/packets/poi'
import { POS } from '~/lib/packets/pos'
import { PROPS } from '~/lib/packets/props'
import { REMOVE } from '~/lib/packets/remove'
import { UPDATE } from '~/lib/packets/update'


const packetHandlers: Record<string, (...args: any) => void> = {
  ALERT,
  EACK,
  JOURNAL,
  POI,
  POS,
  PROPS,
  REMOVE,
  UPDATE,
}

let client: SocketIO.Socket | undefined

let connectionPromise: ((success: boolean) => void) | null = null

function connect() {
  if (client?.connected)
    return

  const host = useApi().getSocketHost()
  const url = location.protocol.includes('https')
    ? `wss://${host}`
    : `ws://${host}`
  client = SocketIO.io(url, {
    query: {
      auth: useApi().getToken()
    },
    transports: [ 'websocket', 'polling' ],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    reconnectionAttempts: 20
  })
  if (!client)
    return alert('NO SOCKET!!! WHAT!!!!')

  client.on('connect', onConnect)
  client.on('disconnect', onDisconnect)
  client.on('connect_error', () => client ? (client.io.opts.transports = [ 'polling', 'websocket' ]) : {})

  const sockObj = useSocket()
  for (const key in packetHandlers)
    client.on(key, (...args) => packetHandlers[key](sockObj, ...args))

  return new Promise((res) => (connectionPromise = res))
}

function disconnect() {
  const klient = client
  client = undefined
  if (klient?.connected)
    klient?.disconnect()
  useWebsocketInfo().value.reconnectPending = false
}

//

let reconIdleTimeout: any = null

function onConnect() {
  connectionPromise?.(true)
  useWebsocketInfo().value.connected = true

  console.log('connected')

  if (reconIdleTimeout)
    clearTimeout(reconIdleTimeout)
}

function onDisconnect() {
  connectionPromise?.(false)
  useWebsocketInfo().value.connected = false

  const intended = !client

  if (!intended) {
    useWebsocketInfo().value.reconnectPending = true

    // reconnect
    if (client) {
      if (client.io.opts.query)
        client.io.opts.query.memrecon = true
      client?.connect()
      if (client.io.opts.query)
        client.io.opts.query.memrecon = false
    }
  }

  console.log('disconnected', intended ? '(intentional)' : '(unintended)')

  reconIdleTimeout = setTimeout(() => {
    location.reload()
  }, 4000)
}

function send(packet: Packet.Data): void
function send(eventName: string, ...data: any): void
function send(key: any, ...data: any): void {
  if (typeof key === 'string')
    client?.emit(key, ...data)
  else
    client?.emit(...(key as Packet.Data))
}

//

/** this will simulate an unplanned connection hiccup */
function debugDisconnect() {
  client?.disconnect()
}

//

const packetRedudancyTracker = {
  posValX: 0,
  posValY: 0,
  posValRot: 0,
}

let transVal = ~~(Math.random() * 99999)
const eackCallbacks: Map<number, (newId: number) => any> = new Map()

export const useSocket = () => ({
  connect,
  disconnect,
  get connected(): boolean {
    return !!client?.connected
  },
  send,
  debugDisconnect,
  get _int() {
    return {
      packetRedudancyTracker,
      get transVal() { return transVal },
      set transVal(val: number) { transVal = val },
      eackCallbacks
    }
  },
  sendMovePacket(x: number, y: number, rot: number) {
    if (x === packetRedudancyTracker.posValX && y === packetRedudancyTracker.posValY && rot === packetRedudancyTracker.posValRot)
      return
    packetRedudancyTracker.posValX = x
    packetRedudancyTracker.posValY = y
    packetRedudancyTracker.posValRot = rot
    send(Packet.CS.POS(x, y, rot))
  },
  /** @returns [ a temporary id, the actual id once resolved or null if failed ] */
  sendEntityPacket(type: EntityType, x: number, y: number, data: any): [ number, Promise<number> ] {
    const transaction = transVal++
    const promise = new Promise<number>((res) => eackCallbacks.set(transaction, res))
    send(Packet.CS.SPAWN(transaction, type, x, y, data))
    return [ transaction, promise ]
  },
  sendScanPacket(power: number) {
    useSocket().send(Packet.CS.SCAN(power))
  },
  sendMinePacket(entity: number, amount: number) {
    useSocket().send(Packet.CS.MINE(entity, amount))
  },
  sendCheatCode(code: string) {
    useSocket().send(Packet.CS.CHEAT(code))
  },
  sendPurchasePacket(shop: WorldsEntities, itemName: string) {
    useSocket().send(Packet.CS.PURCHASE(shop, itemName))
  }
})
