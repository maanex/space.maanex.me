import { Request, Response } from 'express'
import OAuthStrat, { UnifiedUserObject } from '../../lib/oauth-strat'
import ReqError from '../../lib/req-error'
import { UserAuth } from '../../lib/user-auth'
import { UserModel } from '../../database/models/user'
import JWT from '../../lib/jwt'


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

  const [ token, user, initial ] = await UserAuth.loginOrRegisterUser(authUser)

  res.status(200).send({
    token,
    user,
    initial,
    $update: { token }
  })
}

export async function getMe(_req: Request, res: Response) {
  if (!res.locals.user)
    return ReqError.invalidAuth(res)

  return res.status(200).json({
    ...UserModel.sanitize(res.locals.user),
    $update: {
      token: await JWT.signAuth({ id: res.locals.user._id })
    }
  })
}
