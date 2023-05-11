import { Request, Response, NextFunction } from 'express'
import ReqError from '../lib/req-error'

//

export function apiGateway(): (req: Request, res: Response, next: NextFunction) => any {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO:
    // - record metrics (maybe, rather not tho)
    // - filter out spam not triggered by rate-limits
    
    next()
  }
}
