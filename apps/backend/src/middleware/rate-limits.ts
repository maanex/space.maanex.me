import { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import ReqError from '../lib/req-error.js'


export function rateLimiter(max: number, window: number) {
  return rateLimit({
    windowMs: window * 1000,
    max,
    headers: true,
    keyGenerator(req: Request) {
      return req.headers.authorization || req.ip
    },
    handler(_, res: Response) {
      ReqError.rateLimited(res)
    }
  })
}