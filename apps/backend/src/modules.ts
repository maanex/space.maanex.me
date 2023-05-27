import * as http from 'http'
import express from 'express'
import { config } from "./index.js"
import Routes from './server/routes.js'
import { Mongo } from './database/mongo.js'
import SocketServer from './server/socket.js'
import { Session } from './app/session.js'


export namespace Modules {

  export async function connectMongo() {
    console.log('Connecting to MongoDB')
    await Mongo.connect(config.databases.mongoUrl)
    console.log('MongoDB connected')
  }
  
  export async function startServer() {
    console.log('Launching server')
    const app = express()

    app.set('trust proxy', 1)
    app.use('*', express.json())

    app.use('/rest', Routes.init())

    app.all('*', (_, res) => res.status(400).end())

    const host = http.createServer(app)

    SocketServer.init(host)

    await host.listen(config.port)
    console.log(`Server launched at port ${config.port}`)
  }

  export function startWorld() {
    Session.init()
  }

}


// 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express'
import { UserModel } from './database/models/user.js'


declare module 'express' {
  interface Response {
    locals: {
      user: UserModel.Type
    }
  }
}
