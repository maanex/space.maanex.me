import { Request, Response } from 'express'
import JWT from '../../lib/jwt'
import ReqError from '../../lib/req-error'


export async function postJoinGame(req: Request, res: Response) {
  return res.status(200).json({
  })
}
