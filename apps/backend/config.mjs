const fs = require('fs')
let devConfig
try { devConfig = require('./dev-config') } catch (ex) { }

const secretPrefix = 'MNXSPACE_'
const secretSuffix = ''

function loadArg(name) {
  const extName = secretPrefix + name + secretSuffix

  if (devConfig?.env[extName] !== undefined)
    return devConfig.env[extName]
  else if (fs.existsSync(`/run/secrets/${extName}`))
    return fs.readFileSync('/run/secrets/' + extName).toString()
  else
    return process.env[extName]
}


/** @type {import('./src/types/config').configjs} */
export default {
  port: Number(loadArg('MNXSPACE_PORT') ?? 80),
  frontend: {
    url: loadArg('MNXSPACE_FRONTEND_URL')
  },
  keys: {
    privateKeyUri: loadArg('MNXSPACE_PRIVATE_KEY_URI')
  },
  databases: {
    mongoUrl: loadArg('MNXSPACE_MONGO_URL')
  },
  caches: {
    usersTtl: 1000 * 60,
    entitiesTtl: 1000 * 60,
    naturalEntitiesTtl: 1000 * 60 * 3
  },
  auth: {
    requireEmail: false,
    callbackUrl: 'http://localhost:3000/callback',
    discord: {
      client_id: '1106241051842326669',
      client_secret: loadArg('MNXSPACE_DISCORD_CLIENT_SECRET')
    },
    github: {
      client_id: '9998dd51a1d4dc7d0e80',
      client_secret: loadArg('MNXSPACE_GITHUB_CLIENT_SECRET')
    }
  }
}

