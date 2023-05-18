

type WebsocketInfo = {
  connected: boolean
  reconnectPending: boolean
  disconnectReason: string
  // ping: number
}

export const useWebsocketInfo = () => useState<WebsocketInfo>('appWebsocketInfo', () => ({
  connected: false,
  reconnectPending: false,
  disconnectReason: ''
}))
