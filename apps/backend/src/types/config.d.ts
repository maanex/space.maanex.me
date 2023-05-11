

export type configjs = {
  port: number
  frontend: {
    url: string
  }
  keys: {
    privateKeyUri: string
  }
  caches: {
    usersTtl: number
  }
  auth: {
    requireEmail: boolean
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
