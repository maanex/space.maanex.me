export * from './config.js'
import { Modules } from './modules.js'


async function run() {
  await Modules.connectMongo()
  await Modules.startServer()
  await Modules.startWorld()
}

run().catch((err) => {
  console.error('Error in main:')
  // eslint-disable-next-line no-console
  console.trace(err)
})
