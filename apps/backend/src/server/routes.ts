import { Response, Router } from 'express'
import cors from 'cors'
import ReqError from '../lib/req-error.js'
import gateway from '../middleware/gateway.js'
import { config } from '../config.js'
import { getLogin, getMe, postCode, postTos } from './auth.js'


export default class Routes {

  private static ctx: Router

  public static init(): Router {
    this.ctx = Router()
    this.addRoutes()

    return this.ctx
  }

  private static addRoutes() {
    const r = this.ctx

    /* GATEWAY */

    r.use(cors({
      origin: config.frontend.url ?? 'http://localhost:3000',
      credentials: true
    }))


    /* ENDPOINTS */

    // auth
    r.get(  '/auth/login/:provider',  gateway(false),  getLogin )
    r.post( '/auth/code/:provider',   gateway(false),  postCode )
    r.get(  '/auth/me',               gateway(true),   getMe    )
    r.post( '/account/tos',           gateway(true),   postTos  )



    /* Default 404 handler */

    r.all('*', (_, res: Response) => ReqError.notFound(res, 'Endpoint Not Found'))
  }

}
