// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express'


declare module 'express' {
  interface Response {
    locals: {
      // pagination
      pageOffset: number
      pageAmount: number
    }
  }
}
