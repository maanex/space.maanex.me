// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express'
import { UserModel } from '../database/models/user'


declare module 'express' {
  interface Response {
    locals: {
      user: UserModel.Type
    }
  }
}
