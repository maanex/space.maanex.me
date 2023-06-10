import { Request, Response } from 'express'
import OAuthStrat, { UnifiedUserObject } from '../lib/oauth-strat.js'
import ReqError from '../lib/req-error.js'
import { UserAuth } from '../lib/user-auth.js'
import { UserModel } from '../database/models/user.js'
import JWT from '../lib/jwt.js'
import { Packet } from '@maanex/spacelib-common'


export function getLogin(req: Request, res: Response) {
  const provider = req.params.provider
  if (!provider)
    return ReqError.badRequest(res, 'missing_provider', 'Missing Provider')

  const url = (provider === 'discord')
    ? OAuthStrat.DISCORD_URL
    : (provider === 'github')
      ? OAuthStrat.GITHUB_URL
      : null

  res.status(200).send({ url })
}

export async function postCode(req: Request, res: Response) {
  const provider = req.params.provider
  if (!provider)
    return ReqError.badRequest(res, 'missing_provider', 'Missing Provider')

  const code = req.body?.code
  if (!code)
    return ReqError.badRequest(res, 'missing_code', 'Missing Code')

  let authUser: UnifiedUserObject | { error: string } = null
  switch (provider) {
    case 'discord':
      authUser = await OAuthStrat.discordCallback(code)
      break
    case 'github':
      authUser = await OAuthStrat.githubCallback(code)
      break
  }

  if (!authUser)
    return ReqError.badRequest(res, 'invalid_provider', 'Invalid Provider')

  if ('error' in authUser)
    return res.status(400).send({ success: false, error: authUser.error, message: 'An error occurred' })

  const authed = await UserAuth.loginOrRegisterUser(authUser)

  if (typeof authed === 'string')
    return res.status(400).send({ success: false, error: authed, message: 'error in userauth' })

  const [ token, user, initial ] = authed

  res.status(200).send({
    token,
    user,
    initial,
    $update: {
      token,
      account: {
        name: authUser.username,
        sig: user.id.slice(-4),
        tos: user.tos
      },
      pos: {
        x: user.posX,
        y: user.posY
      },
      props: {
        resources: user.resources,
        extraRadiation: 0,
        unlocks: user.unlocks
      } satisfies Packet.SC.UserPropsUpdate
    }
  })
}

export async function getMe(_req: Request, res: Response) {
  return res.status(200).json({
    ...UserModel.sanitize(res.locals.user),
    $update: {
      token: await JWT.signAuth({ id: res.locals.user._id }),
      account: {
        name: res.locals.user.authn.username,
        sig: res.locals.user.id.slice(-4),
        tos: res.locals.user.tos
      },
      pos: {
        x: res.locals.user.posX,
        y: res.locals.user.posY
      },
      props: {
        resources: res.locals.user.resources,
        extraRadiation: 0,
        unlocks: res.locals.user.unlocks
      } satisfies Packet.SC.UserPropsUpdate
    }
  })
}

export async function postTos(req: Request, res: Response) {
  if (!req.body?.accept)
    return ReqError.badRequest(res, 'TOS not accepted', 'Please accept the Terms of Service')

  res.locals.user.tos = true
  await res.locals.user.save()
  res.status(200).json({
    success: true,
    $update: {
      account: {
        tos: res.locals.user.tos
      }
    }
  })
}
