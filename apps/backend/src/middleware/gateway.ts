import { Request, Response, NextFunction } from 'express'
import ReqError from '../lib/req-error.js'
import JWT from '../lib/jwt.js'
import { UserAuth } from '../lib/user-auth.js'
import { UserManager } from '../database/user-manager.js'


export default function gateway(needsAuth: boolean): (req: Request, res: Response, next: NextFunction) => any {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const authPayload = await JWT.decodeRaw(req.headers.authorization) as UserAuth.Payload | undefined
      if (authPayload)
        res.locals.user = await UserManager.getUser(authPayload.id)
      else
        res.locals.user = null
    }

    if (needsAuth && !res.locals.user)
      ReqError.invalidAuth(res)
    else
      next()
  }
}
