/* eslint-disable import/order, import/first */
import { configjs } from './types/config'
export const config = require('../config.js') as configjs

//

import Modules from './modules'


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
