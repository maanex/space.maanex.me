import { Packet } from '@maanex/spacelib-common'
import * as SocketIO from 'socket.io-client'
import { POS } from '~/app/packets/pos'


const packetHandlers: Record<string, (...args: any) => void> = {
  POS
}

let client: SocketIO.Socket | undefined

let connectionPromise: ((success: boolean) => void) | null = null

function connect() {
  if (client && client)
    disconnect()

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

  for (const key in packetHandlers)
    client.on(key, packetHandlers[key])

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

function onConnect() {
  connectionPromise?.(true)
  useWebsocketInfo().value.connected = true

  console.log('connected')
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

export const useSocket = () => ({
    connect,
    disconnect,
    get connected(): boolean {
      return !!client?.connected
    },
    send,
    debugDisconnect
})
