import * as mongoose from 'mongoose'
import { UserModel } from './models/user'


export default class Mongo {

  public static connection: mongoose.Connection;

  public static User = mongoose.model('User', UserModel.Schema)

  //

  public static connect(url?: string): Promise<any> {
    console.info('Connecting to Mongo...')

    return new Promise<any>((resolve, reject) => {
      this.connection = mongoose.connection
      mongoose.connect(url)
      this.connection.on('error', reject)
      this.connection.on('open', () => {
        console.info('Mongo connection estabished')
        resolve(this.connection)
      })
    })
  }

  public static disconnect(): void {
    this.connection.close()
  }

}