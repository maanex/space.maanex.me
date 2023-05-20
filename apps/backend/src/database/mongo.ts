import mongoose from 'mongoose'
import { EntityModel } from './models/entity'
import { UserModel } from './models/user'


export namespace Mongo {

  export const User = mongoose.model('User', UserModel.Schema)
  export const Entity = mongoose.model('Entity', EntityModel.Schema)

  //

  let connection: mongoose.Connection = null

  export function connect(url?: string): Promise<any> {
    console.info('Connecting to Mongo...')

    return new Promise<any>((resolve, reject) => {
      connection = mongoose.connection
      mongoose.connect(url)
      connection.on('error', reject)
      connection.on('open', () => {
        console.info('Mongo connection estabished')
        resolve(connection)
      })
    })
  }

  export function disconnect(): void {
    connection.close()
  }

}