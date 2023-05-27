import { config } from '../index.js'
import { UserModel } from '../database/models/user.js'
import { Mongo } from "../database/mongo.js"
import { UserManager } from '../database/user-manager.js'
import JWT from './jwt.js'
import { UnifiedUserObject } from './oauth-strat.js'


export namespace UserAuth {

  export type Payload = {
    id: string
  }

  //

  export async function parseUser(header: string): Promise<Payload | null> {
    const payload: any = await JWT.decodeRaw(header, false)
    if (!payload?.id) return null

    return {
      id: payload.id
    }
  }

  /**
   * Oauth callback to token
   * @param user user to login or register
   * @returns tupel with JWT, user object and boolean whether setup is required or not
   */
  export async function loginOrRegisterUser(user: UnifiedUserObject): Promise<[string, UserModel.Type, boolean]> {
    if (config.auth.requireEmail && !user.email_verified) return

    const found: UserModel.Type = await Mongo.User.findOne({ uuid: user.uuid }).exec()

    if (found) {
      UserManager.introduceUser(found)
      return [ await JWT.signAuth({ id: found._id }), found, false ]
    }

    const authn = { ...user }
    delete authn.uuid
    delete authn.data

    const create = new Mongo.User({
      uuid: user.uuid,
      authn
    })
    const obj = await create.save()
    return [ await JWT.signAuth({ id: obj._id }), create, true ]
  }

}
