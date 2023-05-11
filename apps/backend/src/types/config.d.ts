

export type configjs = {
  port: number
  frontend: {
    url: string
  }
  keys: {
    privateKeyUri: string
  }
  databases: {
    mongoUrl: string
  }
  caches: {
    usersTtl: number
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
