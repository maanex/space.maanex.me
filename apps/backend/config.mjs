

/** @type {import('./src/types/config').configjs} */
export default {
  port: 5050,
  frontend: {
    // url: 'https://sussyalien.tude.club'
    url: 'http://localhost:3000'
  },
  keys: {
    privateKeyUri: ''
  },
  databases: {
    mongoUrl: 'mongodb://maanexspace:maanexspace@devenv_mongodb:27017/maanexspace'
  },
  caches: {
    usersTtl: 1000 * 60,
    entitiesTtl: 1000 * 60
  },
  auth: {
    requireEmail: false,
    callbackUrl: 'http://localhost:3000/callback',
    discord: {
      client_id: '1106241051842326669',
      client_secret: 'w3lRGUVJ4V4g8xqLPafjK7DE63KHdHSs'
    },
    github: {
      client_id: '9998dd51a1d4dc7d0e80',
      client_secret: '03ecf50fcb3ef4c08f586201b1177d40632620c3'
    }
  }
}

