
export type configjs = {
  port: number
  frontend: {
    url: string
  }
  notifications: {
    discordWebhookUrl: string
  }
  keys: {
    privateKeyUri: string
  }
  databases: {
    mongoUrl: string
  }
  caches: {
    usersTtl: number
    entitiesTtl: number
    naturalEntitiesTtl: number
  }
  auth: {
    requireEmail: boolean
    callbackUrl: string
    discord: {
      client_id: string
      client_secret: string
    }
    github: {
      client_id: string
      client_secret: string
    }
  }
}

import configraw from '../config.mjs'
const config = configraw as configjs
export { config }
