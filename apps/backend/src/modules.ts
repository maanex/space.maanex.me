import * as express from 'express'
import { config } from "."
import V1Router from './routes/v1/router'
import Mongo from './database/mongo'


export default class Modules {

  public static async connectMongo() {
    console.log('Connecting to MongoDB')
    await Mongo.connect(config.databases.mongoUrl)
    console.log('MongoDB connected')
  }
  
  public static async startServer() {
    console.log('Launching server')
    const app = express()

    app.set('trust proxy', 1)
    app.use('*', express.json())

    app.use('/v1', V1Router.init())

    app.all('*', (_, res) => res.status(400).end())

    await app.listen(config.port)
    console.log(`Server launched at port ${config.port}`)
  }

}
