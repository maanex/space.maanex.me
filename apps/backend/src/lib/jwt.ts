/**
 * @author Andreas May <andreas@maanex.me>
 * @copyright 2020 File Authors
 */

import { readFileSync } from 'fs'
import * as jwtlib from 'jsonwebtoken'
import { config } from '..'


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

  public static encodeUserToken(userId: string): Promise<string> {
    return this.signRaw({ t: 'user', id: userId }, { expiresIn: '14d' })
  }

}
