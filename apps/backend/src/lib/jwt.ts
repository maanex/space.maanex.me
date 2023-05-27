/**
 * @author Andreas May <andreas@maanex.me>
 * @copyright 2020 File Authors
 */

import { readFileSync } from 'fs'
import jwtlib from 'jsonwebtoken'
import { config } from '../index.js'
import type { UserAuth } from './user-auth.js'


export default class JWT {

  private static privateKey = (() => {
    try {
      return readFileSync(config.keys.privateKeyUri).toString()
    } catch (ex) {
      console.warn('>> JWT is missing a private key!')
      return 'undefined'
    }
  })()

  //

  public static signRaw(payload: object, options: jwtlib.SignOptions = {}): Promise<string> {
    return new Promise(res => jwtlib.sign(payload, JWT.privateKey, options, (_, token) => res(token)))
  }

  public static decodeRaw(token: string, allowUnsigned = false): Promise<Record<string, any> | undefined> {
    if (allowUnsigned)
      return new Promise(res => res(jwtlib.decode(token, { json: true })))
    return new Promise(res => jwtlib.verify(token, JWT.privateKey, {}, (_, decoded) => res(decoded)))
  }

  //

  public static signAuth(user: UserAuth.Payload): Promise<string> {
    return this.signRaw(user, { expiresIn: '14d' })
  }

}
