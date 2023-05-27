import fs from 'fs'

const devConfig = fs.existsSync('./dev-config.json')
  ? JSON.parse(fs.readFileSync('./dev-config.json'))
  : null

function loadArg(name) {
  if (devConfig?.env[name] !== undefined)
    return devConfig.env[name]
  else if (fs.existsSync(`/run/secrets/${name}`))
    return fs.readFileSync('/run/secrets/' + name).toString()
  else
    return process.env[name]
}


/** @type {import('./src/types/config').configjs} */
export default {
  port: Number(loadArg('MNXSPACE_PORT') ?? 80),
  frontend: {
    url: loadArg('MNXSPACE_FRONTEND_URL')
  },
  notifications: {
    discordWebhookUrl: loadArg('MNXSPACE_DISCORD_WEBHOOK_URL')
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
    callbackUrl: loadArg('MNXSPACE_CALLBACK_URL'),
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

