import { Response, Router } from 'express'
import * as cors from 'cors'
import ReqError from '../../lib/req-error'
import { apiGateway } from '../../middleware/api-gateway'
import { rateLimiter as limit } from '../../middleware/rate-limits'
import { postCreateGame } from './create-game'
import { postJoinGame } from './join-game'
import { config } from '../..'


export default class V1Router {

  private static ctx: Router

  public static init(): Router {
    this.ctx = Router()
    this.addRoutes()

    return this.ctx
  }

  private static addRoutes() {
    const r = this.ctx

    /* GATEWAY */

    r.all('*', apiGateway())

    r.use(cors({
      origin: config.frontend.url ?? 'http://localhost:3000'
    }))


    /* ENDPOINTS */

    // create game, 10 in 5 minutes
    // r.post('/create-game', limit(10, 5 * 60), postCreateGame)
    r.post('/create-game', postCreateGame)

    // join game, 5 in 20 seconds
    // r.post('/join-game', limit(5, 20), postJoinGame)
    r.post('/join-game', postJoinGame)



    /* Default 404 handler */

    r.all('*', (_, res: Response) => ReqError.notFound(res, 'Endpoint Not Found'))
  }

}
