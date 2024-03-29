import { config } from '../index.js'
import { UserModel } from '../database/models/user.js'
import { Mongo } from "../database/mongo.js"
import { UserManager } from '../app/user-manager.js'
import JWT from './jwt.js'
import { UnifiedUserObject } from './oauth-strat.js'
import { sendDiscordWebhook } from './discord.js'


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
  export async function loginOrRegisterUser(user: UnifiedUserObject): Promise<[string, UserModel.Type, boolean] | 'bad_gateway' | 'missing_permissions'> {
    if (config.auth.requireEmail && !user.email_verified) return 'missing_permissions'

    const found: UserModel.Type | 0 = await Mongo.User.findOne({ uuid: user.uuid }).exec().catch(() => 0)

    if (found === 0)
      return 'bad_gateway'

    if (found) {
      UserManager.introduceUser(found)
      sendDiscordWebhook('USER', `${user.uuid} (${user.username}) logged in`)
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
    sendDiscordWebhook('USER', `${user.uuid} (${user.username}) joined newly`)
    return [ await JWT.signAuth({ id: obj._id }), create, true ]
  }

}
