

/** @type {import('./src/types/config').configjs} */
module.exports = {
  port: 8062,
  frontend: {
    // url: 'https://sussyalien.tude.club'
    url: 'http://localhost:3000'
  },
  keys: {
    privateKeyUri: ''
  },
  caches: {
    usersTtl: 1000 * 60
  },
  auth: {
    requireEmail: false,
    discord: {
      client_id: '',
      client_secret: ''
    },
    github: {
      client_id: '',
      client_secret: ''
    }
  }
}

