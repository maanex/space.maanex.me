/* eslint-disable import/order, import/first */
import { configjs } from './types/config'
export const config = require('../config.js') as configjs

//

import Modules from './modules'


async function run() {
  console.log('Starting...')

  Modules.startServer()
}

run().catch((err) => {
  console.error('Error in main:')
  // eslint-disable-next-line no-console
  console.trace(err)
})
